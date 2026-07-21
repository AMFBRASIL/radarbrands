import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/team/roles/$roleCode/permissions")({
  component: TeamRolePermissionsRoute,
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleUpdateRolePermissions } = await import("@/server/modules/team/handlers");
        return withApiHandler(({ request, requestId }) =>
          handleUpdateRolePermissions(request, requestId, params.roleCode),
        )({ request });
      },
    },
  },
});

function TeamRolePermissionsRoute() {
  return null;
}
