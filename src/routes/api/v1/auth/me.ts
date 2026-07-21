import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/auth/me")({
  component: AuthMeRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleAuthMe } = await import("@/server/modules/auth/handlers");
        return withApiHandler(({ request, requestId }) => handleAuthMe(request, requestId))({
          request,
        });
      },
    },
  },
});

function AuthMeRoute() {
  return null;
}
