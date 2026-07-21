import { z } from "zod";

export const endpointCategorySchema = z.enum([
  "search",
  "social",
  "marketplace",
  "appstore",
  "darkweb",
  "domain",
  "news",
  "review",
  "video",
  "messaging",
  "ai",
]);

export const updateEndpointSchema = z.object({
  enabled: z.boolean().optional(),
  frequencyMin: z.coerce.number().int().min(1).max(10080).optional(),
  priority: z.coerce.number().int().min(1).max(3).optional(),
  concurrency: z.coerce.number().int().min(1).max(40).optional(),
  region: z.string().max(20).optional().nullable(),
  apiKey: z.string().max(2048).optional().nullable(),
  advanced: z
    .object({
      retryBackoff: z.boolean().optional(),
      ignoreSsl: z.boolean().optional(),
      rotateUa: z.boolean().optional(),
      residentialProxy: z.boolean().optional(),
    })
    .optional(),
});

export const createEndpointSchema = z.object({
  name: z.string().min(2).max(120),
  baseUrl: z.string().url().max(1024),
  category: endpointCategorySchema,
  frequencyMin: z.coerce.number().int().min(1).max(10080).default(30),
  requiresKey: z.boolean().default(true),
  apiKey: z.string().max(2048).optional().nullable(),
});

export const bulkEndpointSchema = z.object({
  category: endpointCategorySchema.or(z.literal("all")),
  enabled: z.boolean(),
});

export const presetEndpointSchema = z.object({
  preset: z.enum(["max", "balanced", "eco"]),
});

export const masterSwitchSchema = z.object({
  enabled: z.boolean(),
});

export const listEndpointRunsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(500).default(100),
  status: z.enum(["queued", "running", "done", "failed", "skipped"]).optional(),
  code: z.string().max(80).optional(),
  triggeredBy: z.enum(["cron", "manual"]).optional(),
  q: z.string().max(120).optional(),
});

export type UpdateEndpointInput = z.infer<typeof updateEndpointSchema>;
export type CreateEndpointInput = z.infer<typeof createEndpointSchema>;
export type ListEndpointRunsInput = z.infer<typeof listEndpointRunsSchema>;
