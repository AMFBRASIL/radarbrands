import { randomUUID } from "node:crypto";

import { prisma } from "../../shared/database";
import {
  ORGANIZATION_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE_REMEMBER_SEC,
  buildOrganizationCookie,
  buildSessionCookie,
  clearCookie,
  parseCookies,
} from "../../shared/auth/cookies";
import { getPermissionsForRole, hasPermission } from "../../shared/auth/permissions";
import type { AuthContext, ResolvedSession, SessionUser } from "../../shared/auth/types";
import {
  AuthenticationError,
  AuthorizationError,
  BusinessRuleError,
  ConflictError,
} from "../../shared/errors";
import { isProduction } from "../../shared/env";
import { writeAuditLog } from "../audit/audit.service";
import {
  createOrganizationWithOwner,
  getOrganizationByUuidForUser,
  listUserOrganizations,
  organizationDisplayName,
} from "../organizations/organization.service";
import type { AcceptInviteInput, LoginInput, RegisterInput } from "./auth.schemas";
import {
  consumeInviteToken,
  findValidInviteToken,
} from "./invite-token.service";
import { getPasswordAlgo, hashPassword, verifyPassword } from "./password.service";
import { createSession, findValidSessionByToken, revokeSessionByToken } from "./session.service";

function isUserActive(status: string, deletedAt: Date | null): boolean {
  return !deletedAt && (status === "active" || status === "invited");
}

async function resolveMembership(userId: bigint, organizationUuid?: string | null) {
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId,
      status: "active",
      organization: { deletedAt: null },
    },
    include: {
      organization: {
        select: {
          id: true,
          uuid: true,
          legalName: true,
          tradeName: true,
          slug: true,
          planTier: true,
          status: true,
        },
      },
      role: {
        select: { id: true, code: true, name: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (memberships.length === 0) {
    return { organization: null, membership: null, organizationId: null as bigint | null };
  }

  const selected =
    memberships.find((m) => m.organization.uuid === organizationUuid) ?? memberships[0];

  const permissions = await getPermissionsForRole(selected.role.id);

  return {
    organizationId: selected.organization.id,
    organization: {
      uuid: selected.organization.uuid,
      legalName: selected.organization.legalName,
      tradeName: selected.organization.tradeName,
      slug: selected.organization.slug,
      planTier: selected.organization.planTier,
      status: selected.organization.status,
      displayName: organizationDisplayName(selected.organization),
    },
    membership: {
      roleCode: selected.role.code,
      roleName: selected.role.name,
      permissions,
    },
  };
}

export async function buildAuthContext(
  userId: bigint,
  user: SessionUser,
  organizationUuid?: string | null,
): Promise<AuthContext> {
  const organizations = await listUserOrganizations(userId);
  const membershipResult = await resolveMembership(userId, organizationUuid);

  return {
    user,
    organization: membershipResult.organization,
    membership: membershipResult.membership,
    organizations,
  };
}

export async function resolveSessionFromRequest(request: Request): Promise<ResolvedSession | null> {
  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionToken = cookies[SESSION_COOKIE];
  if (!sessionToken) return null;

  const session = await findValidSessionByToken(sessionToken);
  if (!session?.user || !isUserActive(session.user.status, session.user.deletedAt)) {
    return null;
  }

  const user: SessionUser = {
    uuid: session.user.uuid,
    email: session.user.email,
    fullName: session.user.fullName,
    displayName: session.user.displayName,
    avatarUrl: session.user.avatarUrl,
  };

  const organizationUuid = cookies[ORGANIZATION_COOKIE] ?? null;
  const membershipResult = await resolveMembership(session.user.id, organizationUuid);
  const organizations = await listUserOrganizations(session.user.id);

  return {
    userId: session.user.id,
    organizationId: membershipResult.organizationId,
    user,
    organization: membershipResult.organization,
    membership: membershipResult.membership,
    organizations,
  };
}

function authCookieHeaders(token: string, maxAgeSec: number, organizationUuid?: string): Headers {
  const headers = new Headers();
  const secure = isProduction;
  headers.append("Set-Cookie", buildSessionCookie(token, maxAgeSec, secure));
  if (organizationUuid) {
    headers.append("Set-Cookie", buildOrganizationCookie(organizationUuid, maxAgeSec, secure));
  }
  return headers;
}

function clearAuthCookieHeaders(): Headers {
  const headers = new Headers();
  headers.append("Set-Cookie", clearCookie(SESSION_COOKIE));
  headers.append("Set-Cookie", clearCookie(ORGANIZATION_COOKIE));
  return headers;
}

export async function registerUser(input: RegisterInput, request: Request) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      uuid: true,
      email: true,
      fullName: true,
      displayName: true,
      avatarUrl: true,
      status: true,
      passwordHash: true,
      deletedAt: true,
    },
  });

  if (existing?.deletedAt) {
    throw new ConflictError("Este e-mail não está disponível");
  }

  const passwordHash = await hashPassword(input.password);
  let userId: bigint;
  let user: SessionUser;

  if (existing) {
    if (existing.passwordHash || existing.status !== "invited") {
      throw new ConflictError("Este e-mail já está cadastrado");
    }

    const updated = await prisma.user.update({
      where: { id: existing.id },
      data: {
        fullName: input.fullName,
        displayName: input.fullName.split(" ")[0] ?? input.fullName,
        passwordHash,
        passwordAlgo: getPasswordAlgo(),
        status: "active",
      },
      select: {
        id: true,
        uuid: true,
        email: true,
        fullName: true,
        displayName: true,
        avatarUrl: true,
      },
    });

    userId = updated.id;
    user = {
      uuid: updated.uuid,
      email: updated.email,
      fullName: updated.fullName,
      displayName: updated.displayName,
      avatarUrl: updated.avatarUrl,
    };

    await prisma.organizationMember.updateMany({
      where: {
        userId: updated.id,
        status: "invited",
      },
      data: {
        status: "active",
        acceptedAt: new Date(),
      },
    });
  } else {
    const created = await prisma.user.create({
      data: {
        uuid: randomUUID(),
        email: input.email,
        fullName: input.fullName,
        displayName: input.fullName.split(" ")[0] ?? input.fullName,
        passwordHash,
        passwordAlgo: getPasswordAlgo(),
        status: "active",
        emailVerifiedAt: null,
      },
      select: {
        id: true,
        uuid: true,
        email: true,
        fullName: true,
        displayName: true,
        avatarUrl: true,
      },
    });

    userId = created.id;
    user = {
      uuid: created.uuid,
      email: created.email,
      fullName: created.fullName,
      displayName: created.displayName,
      avatarUrl: created.avatarUrl,
    };
  }

  const existingMembership = await prisma.organizationMember.findFirst({
    where: {
      userId,
      status: "active",
      organization: { deletedAt: null },
    },
    select: { organization: { select: { uuid: true } } },
  });

  let organizationUuid: string;

  if (existingMembership) {
    organizationUuid = existingMembership.organization.uuid;
  } else {
    const createdOrg = await createOrganizationWithOwner({
      userId,
      fullName: input.fullName,
      companyName: input.companyName,
      email: input.email,
    });
    organizationUuid = createdOrg.organizationUuid;
  }

  const { token, maxAgeSec } = await createSession({
    userId,
    userAgent: request.headers.get("user-agent"),
    rememberMe: true,
  });

  await writeAuditLog({
    actorUserId: userId,
    action: existing ? "auth.register_invite_completed" : "auth.register",
    entityType: "user",
    entityId: userId,
    userAgent: request.headers.get("user-agent"),
    after: { email: user.email },
  });

  const authContext = await buildAuthContext(userId, user, organizationUuid);

  return {
    auth: authContext,
    headers: authCookieHeaders(token, maxAgeSec, organizationUuid),
  };
}

export async function previewInviteToken(rawToken: string) {
  const record = await findValidInviteToken(rawToken);
  return {
    email: record.user.email,
    fullName: record.user.fullName,
    organizationName: organizationDisplayName(record.organization),
    expiresAt: record.expiresAt.toISOString(),
  };
}

export async function acceptInvite(input: AcceptInviteInput, request: Request) {
  const record = await findValidInviteToken(input.token);
  const passwordHash = await hashPassword(input.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.user.id },
      data: {
        passwordHash,
        passwordAlgo: getPasswordAlgo(),
        status: "active",
        lastLoginAt: new Date(),
      },
    }),
    prisma.organizationMember.updateMany({
      where: {
        userId: record.user.id,
        organizationId: record.organizationId,
        status: "invited",
      },
      data: {
        status: "active",
        acceptedAt: new Date(),
      },
    }),
  ]);

  await consumeInviteToken(record.id);

  const { token, maxAgeSec } = await createSession({
    userId: record.user.id,
    userAgent: request.headers.get("user-agent"),
    rememberMe: true,
  });

  const sessionUser: SessionUser = {
    uuid: record.user.uuid,
    email: record.user.email,
    fullName: record.user.fullName,
    displayName: record.user.fullName.split(" ")[0] ?? record.user.fullName,
    avatarUrl: null,
  };

  await writeAuditLog({
    organizationId: record.organizationId,
    actorUserId: record.user.id,
    action: "auth.invite_accepted",
    entityType: "user",
    entityId: record.user.id,
    userAgent: request.headers.get("user-agent"),
  });

  const authContext = await buildAuthContext(
    record.user.id,
    sessionUser,
    record.organization.uuid,
  );

  return {
    auth: authContext,
    headers: authCookieHeaders(token, maxAgeSec, record.organization.uuid),
  };
}

export async function loginUser(input: LoginInput, request: Request) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    select: {
      id: true,
      uuid: true,
      email: true,
      fullName: true,
      displayName: true,
      avatarUrl: true,
      passwordHash: true,
      status: true,
      deletedAt: true,
    },
  });

  if (!user?.passwordHash || !isUserActive(user.status, user.deletedAt)) {
    throw new AuthenticationError("E-mail ou senha inválidos");
  }

  const valid = await verifyPassword(user.passwordHash, input.password);
  if (!valid) {
    await writeAuditLog({
      actorUserId: user.id,
      action: "auth.login_failed",
      entityType: "user",
      entityId: user.id,
      userAgent: request.headers.get("user-agent"),
    });
    throw new AuthenticationError("E-mail ou senha inválidos");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date(), status: "active" },
  });

  const { token, maxAgeSec } = await createSession({
    userId: user.id,
    userAgent: request.headers.get("user-agent"),
    rememberMe: input.rememberMe,
  });

  const organizations = await listUserOrganizations(user.id);
  const organizationUuid = organizations[0]?.uuid;

  await writeAuditLog({
    actorUserId: user.id,
    action: "auth.login",
    entityType: "session",
    userAgent: request.headers.get("user-agent"),
  });

  const sessionUser: SessionUser = {
    uuid: user.uuid,
    email: user.email,
    fullName: user.fullName,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };

  const authContext = await buildAuthContext(user.id, sessionUser, organizationUuid);

  return {
    auth: authContext,
    headers: authCookieHeaders(token, maxAgeSec, organizationUuid),
  };
}

export async function logoutUser(request: Request) {
  const cookies = parseCookies(request.headers.get("cookie"));
  const sessionToken = cookies[SESSION_COOKIE];
  const session = sessionToken ? await findValidSessionByToken(sessionToken) : null;

  if (sessionToken) {
    await revokeSessionByToken(sessionToken);
  }

  if (session?.user) {
    await writeAuditLog({
      actorUserId: session.user.id,
      action: "auth.logout",
      entityType: "session",
      userAgent: request.headers.get("user-agent"),
    });
  }

  return { headers: clearAuthCookieHeaders() };
}

export async function switchActiveOrganization(request: Request, organizationUuid: string) {
  const session = await resolveSessionFromRequest(request);
  if (!session) {
    throw new AuthenticationError();
  }

  const organization = await getOrganizationByUuidForUser(organizationUuid, session.userId);
  if (!organization) {
    throw new AuthorizationError("Você não pertence a esta organização");
  }

  const auth = await buildAuthContext(session.userId, session.user, organizationUuid);
  const headers = new Headers();
  const secure = isProduction;
  headers.append(
    "Set-Cookie",
    buildOrganizationCookie(organizationUuid, SESSION_MAX_AGE_REMEMBER_SEC, secure),
  );

  return { auth, headers };
}

export async function getCurrentAuth(request: Request): Promise<AuthContext | null> {
  const session = await resolveSessionFromRequest(request);
  if (!session) return null;
  return {
    user: session.user,
    organization: session.organization,
    membership: session.membership,
    organizations: session.organizations,
  };
}

export function requirePermission(session: ResolvedSession, permission: string): void {
  const permissions = session.membership?.permissions ?? [];
  if (!hasPermission(permissions, permission)) {
    throw new AuthorizationError("Sem permissão para esta operação");
  }
}

export function requireOrganization(session: ResolvedSession): bigint {
  if (!session.organizationId) {
    throw new BusinessRuleError("Nenhuma organização ativa na sessão");
  }
  return session.organizationId;
}
