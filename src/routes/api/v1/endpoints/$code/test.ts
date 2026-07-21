import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints/$code/test")({
  component: EndpointTestRoute,
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleTestEndpoint } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleTestEndpoint(request, requestId, params.code),
        )({ request });
      },
    },
  },
});

function EndpointTestRoute() {
  return null;
}
