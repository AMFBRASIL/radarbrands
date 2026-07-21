import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/settings/email/test")({
  component: EmailTestRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handlePostEmailTest } = await import("@/server/modules/email/handlers");
        return withApiHandler(({ request, requestId }) => handlePostEmailTest(request, requestId))({
          request,
        });
      },
    },
  },
});

function EmailTestRoute() {
  return null;
}
