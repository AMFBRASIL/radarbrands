import type { TeamMemberDto, TeamRoleDto } from "@/server/modules/team";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { code: string; message: string; details?: unknown };
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new Error(payload.error?.message ?? "Erro na requisição");
  }
  return payload.data;
}

export type TeamMember = TeamMemberDto;
export type TeamRole = TeamRoleDto;

export async function fetchTeamMembers(): Promise<TeamMember[]> {
  const response = await fetch("/api/v1/team/members", { credentials: "include" });
  return parseApiResponse<TeamMember[]>(response);
}

export async function fetchTeamRoles(): Promise<TeamRole[]> {
  const response = await fetch("/api/v1/team/roles", { credentials: "include" });
  return parseApiResponse<TeamRole[]>(response);
}

export async function inviteTeamMember(input: {
  email: string;
  fullName: string;
  roleCode: string;
}): Promise<TeamMember> {
  const response = await fetch("/api/v1/team/members/invite", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<TeamMember>(response);
}

export async function updateTeamMemberRole(
  memberUuid: string,
  roleCode: string,
): Promise<TeamMember> {
  const response = await fetch(`/api/v1/team/members/${memberUuid}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ roleCode }),
  });
  return parseApiResponse<TeamMember>(response);
}

export async function removeTeamMember(memberUuid: string): Promise<void> {
  const response = await fetch(`/api/v1/team/members/${memberUuid}`, {
    method: "DELETE",
    credentials: "include",
  });
  await parseApiResponse<{ ok: boolean }>(response);
}

export async function resendTeamInvite(memberUuid: string): Promise<void> {
  const response = await fetch(`/api/v1/team/members/${memberUuid}/resend-invite`, {
    method: "POST",
    credentials: "include",
  });
  await parseApiResponse<{ ok: boolean }>(response);
}

export async function setInvitedMemberPassword(
  memberUuid: string,
  input: { password: string; confirmPassword: string },
): Promise<TeamMember> {
  const response = await fetch(`/api/v1/team/members/${memberUuid}/set-password`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<TeamMember>(response);
}

export async function updateRolePermissions(
  roleCode: string,
  permissionCodes: string[],
): Promise<TeamRole> {
  const response = await fetch(`/api/v1/team/roles/${roleCode}/permissions`, {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ permissionCodes }),
  });
  return parseApiResponse<TeamRole>(response);
}

export async function createTeamRole(input: {
  name: string;
  code?: string;
  description?: string | null;
  permissionCodes?: string[];
}): Promise<TeamRole> {
  const response = await fetch("/api/v1/team/roles", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<TeamRole>(response);
}

export async function updateTeamRole(
  roleCode: string,
  input: { name?: string; description?: string | null },
): Promise<TeamRole> {
  const response = await fetch(`/api/v1/team/roles/${encodeURIComponent(roleCode)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<TeamRole>(response);
}

