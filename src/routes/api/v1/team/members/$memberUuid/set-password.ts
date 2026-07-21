import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/members/$memberUuid/set-password")({
  component: TeamSetPasswordRoute,
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleSetInvitedMemberPassword } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleSetInvitedMemberPassword(request, requestId, params.memberUuid),
        )({ request });
      },
    },
  },
});

function TeamSetPasswordRoute() {
  return null;
}
