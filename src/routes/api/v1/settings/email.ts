import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/v1/settings/email")({
  component: EmailSettingsRoute,
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handleGetEmailSettings } = await import("@/server/modules/email/handlers");
        return withApiHandler(({ request, requestId }) => handleGetEmailSettings(request, requestId))({
          request,
        });
      },
      PUT: async ({ request }) => {
        const { withApiHandler } = await import("@/server/shared/http/api-handler");
        const { handlePutEmailSettings } = await import("@/server/modules/email/handlers");
        return withApiHandler(({ request, requestId }) => handlePutEmailSettings(request, requestId))({
          request,
        });
      },
    },
  },
});

function EmailSettingsRoute() {
  return null;
}
