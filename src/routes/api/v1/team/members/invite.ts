import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/members/invite")({
  component: TeamInviteRoute,
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleInviteTeamMember } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) => handleInviteTeamMember(request, requestId))({
          request,
        });
      },
    },
  },
});

function TeamInviteRoute() {
  return null;
}
