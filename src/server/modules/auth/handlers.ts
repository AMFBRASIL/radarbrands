import {
  acceptInviteSchema,
  loginSchema,
  registerSchema,
  switchOrganizationSchema,
} from "./auth.schemas";
import {
  acceptInvite,
  getCurrentAuth,
  loginUser,
  logoutUser,
  previewInviteToken,
  registerUser,
  switchActiveOrganization,
} from "./auth.service";
import { ValidationError, AuthenticationError } from "../../shared/errors";
import { jsonSuccess } from "../../shared/http/response";

function mergeHeaders(base: Headers, extra?: Headers): Headers {
  const headers = new Headers(base);
  extra?.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      headers.append(key, value);
    } else {
      headers.set(key, value);
    }
  });
  return headers;
}

export async function handleAuthRegister(request: Request, requestId: string): Promise<Response> {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const result = await registerUser(parsed.data, request);
  return jsonSuccess(result.auth, requestId, { headers: result.headers });
}

export async function handleAuthLogin(request: Request, requestId: string): Promise<Response> {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const result = await loginUser(parsed.data, request);
  return jsonSuccess(result.auth, requestId, { headers: result.headers });
}

export async function handleAuthLogout(request: Request, requestId: string): Promise<Response> {
  const result = await logoutUser(request);
  return jsonSuccess({ ok: true }, requestId, { headers: result.headers });
}

export async function handleAuthMe(request: Request, requestId: string): Promise<Response> {
  const auth = await getCurrentAuth(request);
  if (!auth) {
    throw new AuthenticationError();
  }
  return jsonSuccess(auth, requestId);
}

export async function handleAuthSwitchOrganization(
  request: Request,
  requestId: string,
): Promise<Response> {
  const body = await request.json();
  const parsed = switchOrganizationSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const result = await switchActiveOrganization(request, parsed.data.organizationUuid);
  return jsonSuccess(result.auth, requestId, { headers: result.headers });
}

export async function handleAuthPreviewInvite(
  request: Request,
  requestId: string,
): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim() ?? "";
  if (!token) {
    throw new ValidationError("Token de convite obrigatório");
  }

  const preview = await previewInviteToken(token);
  return jsonSuccess(preview, requestId);
}

export async function handleAuthAcceptInvite(
  request: Request,
  requestId: string,
): Promise<Response> {
  const body = await request.json();
  const parsed = acceptInviteSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const result = await acceptInvite(parsed.data, request);
  return jsonSuccess(result.auth, requestId, { headers: result.headers });
}

export { mergeHeaders };
