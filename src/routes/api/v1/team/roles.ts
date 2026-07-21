import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/roles")({
  component: TeamRolesRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleListTeamRoles } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) => handleListTeamRoles(request, requestId))({
          request,
        });
      },
      POST: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleCreateTeamRole } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) => handleCreateTeamRole(request, requestId))({
          request,
        });
      },
    },
  },
});

function TeamRolesRoute() {
  return null;
}
