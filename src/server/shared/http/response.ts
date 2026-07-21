export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
  requestId: string;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  requestId: string;
};

export function jsonSuccess<T>(
  data: T,
  requestId: string,
  init?: ResponseInit & { meta?: Record<string, unknown> },
): Response {
  const { meta, ...responseInit } = init ?? {};
  const body: ApiSuccessResponse<T> = {
    success: true,
    data,
    ...(meta ? { meta } : {}),
    requestId,
  };

  const headers = new Headers({
    "content-type": "application/json; charset=utf-8",
    "x-request-id": requestId,
  });

  if (responseInit.headers) {
    const extra = new Headers(responseInit.headers);
    extra.forEach((value, key) => {
      if (key.toLowerCase() === "set-cookie") {
        headers.append(key, value);
      } else {
        headers.set(key, value);
      }
    });
  }

  return Response.json(body, {
    status: responseInit.status ?? 200,
    statusText: responseInit.statusText,
    headers,
  });
}

export function jsonError(
  code: string,
  message: string,
  requestId: string,
  status = 500,
  details?: Record<string, unknown>,
): Response {
  const body: ApiErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
    requestId,
  };

  return Response.json(body, {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "x-request-id": requestId,
    },
  });
}
