import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/members/$memberUuid/resend-invite")({
  component: TeamResendInviteRoute,
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleResendTeamInvite } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleResendTeamInvite(request, requestId, params.memberUuid),
        )({ request });
      },
    },
  },
});

function TeamResendInviteRoute() {
  return null;
}
