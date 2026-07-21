import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/members/$memberUuid")({
  component: TeamMemberRoute,
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleUpdateTeamMember } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleUpdateTeamMember(request, requestId, params.memberUuid),
        )({ request });
      },
      DELETE: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleRemoveTeamMember } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleRemoveTeamMember(request, requestId, params.memberUuid),
        )({ request });
      },
    },
  },
});

function TeamMemberRoute() {
  return null;
}
