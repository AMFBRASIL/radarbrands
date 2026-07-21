import { authorizeResource } from "../../shared/auth/authorization";
import { ValidationError } from "../../shared/errors";
import { jsonSuccess } from "../../shared/http/response";
import {
  createRoleSchema,
  inviteMemberSchema,
  setInvitedMemberPasswordSchema,
  updateMemberSchema,
  updateRolePermissionsSchema,
  updateRoleSchema,
} from "./team.schemas";
import { teamService } from "./team.service";

const TEAM_PERMISSION = "team.manage";

export async function handleListTeamMembers(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const members = await teamService.listMembers(session.organizationId);
  return jsonSuccess(members, requestId);
}

export async function handleListTeamRoles(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const roles = await teamService.listRoles(session.organizationId);
  return jsonSuccess(roles, requestId);
}

export async function handleCreateTeamRole(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const body = await request.json();
  const parsed = createRoleSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const role = await teamService.createRole({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    userAgent: request.headers.get("user-agent"),
    data: parsed.data,
  });

  return jsonSuccess(role, requestId, { status: 201 });
}

export async function handleUpdateTeamRole(
  request: Request,
  requestId: string,
  roleCode: string,
): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const body = await request.json();
  const parsed = updateRoleSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const role = await teamService.updateRole({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    roleCode,
    userAgent: request.headers.get("user-agent"),
    data: parsed.data,
  });

  return jsonSuccess(role, requestId);
}

export async function handleInviteTeamMember(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const body = await request.json();
  const parsed = inviteMemberSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const member = await teamService.inviteMember({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    actorName: session.user.fullName,
    userAgent: request.headers.get("user-agent"),
    data: parsed.data,
  });

  return jsonSuccess(member, requestId, { status: 201 });
}

export async function handleUpdateTeamMember(
  request: Request,
  requestId: string,
  memberUuid: string,
): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const body = await request.json();
  const parsed = updateMemberSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const member = await teamService.updateMember({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    memberUuid,
    userAgent: request.headers.get("user-agent"),
    data: parsed.data,
  });

  return jsonSuccess(member, requestId);
}

export async function handleRemoveTeamMember(
  request: Request,
  requestId: string,
  memberUuid: string,
): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  await teamService.removeMember({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    memberUuid,
    userAgent: request.headers.get("user-agent"),
  });
  return jsonSuccess({ ok: true }, requestId);
}

export async function handleResendTeamInvite(
  request: Request,
  requestId: string,
  memberUuid: string,
): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  await teamService.resendInvite({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    actorName: session.user.fullName,
    memberUuid,
    userAgent: request.headers.get("user-agent"),
  });
  return jsonSuccess({ ok: true }, requestId);
}

export async function handleSetInvitedMemberPassword(
  request: Request,
  requestId: string,
  memberUuid: string,
): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const body = await request.json();
  const parsed = setInvitedMemberPasswordSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const member = await teamService.setInvitedMemberPassword({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    memberUuid,
    userAgent: request.headers.get("user-agent"),
    data: parsed.data,
  });

  return jsonSuccess(member, requestId);
}

export async function handleUpdateRolePermissions(
  request: Request,
  requestId: string,
  roleCode: string,
): Promise<Response> {
  const session = await authorizeResource(request, TEAM_PERMISSION);
  const body = await request.json();
  const parsed = updateRolePermissionsSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const role = await teamService.updateRolePermissions({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    roleCode,
    permissionCodes: parsed.data.permissionCodes,
    userAgent: request.headers.get("user-agent"),
  });

  return jsonSuccess(role, requestId);
}
