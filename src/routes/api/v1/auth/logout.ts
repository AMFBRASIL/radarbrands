import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/auth/logout")({
  component: AuthLogoutRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleAuthLogout } = await import("@/server/modules/auth/handlers");
        return withApiHandler(({ request, requestId }) => handleAuthLogout(request, requestId))({
          request,
        });
      },
    },
  },
});

function AuthLogoutRoute() {
  return null;
}
