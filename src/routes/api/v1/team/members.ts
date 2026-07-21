import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/members")({
  component: TeamMembersRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleListTeamMembers } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) => handleListTeamMembers(request, requestId))({
          request,
        });
      },
    },
  },
});

function TeamMembersRoute() {
  return null;
}
