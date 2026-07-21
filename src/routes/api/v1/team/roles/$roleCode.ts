import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/roles/$roleCode")({
  component: TeamRoleDetailRoute,
  server: {
    handlers: {
      PATCH: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleUpdateTeamRole } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleUpdateTeamRole(request, requestId, params.roleCode),
        )({ request });
      },
    },
  },
});

function TeamRoleDetailRoute() {
  return null;
}
