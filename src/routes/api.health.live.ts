import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health/live")({
  component: ApiHealthLiveRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleHealthLiveGet } = await import("@/server/modules/health/handlers");
        return withApiHandler(({ requestId }) => handleHealthLiveGet(requestId))({ request });
      },
    },
  },
});

function ApiHealthLiveRoute() {
  return null;
}
