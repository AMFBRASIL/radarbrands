import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints/bulk")({
  component: EndpointsBulkRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleBulkEndpoints } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) => handleBulkEndpoints(request, requestId))({
          request,
        });
      },
    },
  },
});

function EndpointsBulkRoute() {
  return null;
}
