export type AuthContext = {
  user: {
    uuid: string;
    email: string;
    fullName: string;
    displayName: string | null;
    avatarUrl: string | null;
  };
  organization: {
    uuid: string;
    legalName: string;
    tradeName: string | null;
    slug: string;
    planTier: string;
    status: string;
    displayName: string;
  } | null;
  membership: {
    roleCode: string;
    roleName: string;
    permissions: string[];
  } | null;
  organizations: Array<{
    uuid: string;
    legalName: string;
    tradeName: string | null;
    slug: string;
    planTier: string;
    status: string;
    role: { code: string; name: string };
  }>;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
  requestId?: string;
  error?: { code: string; message: string; details?: unknown };
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new Error(payload.error?.message ?? "Erro na requisição");
  }
  return payload.data;
}

export async function loginRequest(input: {
  email: string;
  password: string;
  rememberMe?: boolean;
}): Promise<AuthContext> {
  const response = await fetch("/api/v1/auth/login", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AuthContext>(response);
}

export async function registerRequest(input: {
  fullName: string;
  companyName?: string;
  email: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthContext> {
  const response = await fetch("/api/v1/auth/register", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AuthContext>(response);
}

export async function previewInviteRequest(token: string): Promise<{
  email: string;
  fullName: string;
  organizationName: string;
  expiresAt: string;
}> {
  const response = await fetch(
    `/api/v1/auth/accept-invite?token=${encodeURIComponent(token)}`,
    { credentials: "include" },
  );
  return parseApiResponse(response);
}

export async function acceptInviteRequest(input: {
  token: string;
  password: string;
  confirmPassword: string;
}): Promise<AuthContext> {
  const response = await fetch("/api/v1/auth/accept-invite", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseApiResponse<AuthContext>(response);
}

export async function logoutRequest(): Promise<void> {
  const response = await fetch("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  await parseApiResponse<{ ok: boolean }>(response);
}

export async function meRequest(): Promise<AuthContext> {
  const response = await fetch("/api/v1/auth/me", {
    credentials: "include",
  });
  return parseApiResponse<AuthContext>(response);
}
