import type { EndpointDto } from "@/server/modules/endpoints/endpoints.service";

type ApiResponse<T> = {
  success: boolean;
  data: T;
  error?: { code: string; message: string };
};

async function parseApiResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json()) as ApiResponse<T>;
  if (!payload.success) {
    throw new Error(payload.error?.message ?? "Erro na requisição");
  }
  return payload.data;
}

export type EndpointItem = EndpointDto;

export type EndpointRunItem = {
  id: string;
  endpointCode: string;
  endpointName: string;
  category: string;
  status: string;
  triggeredBy: string;
  latencyMs: number | null;
  itemsFound: number;
  success: boolean | null;
  error: string | null;
  log: string[];
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
  durationMs: number | null;
};

export async function fetchEndpoints(): Promise<{
  masterEnabled: boolean;
  endpoints: EndpointItem[];
}> {
  const response = await fetch("/api/v1/endpoints", { credentials: "include" });
  return parseApiResponse(response);
}

export async function fetchEndpointRuns(params?: {
  limit?: number;
  status?: string;
  code?: string;
  triggeredBy?: string;
  q?: string;
}): Promise<{
  runs: EndpointRunItem[];
  summary: {
    total: number;
    done: number;
    failed: number;
    skipped: number;
    running: number;
  };
}> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.status) search.set("status", params.status);
  if (params?.code) search.set("code", params.code);
  if (params?.triggeredBy) search.set("triggeredBy", params.triggeredBy);
  if (params?.q) search.set("q", params.q);
  const qs = search.toString();
  const response = await fetch(`/api/v1/endpoints/runs${qs ? `?${qs}` : ""}`, {
    credentials: "include",
  });
  return parseApiResponse(response);
}

export async function setEndpointsMaster(enabled: boolean): Promise<{ masterEnabled: boolean }> {
  const response = await fetch("/api/v1/endpoints/master", {
    method: "PUT",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ enabled }),
  });
  return parseApiResponse(response);
}

export async function updateEndpoint(
  code: string,
  data: Record<string, unknown>,
): Promise<EndpointItem> {
  const response = await fetch(`/api/v1/endpoints/${encodeURIComponent(code)}`, {
    method: "PATCH",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseApiResponse(response);
}

export async function createEndpoint(data: {
  name: string;
  baseUrl: string;
  category: string;
  frequencyMin: number;
  requiresKey: boolean;
  apiKey?: string | null;
}): Promise<EndpointItem> {
  const response = await fetch("/api/v1/endpoints", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseApiResponse(response);
}

export async function bulkEndpoints(category: string, enabled: boolean): Promise<{ count: number }> {
  const response = await fetch("/api/v1/endpoints/bulk", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ category, enabled }),
  });
  return parseApiResponse(response);
}

export async function applyEndpointsPreset(preset: "max" | "balanced" | "eco"): Promise<{
  count: number;
  masterEnabled: boolean;
  endpoints: EndpointItem[];
}> {
  const response = await fetch("/api/v1/endpoints/preset", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ preset }),
  });
  return parseApiResponse(response);
}

export async function testEndpoint(code: string): Promise<{
  result: { ok: boolean; latencyMs?: number; error?: string };
  endpoint?: EndpointItem;
}> {
  const response = await fetch(`/api/v1/endpoints/${encodeURIComponent(code)}/test`, {
    method: "POST",
    credentials: "include",
  });
  return parseApiResponse(response);
}
