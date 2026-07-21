import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email().max(255).transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8).max(128),
  rememberMe: z.boolean().optional().default(true),
});

export const registerSchema = z
  .object({
    fullName: z.string().min(2).max(180).transform((v) => v.trim()),
    companyName: z.string().max(180).optional().transform((v) => v?.trim() || undefined),
    email: z.string().email().max(255).transform((v) => v.trim().toLowerCase()),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const switchOrganizationSchema = z.object({
  organizationUuid: z.string().uuid(),
});

export const acceptInviteSchema = z
  .object({
    token: z.string().min(20).max(200),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
