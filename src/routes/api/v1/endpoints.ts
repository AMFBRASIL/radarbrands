import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints")({
  component: EndpointsListRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleListEndpoints } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) => handleListEndpoints(request, requestId))({
          request,
        });
      },
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleCreateEndpoint } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) => handleCreateEndpoint(request, requestId))({
          request,
        });
      },
    },
  },
});

function EndpointsListRoute() {
  return null;
}
