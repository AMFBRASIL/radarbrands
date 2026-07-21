import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health/ready")({
  component: ApiHealthReadyRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleHealthReadyGet } = await import("@/server/modules/health/handlers");
        return withApiHandler(({ requestId }) => handleHealthReadyGet(requestId))({ request });
      },
    },
  },
});

function ApiHealthReadyRoute() {
  return null;
}
