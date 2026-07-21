import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/auth/accept-invite")({
  component: AuthAcceptInviteRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleAuthPreviewInvite } = await import("@/server/modules/auth/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleAuthPreviewInvite(request, requestId),
        )({ request });
      },
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleAuthAcceptInvite } = await import("@/server/modules/auth/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleAuthAcceptInvite(request, requestId),
        )({ request });
      },
    },
  },
});

function AuthAcceptInviteRoute() {
  return null;
}
