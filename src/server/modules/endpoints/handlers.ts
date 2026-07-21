import { authorizeResource } from "../../shared/auth/authorization";
import { ValidationError } from "../../shared/errors";
import { jsonSuccess } from "../../shared/http/response";
import { runEndpointJob } from "./endpoints.runner";
import {
  bulkEndpointSchema,
  createEndpointSchema,
  listEndpointRunsSchema,
  masterSwitchSchema,
  presetEndpointSchema,
  updateEndpointSchema,
} from "./endpoints.schemas";
import { endpointsService, getEndpointByCode } from "./endpoints.service";

const ENDPOINTS_PERMISSION = "endpoints.manage";

export async function handleListEndpoints(request: Request, requestId: string): Promise<Response> {
  await authorizeResource(request, ENDPOINTS_PERMISSION);
  const data = await endpointsService.list();
  return jsonSuccess(data, requestId);
}

export async function handleListEndpointRuns(request: Request, requestId: string): Promise<Response> {
  await authorizeResource(request, ENDPOINTS_PERMISSION);
  const url = new URL(request.url);
  const parsed = listEndpointRunsSchema.safeParse({
    limit: url.searchParams.get("limit") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    code: url.searchParams.get("code") ?? undefined,
    triggeredBy: url.searchParams.get("triggeredBy") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
  });
  if (!parsed.success) {
    throw new ValidationError("Filtros inválidos", parsed.error.flatten());
  }

  const data = await endpointsService.listRuns(parsed.data);
  return jsonSuccess(data, requestId);
}

export async function handleUpdateEndpoint(
  request: Request,
  requestId: string,
  code: string,
): Promise<Response> {
  const session = await authorizeResource(request, ENDPOINTS_PERMISSION);
  const body = await request.json();
  const parsed = updateEndpointSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const endpoint = await endpointsService.update({
    code,
    data: parsed.data,
    actorUserId: session.userId,
  });
  return jsonSuccess(endpoint, requestId);
}

export async function handleCreateEndpoint(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, ENDPOINTS_PERMISSION);
  const body = await request.json();
  const parsed = createEndpointSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const endpoint = await endpointsService.create({
    data: parsed.data,
    actorUserId: session.userId,
  });
  return jsonSuccess(endpoint, requestId, { status: 201 });
}

export async function handleBulkEndpoints(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, ENDPOINTS_PERMISSION);
  const body = await request.json();
  const parsed = bulkEndpointSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const count = await endpointsService.bulk({
    category: parsed.data.category,
    enabled: parsed.data.enabled,
    actorUserId: session.userId,
  });
  return jsonSuccess({ count }, requestId);
}

export async function handlePresetEndpoints(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, ENDPOINTS_PERMISSION);
  const body = await request.json();
  const parsed = presetEndpointSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const count = await endpointsService.preset({
    preset: parsed.data.preset,
    actorUserId: session.userId,
  });
  const data = await endpointsService.list();
  return jsonSuccess({ count, ...data }, requestId);
}

export async function handleMasterSwitch(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, ENDPOINTS_PERMISSION);
  const body = await request.json();
  const parsed = masterSwitchSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const enabled = await endpointsService.setMasterEnabled(parsed.data.enabled, session.userId);
  return jsonSuccess({ masterEnabled: enabled }, requestId);
}

export async function handleTestEndpoint(
  request: Request,
  requestId: string,
  code: string,
): Promise<Response> {
  await authorizeResource(request, ENDPOINTS_PERMISSION);
  const endpoint = await getEndpointByCode(code);
  const result = await runEndpointJob({ endpointId: endpoint.id, triggeredBy: "manual" });
  const list = await endpointsService.list();
  const updated = list.endpoints.find((e) => e.code === code);
  return jsonSuccess({ result, endpoint: updated }, requestId);
}
