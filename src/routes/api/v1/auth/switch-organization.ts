import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/auth/switch-organization")({
  component: AuthSwitchOrgRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleAuthSwitchOrganization } = await import("@/server/modules/auth/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleAuthSwitchOrganization(request, requestId),
        )({ request });
      },
    },
  },
});

function AuthSwitchOrgRoute() {
  return null;
}
