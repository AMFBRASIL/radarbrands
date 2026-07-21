import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints/runs")({
  component: EndpointsRunsRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleListEndpointRuns } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) => handleListEndpointRuns(request, requestId))({
          request,
        });
      },
    },
  },
});

function EndpointsRunsRoute() {
  return null;
}
