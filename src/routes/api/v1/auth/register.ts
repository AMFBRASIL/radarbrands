import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/auth/register")({
  component: AuthRegisterRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleAuthRegister } = await import("@/server/modules/auth/handlers");
        return withApiHandler(({ request, requestId }) => handleAuthRegister(request, requestId))({
          request,
        });
      },
    },
  },
});

function AuthRegisterRoute() {
  return null;
}
