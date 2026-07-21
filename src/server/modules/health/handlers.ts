import { getHealthSummary, getLiveHealth, getReadyHealth } from "./health.service";
import { jsonSuccess } from "../../shared/http/response";

export async function handleHealthGet(requestId: string): Promise<Response> {
  return jsonSuccess(await getHealthSummary(), requestId);
}

export async function handleHealthLiveGet(requestId: string): Promise<Response> {
  return jsonSuccess(await getLiveHealth(), requestId);
}

export async function handleHealthReadyGet(requestId: string): Promise<Response> {
  const health = await getReadyHealth();
  const status = health.status === "ok" ? 200 : 503;
  return jsonSuccess(health, requestId, { status });
}
