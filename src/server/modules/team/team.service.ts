import { randomUUID } from "node:crypto";

import type { MemberStatus, UserStatus } from "@prisma/client";

import { env } from "../../shared/env";
import { clearPermissionCache, getPermissionsForRole } from "../../shared/auth/permissions";
import { prisma } from "../../shared/database";
import {
  AuthorizationError,
  BusinessRuleError,
  ConflictError,
  NotFoundError,
} from "../../shared/errors";
import { writeAuditLog } from "../audit/audit.service";
import {
  createInviteToken,
  invalidateInviteTokensForMembership,
} from "../auth/invite-token.service";
import { getPasswordAlgo, hashPassword } from "../auth/password.service";
import { emailService } from "../email";
import {
  PROTECTED_ROLE_CODES,
  slugifyRoleCode,
  type CreateRoleInput,
  type InviteMemberInput,
  type SetInvitedMemberPasswordInput,
  type UpdateMemberInput,
  type UpdateRoleInput,
} from "./team.schemas";

export type TeamMemberDto = {
  uuid: string;
  fullName: string;
  email: string;
  roleCode: string;
  roleName: string;
  status: "active" | "invited" | "suspended";
  lastLoginAt: string | null;
  invitedAt: string | null;
};

export type TeamRoleDto = {
  code: string;
  name: string;
  description: string | null;
  scope: "org" | "system";
  memberCount: number;
  permissions: string[];
};

function mapMemberStatus(memberStatus: MemberStatus, userStatus: UserStatus): TeamMemberDto["status"] {
  if (memberStatus === "invited") return "invited";
  if (userStatus === "disabled" || userStatus === "locked") return "suspended";
  return "active";
}

async function getRoleByCode(code: string) {
  const role = await prisma.role.findUnique({
    where: { code },
    select: { id: true, code: true, name: true, scope: true },
  });
  if (!role) throw new NotFoundError("Perfil não encontrado");
  return role;
}

async function assertCanManageTeam(input: {
  organizationId: bigint;
  actorUserId: bigint;
  targetUserUuid?: string;
}) {
  const actorMembership = await prisma.organizationMember.findFirst({
    where: {
      organizationId: input.organizationId,
      userId: input.actorUserId,
      status: "active",
    },
    include: { role: { select: { code: true } } },
  });

  if (!actorMembership) {
    throw new AuthorizationError();
  }

  if (input.targetUserUuid) {
    const target = await prisma.user.findUnique({
      where: { uuid: input.targetUserUuid },
      select: { id: true },
    });
    if (target && target.id === input.actorUserId && actorMembership.role.code === "owner") {
      throw new BusinessRuleError("Você não pode alterar seu próprio perfil de owner");
    }
  }
}

export async function listTeamMembers(organizationId: bigint): Promise<TeamMemberDto[]> {
  const members = await prisma.organizationMember.findMany({
    where: {
      organizationId,
      status: { in: ["active", "invited"] },
    },
    include: {
      user: {
        select: {
          uuid: true,
          email: true,
          fullName: true,
          status: true,
          lastLoginAt: true,
        },
      },
      role: {
        select: { code: true, name: true },
      },
    },
    orderBy: [{ status: "asc" }, { createdAt: "asc" }],
  });

  return members.map((member) => ({
    uuid: member.user.uuid,
    fullName: member.user.fullName,
    email: member.user.email,
    roleCode: member.role.code,
    roleName: member.role.name,
    status: mapMemberStatus(member.status, member.user.status),
    lastLoginAt: member.user.lastLoginAt?.toISOString() ?? null,
    invitedAt: member.invitedAt?.toISOString() ?? null,
  }));
}

export async function listTeamRoles(organizationId: bigint): Promise<TeamRoleDto[]> {
  const [roles, memberCounts] = await Promise.all([
    prisma.role.findMany({
      orderBy: { id: "asc" },
      select: {
        code: true,
        name: true,
        description: true,
        scope: true,
        id: true,
      },
    }),
    prisma.organizationMember.groupBy({
      by: ["roleId"],
      where: {
        organizationId,
        status: { in: ["active", "invited"] },
      },
      _count: { _all: true },
    }),
  ]);

  const countByRoleId = new Map(memberCounts.map((row) => [row.roleId, row._count._all]));

  const result: TeamRoleDto[] = [];
  for (const role of roles) {
    const permissions = await getPermissionsForRole(role.id);
    result.push({
      code: role.code,
      name: role.name,
      description: role.description,
      scope: role.scope,
      memberCount: countByRoleId.get(role.id) ?? 0,
      permissions,
    });
  }

  return result;
}

async function sendInviteEmail(input: {
  organizationId: bigint;
  to: string;
  fullName: string;
  organizationName: string;
  inviterName: string;
  acceptInviteUrl?: string | null;
}) {
  const loginUrl = `${env.APP_URL}/login`;
  const setupUrl = input.acceptInviteUrl;

  try {
    await emailService.send({
      organizationId: input.organizationId,
      to: input.to,
      subject: `Convite para ${input.organizationName} — Radar Brands`,
      html: `
        <p>Olá, <strong>${input.fullName}</strong>!</p>
        <p><strong>${input.inviterName}</strong> convidou você para a organização <strong>${input.organizationName}</strong> no Radar Brands.</p>
        <p>${
          setupUrl
            ? `Defina sua senha e acesse o painel por este link (válido por 7 dias): <a href="${setupUrl}">${setupUrl}</a>`
            : `Acesse com sua conta existente: <a href="${loginUrl}">${loginUrl}</a>`
        }</p>
      `,
      text: setupUrl
        ? `Você foi convidado para ${input.organizationName}. Defina sua senha em ${setupUrl}`
        : `Você foi adicionado a ${input.organizationName}. Acesse ${loginUrl}`,
    });
  } catch {
    // Convite persiste mesmo se o e-mail da organização não estiver configurado.
  }
}

export async function inviteTeamMember(input: {
  organizationId: bigint;
  actorUserId: bigint;
  actorName: string;
  userAgent?: string | null;
  data: InviteMemberInput;
}) {
  await assertCanManageTeam({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
  });

  const role = await getRoleByCode(input.data.roleCode);
  if (role.scope !== "org" || PROTECTED_ROLE_CODES.has(role.code)) {
    throw new BusinessRuleError("Este perfil não pode ser atribuído via convite");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: input.organizationId },
    select: { legalName: true, tradeName: true },
  });
  if (!organization) throw new NotFoundError("Organização não encontrada");

  const organizationName = organization.tradeName?.trim() || organization.legalName;
  const email = input.data.email.toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, uuid: true, status: true, passwordHash: true, deletedAt: true },
  });

  if (existingUser?.deletedAt) {
    throw new ConflictError("Este e-mail não está disponível");
  }

  const existingMembership = existingUser
    ? await prisma.organizationMember.findUnique({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId: existingUser.id,
          },
        },
        select: { status: true },
      })
    : null;

  if (existingMembership && existingMembership.status !== "removed") {
    throw new ConflictError("Este usuário já faz parte da organização");
  }

  let userId: bigint;
  let userUuid: string;
  let isNewUser = false;
  let memberStatus: MemberStatus;

  if (existingUser) {
    userId = existingUser.id;
    userUuid = existingUser.uuid;
    memberStatus = existingUser.passwordHash ? "active" : "invited";
  } else {
    isNewUser = true;
    memberStatus = "invited";
    const created = await prisma.user.create({
      data: {
        uuid: randomUUID(),
        email,
        fullName: input.data.fullName,
        displayName: input.data.fullName.split(" ")[0] ?? input.data.fullName,
        status: "invited",
      },
      select: { id: true, uuid: true },
    });
    userId = created.id;
    userUuid = created.uuid;
  }

  const membership = existingMembership
    ? await prisma.organizationMember.update({
        where: {
          organizationId_userId: {
            organizationId: input.organizationId,
            userId,
          },
        },
        data: {
          roleId: role.id,
          status: memberStatus,
          invitedBy: input.actorUserId,
          invitedAt: new Date(),
          acceptedAt: memberStatus === "active" ? new Date() : null,
        },
      })
    : await prisma.organizationMember.create({
        data: {
          organizationId: input.organizationId,
          userId,
          roleId: role.id,
          status: memberStatus,
          invitedBy: input.actorUserId,
          invitedAt: new Date(),
          acceptedAt: memberStatus === "active" ? new Date() : null,
        },
      });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.member.invited",
    entityType: "organization_member",
    entityId: membership.id,
    userAgent: input.userAgent,
    after: { email, roleCode: role.code, status: memberStatus },
  });

  let acceptInviteUrl: string | null = null;
  const needsPasswordSetup =
    memberStatus === "invited" && (isNewUser || !existingUser?.passwordHash);

  if (needsPasswordSetup) {
    const { rawToken } = await createInviteToken({
      userId,
      organizationId: input.organizationId,
      createdBy: input.actorUserId,
    });
    acceptInviteUrl = `${env.APP_URL}/accept-invite?token=${encodeURIComponent(rawToken)}`;
  }

  await sendInviteEmail({
    organizationId: input.organizationId,
    to: email,
    fullName: input.data.fullName,
    organizationName,
    inviterName: input.actorName,
    acceptInviteUrl,
  });

  const members = await listTeamMembers(input.organizationId);
  return members.find((member) => member.uuid === userUuid)!;
}

export async function updateTeamMember(input: {
  organizationId: bigint;
  actorUserId: bigint;
  memberUuid: string;
  userAgent?: string | null;
  data: UpdateMemberInput;
}) {
  await assertCanManageTeam({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    targetUserUuid: input.memberUuid,
  });

  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId: input.organizationId,
      user: { uuid: input.memberUuid },
      status: { in: ["active", "invited"] },
    },
    include: {
      role: { select: { code: true } },
      user: { select: { uuid: true } },
    },
  });

  if (!member) throw new NotFoundError("Membro não encontrado");

  if (member.role.code === "owner") {
    throw new BusinessRuleError("O perfil owner não pode ser alterado");
  }

  if (!input.data.roleCode) {
    throw new BusinessRuleError("Nenhuma alteração informada");
  }

  const role = await getRoleByCode(input.data.roleCode);
  if (role.scope !== "org" || PROTECTED_ROLE_CODES.has(role.code)) {
    throw new BusinessRuleError("Perfil inválido para esta organização");
  }

  await prisma.organizationMember.update({
    where: { id: member.id },
    data: { roleId: role.id },
  });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.member.role_updated",
    entityType: "organization_member",
    entityId: member.id,
    userAgent: input.userAgent,
    before: { roleCode: member.role.code },
    after: { roleCode: role.code },
  });

  const members = await listTeamMembers(input.organizationId);
  return members.find((row) => row.uuid === member.user.uuid)!;
}

export async function removeTeamMember(input: {
  organizationId: bigint;
  actorUserId: bigint;
  memberUuid: string;
  userAgent?: string | null;
}) {
  await assertCanManageTeam({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    targetUserUuid: input.memberUuid,
  });

  if (input.actorUserId) {
    const actor = await prisma.user.findUnique({
      where: { id: input.actorUserId },
      select: { uuid: true },
    });
    if (actor?.uuid === input.memberUuid) {
      throw new BusinessRuleError("Você não pode remover a si mesmo");
    }
  }

  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId: input.organizationId,
      user: { uuid: input.memberUuid },
      status: { in: ["active", "invited"] },
    },
    include: { role: { select: { code: true } } },
  });

  if (!member) throw new NotFoundError("Membro não encontrado");
  if (member.role.code === "owner") {
    throw new BusinessRuleError("O owner da organização não pode ser removido");
  }

  await prisma.organizationMember.update({
    where: { id: member.id },
    data: { status: "removed" },
  });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.member.removed",
    entityType: "organization_member",
    entityId: member.id,
    userAgent: input.userAgent,
    before: { roleCode: member.role.code },
  });
}

export async function resendTeamInvite(input: {
  organizationId: bigint;
  actorUserId: bigint;
  actorName: string;
  memberUuid: string;
  userAgent?: string | null;
}) {
  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId: input.organizationId,
      user: { uuid: input.memberUuid },
      status: "invited",
    },
    include: {
      user: { select: { email: true, fullName: true, passwordHash: true } },
      role: { select: { code: true } },
    },
  });

  if (!member) {
    throw new BusinessRuleError("Este membro não possui convite pendente");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: input.organizationId },
    select: { legalName: true, tradeName: true },
  });
  if (!organization) throw new NotFoundError("Organização não encontrada");

  await prisma.organizationMember.update({
    where: { id: member.id },
    data: { invitedAt: new Date(), invitedBy: input.actorUserId },
  });

  let acceptInviteUrl: string | null = null;
  if (!member.user.passwordHash) {
    const { rawToken } = await createInviteToken({
      userId: member.userId,
      organizationId: input.organizationId,
      createdBy: input.actorUserId,
    });
    acceptInviteUrl = `${env.APP_URL}/accept-invite?token=${encodeURIComponent(rawToken)}`;
  }

  await sendInviteEmail({
    organizationId: input.organizationId,
    to: member.user.email,
    fullName: member.user.fullName,
    organizationName: organization.tradeName?.trim() || organization.legalName,
    inviterName: input.actorName,
    acceptInviteUrl,
  });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.member.invite_resent",
    entityType: "organization_member",
    entityId: member.id,
    userAgent: input.userAgent,
  });
}

export async function setInvitedMemberPassword(input: {
  organizationId: bigint;
  actorUserId: bigint;
  memberUuid: string;
  userAgent?: string | null;
  data: SetInvitedMemberPasswordInput;
}) {
  await assertCanManageTeam({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    targetUserUuid: input.memberUuid,
  });

  const member = await prisma.organizationMember.findFirst({
    where: {
      organizationId: input.organizationId,
      user: { uuid: input.memberUuid },
      status: "invited",
    },
    include: {
      user: {
        select: {
          id: true,
          uuid: true,
          email: true,
          status: true,
        },
      },
      role: { select: { code: true } },
    },
  });

  if (!member) {
    throw new BusinessRuleError("Só é possível definir senha de usuários com convite pendente");
  }

  if (PROTECTED_ROLE_CODES.has(member.role.code)) {
    throw new BusinessRuleError("Não é possível alterar a senha deste perfil");
  }

  const passwordHash = await hashPassword(input.data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: member.user.id },
      data: {
        passwordHash,
        passwordAlgo: getPasswordAlgo(),
        status: "active",
      },
    }),
    prisma.organizationMember.update({
      where: { id: member.id },
      data: {
        status: "active",
        acceptedAt: new Date(),
      },
    }),
  ]);

  await invalidateInviteTokensForMembership({
    userId: member.user.id,
    organizationId: input.organizationId,
  });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.member.password_set",
    entityType: "organization_member",
    entityId: member.id,
    userAgent: input.userAgent,
    after: { email: member.user.email, activated: true },
  });

  const members = await listTeamMembers(input.organizationId);
  return members.find((row) => row.uuid === member.user.uuid)!;
}

export async function updateRolePermissions(input: {
  organizationId: bigint;
  actorUserId: bigint;
  roleCode: string;
  permissionCodes: string[];
  userAgent?: string | null;
}) {
  if (PROTECTED_ROLE_CODES.has(input.roleCode)) {
    throw new BusinessRuleError("Este perfil possui acesso total e não pode ser editado");
  }

  const role = await prisma.role.findUnique({
    where: { code: input.roleCode },
    select: { id: true, code: true, scope: true },
  });
  if (!role) throw new NotFoundError("Perfil não encontrado");
  if (role.scope === "system") {
    throw new BusinessRuleError("Perfis de sistema não podem ser editados");
  }

  const permissions = await prisma.permission.findMany({
    select: { id: true, code: true },
  });
  const permissionByCode = new Map(permissions.map((row) => [row.code, row.id]));
  const selectedIds = new Set<number>();

  for (const code of input.permissionCodes) {
    const permissionId = permissionByCode.get(code);
    if (!permissionId) {
      throw new BusinessRuleError(`Permissão inválida: ${code}`);
    }
    selectedIds.add(permissionId);
  }

  const before = await getPermissionsForRole(role.id);

  await prisma.$transaction(async (tx) => {
    await tx.rolePermission.deleteMany({ where: { roleId: role.id } });
    if (selectedIds.size > 0) {
      await tx.rolePermission.createMany({
        data: [...selectedIds].map((permissionId) => ({
          roleId: role.id,
          permissionId,
        })),
      });
    }
  });

  clearPermissionCache();

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.role.permissions_updated",
    entityType: "role",
    userAgent: input.userAgent,
    before: { roleCode: role.code, permissions: before },
    after: { roleCode: role.code, permissions: input.permissionCodes },
  });

  const roles = await listTeamRoles(input.organizationId);
  return roles.find((row) => row.code === input.roleCode)!;
}

export async function createTeamRole(input: {
  organizationId: bigint;
  actorUserId: bigint;
  userAgent?: string | null;
  data: CreateRoleInput;
}): Promise<TeamRoleDto> {
  const code = (input.data.code?.trim() || slugifyRoleCode(input.data.name)).toLowerCase();
  if (!code || PROTECTED_ROLE_CODES.has(code)) {
    throw new BusinessRuleError("Código de perfil inválido ou reservado");
  }

  const existing = await prisma.role.findUnique({
    where: { code },
    select: { id: true },
  });
  if (existing) {
    throw new ConflictError("Já existe um perfil com este código");
  }

  const permissions = await prisma.permission.findMany({
    select: { id: true, code: true },
  });
  const permissionByCode = new Map(permissions.map((row) => [row.code, row.id]));
  const selectedIds: number[] = [];

  for (const permissionCode of input.data.permissionCodes) {
    const permissionId = permissionByCode.get(permissionCode);
    if (!permissionId) {
      throw new BusinessRuleError(`Permissão inválida: ${permissionCode}`);
    }
    selectedIds.push(permissionId);
  }

  const role = await prisma.$transaction(async (tx) => {
    const created = await tx.role.create({
      data: {
        code,
        name: input.data.name.trim(),
        description: input.data.description?.trim() || null,
        scope: "org",
      },
      select: { id: true, code: true },
    });

    if (selectedIds.length > 0) {
      await tx.rolePermission.createMany({
        data: selectedIds.map((permissionId) => ({
          roleId: created.id,
          permissionId,
        })),
      });
    }

    return created;
  });

  clearPermissionCache();

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.role.created",
    entityType: "role",
    userAgent: input.userAgent,
    after: {
      roleCode: role.code,
      name: input.data.name,
      permissions: input.data.permissionCodes,
    },
  });

  const roles = await listTeamRoles(input.organizationId);
  return roles.find((row) => row.code === role.code)!;
}

export async function updateTeamRole(input: {
  organizationId: bigint;
  actorUserId: bigint;
  roleCode: string;
  userAgent?: string | null;
  data: UpdateRoleInput;
}): Promise<TeamRoleDto> {
  if (PROTECTED_ROLE_CODES.has(input.roleCode)) {
    throw new BusinessRuleError("Este perfil não pode ser editado");
  }

  const role = await prisma.role.findUnique({
    where: { code: input.roleCode },
    select: { id: true, code: true, name: true, description: true, scope: true },
  });
  if (!role) throw new NotFoundError("Perfil não encontrado");
  if (role.scope === "system") {
    throw new BusinessRuleError("Perfis de sistema não podem ser editados");
  }

  if (!input.data.name && input.data.description === undefined) {
    throw new BusinessRuleError("Nenhuma alteração informada");
  }

  await prisma.role.update({
    where: { id: role.id },
    data: {
      ...(input.data.name ? { name: input.data.name.trim() } : {}),
      ...(input.data.description !== undefined
        ? { description: input.data.description?.trim() || null }
        : {}),
    },
  });

  await writeAuditLog({
    organizationId: input.organizationId,
    actorUserId: input.actorUserId,
    action: "team.role.updated",
    entityType: "role",
    userAgent: input.userAgent,
    before: { roleCode: role.code, name: role.name, description: role.description },
    after: {
      roleCode: role.code,
      name: input.data.name ?? role.name,
      description: input.data.description ?? role.description,
    },
  });

  const roles = await listTeamRoles(input.organizationId);
  return roles.find((row) => row.code === input.roleCode)!;
}

export const teamService = {
  listMembers: listTeamMembers,
  listRoles: listTeamRoles,
  inviteMember: inviteTeamMember,
  updateMember: updateTeamMember,
  removeMember: removeTeamMember,
  resendInvite: resendTeamInvite,
  setInvitedMemberPassword,
  updateRolePermissions,
  createRole: createTeamRole,
  updateRole: updateTeamRole,
};
