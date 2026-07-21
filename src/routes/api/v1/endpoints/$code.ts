import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/endpoints/$code")({
  component: EndpointDetailRoute,
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleUpdateEndpoint } = await import("@/server/modules/endpoints/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleUpdateEndpoint(request, requestId, params.code),
        )({ request });
      },
    },
  },
});

function EndpointDetailRoute() {
  return null;
}
