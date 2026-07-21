import { z } from "zod";

const credentialsSchema = z.record(z.string(), z.string()).default({});

export const emailSettingsUpsertSchema = z.object({
  transport: z.enum(["api", "smtp"]),
  providerId: z.string().min(1).max(60),
  fromEmail: z.string().email(),
  fromName: z.string().max(120).optional().nullable(),
  replyTo: z.string().email().optional().nullable().or(z.literal("")),
  smtpHost: z.string().max(255).optional().nullable(),
  smtpPort: z.coerce.number().int().min(1).max(65535).optional().nullable(),
  smtpSecure: z.boolean().optional().nullable(),
  credentials: credentialsSchema,
  features: z
    .object({
      dkimVerified: z.boolean().optional(),
      dailyDigest: z.boolean().optional(),
      weeklyReport: z.boolean().optional(),
    })
    .optional(),
});

export const emailTestSchema = z.object({
  to: z.string().email(),
  settings: emailSettingsUpsertSchema.optional(),
});

export type EmailSettingsUpsertInput = z.infer<typeof emailSettingsUpsertSchema>;
export type EmailTestInput = z.infer<typeof emailTestSchema>;
