import { AppError, isAppError } from "../errors";
import { logger } from "../logger";
import { getRequestId, REQUEST_ID_HEADER } from "./request-id";
import { jsonError } from "./response";

export type ApiHandlerContext = {
  request: Request;
  requestId: string;
};

export type ApiHandler = (ctx: ApiHandlerContext) => Promise<Response> | Response;

type ServerHandlerContext = {
  request: Request;
};

export function withApiHandler(handler: ApiHandler): (ctx: ServerHandlerContext) => Promise<Response> {
  return async ({ request }: ServerHandlerContext) => {
    const requestId = getRequestId(request);
    const startedAt = Date.now();
    const route = new URL(request.url).pathname;

    try {
      const response = await handler({ request, requestId });
      const durationMs = Date.now() - startedAt;

      logger.info(
        {
          requestId,
          method: request.method,
          route,
          statusCode: response.status,
          durationMs,
        },
        "api request",
      );

      const headers = new Headers(response.headers);
      if (!headers.has(REQUEST_ID_HEADER)) {
        headers.set(REQUEST_ID_HEADER, requestId);
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    } catch (error) {
      const durationMs = Date.now() - startedAt;

      if (isAppError(error)) {
        logger.warn(
          {
            requestId,
            method: request.method,
            route,
            durationMs,
            errorCode: error.code,
            statusCode: error.statusCode,
          },
          error.message,
        );

        return jsonError(error.code, error.message, requestId, error.statusCode, error.details);
      }

      logger.error(
        {
          requestId,
          method: request.method,
          route,
          durationMs,
          err: error,
        },
        "unhandled api error",
      );

      return jsonError(
        "INTERNAL_ERROR",
        "Erro interno do servidor",
        requestId,
        500,
      );
    }
  };
}

export function methodNotAllowed(requestId: string): Response {
  return jsonError("VALIDATION_ERROR", "Método não permitido", requestId, 405);
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export function createApiHandlers(
  handlers: Partial<Record<HttpMethod, ApiHandler>>,
): Partial<Record<HttpMethod, (ctx: ServerHandlerContext) => Promise<Response>>> {
  const mapped: Partial<Record<HttpMethod, (ctx: ServerHandlerContext) => Promise<Response>>> = {};

  for (const [method, handler] of Object.entries(handlers) as [HttpMethod, ApiHandler][]) {
    mapped[method] = withApiHandler(handler);
  }

  return mapped;
}

export { AppError };
