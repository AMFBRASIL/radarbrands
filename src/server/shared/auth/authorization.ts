import { AuthenticationError, AuthorizationError } from "../errors";
import type { ResolvedSession } from "./types";
import { hasPermission } from "./permissions";
import { resolveSessionFromRequest } from "../../modules/auth/auth.service";

export async function requireSession(request: Request): Promise<ResolvedSession> {
  const session = await resolveSessionFromRequest(request);
  if (!session) {
    throw new AuthenticationError();
  }
  return session;
}

export function requireOrganizationContext(session: ResolvedSession): ResolvedSession & {
  organizationId: bigint;
} {
  if (!session.organizationId) {
    throw new AuthorizationError("Organização não selecionada");
  }
  return session as ResolvedSession & { organizationId: bigint };
}

export function requirePermissionCode(session: ResolvedSession, permission: string): void {
  const permissions = session.membership?.permissions ?? [];
  if (!hasPermission(permissions, permission)) {
    throw new AuthorizationError("Sem permissão para esta operação");
  }
}

export async function authorizeResource(
  request: Request,
  permission: string,
): Promise<ResolvedSession & { organizationId: bigint }> {
  const session = requireOrganizationContext(await requireSession(request));
  requirePermissionCode(session, permission);
  return session;
}
