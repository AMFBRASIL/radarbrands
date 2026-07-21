import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/health")({
  component: ApiHealthRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleHealthGet } = await import("@/server/modules/health/handlers");
        return withApiHandler(({ requestId }) => handleHealthGet(requestId))({ request });
      },
    },
  },
});

function ApiHealthRoute() {
  return null;
}
