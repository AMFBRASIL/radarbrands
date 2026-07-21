import { authorizeResource } from "../../shared/auth/authorization";
import { ValidationError } from "../../shared/errors";
import { jsonSuccess } from "../../shared/http/response";
import {
  getEmailSettings,
  markEmailTestResult,
  saveEmailSettings,
} from "./email-config.service";
import { emailSettingsUpsertSchema, emailTestSchema } from "./email.schemas";
import { emailService } from "./email.service";

const EMAIL_PERMISSION = "integrations.manage";

export async function handleGetEmailSettings(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, EMAIL_PERMISSION);
  const settings = await getEmailSettings(session.organizationId);
  return jsonSuccess(settings, requestId);
}

export async function handlePutEmailSettings(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, EMAIL_PERMISSION);
  const body = await request.json();
  const parsed = emailSettingsUpsertSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  const settings = await saveEmailSettings({
    organizationId: session.organizationId,
    actorUserId: session.userId,
    userAgent: request.headers.get("user-agent"),
    data: parsed.data,
  });

  return jsonSuccess(settings, requestId);
}

export async function handlePostEmailTest(request: Request, requestId: string): Promise<Response> {
  const session = await authorizeResource(request, EMAIL_PERMISSION);
  const body = await request.json();
  const parsed = emailTestSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Dados inválidos", parsed.error.flatten());
  }

  try {
    const result = await emailService.sendTest({
      organizationId: session.organizationId,
      to: parsed.data.to,
      draft: parsed.data.settings,
    });

    return jsonSuccess(result, requestId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Falha no envio de teste";

    if (!parsed.data.settings) {
      await markEmailTestResult({
        organizationId: session.organizationId,
        ok: false,
        message,
      });
    }

    return jsonSuccess(
      {
        ok: false,
        providerId: parsed.data.settings?.providerId ?? "unknown",
        transport: parsed.data.settings?.transport ?? "api",
        log: [`✗ ${message}`],
        error: message,
      },
      requestId,
      { status: 200 },
    );
  }
}
