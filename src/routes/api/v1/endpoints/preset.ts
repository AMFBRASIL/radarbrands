import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints/preset")({
  component: EndpointsPresetRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handlePresetEndpoints } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) => handlePresetEndpoints(request, requestId))({
          request,
        });
      },
    },
  },
});

function EndpointsPresetRoute() {
  return null;
}
