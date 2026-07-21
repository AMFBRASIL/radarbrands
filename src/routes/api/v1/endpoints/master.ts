import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints/master")({
  component: EndpointsMasterRoute,
  server: {
    handlers: {
      PUT: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleMasterSwitch } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) => handleMasterSwitch(request, requestId))({
          request,
        });
      },
    },
  },
});

function EndpointsMasterRoute() {
  return null;
}
