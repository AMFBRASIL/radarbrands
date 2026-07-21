export const REQUEST_ID_HEADER = "x-request-id";

export function generateRequestId(): string {
  return crypto.randomUUID();
}

export function getRequestId(request: Request): string {
  return request.headers.get(REQUEST_ID_HEADER) ?? generateRequestId();
}
