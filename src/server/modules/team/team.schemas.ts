import { z } from "zod";

export const inviteMemberSchema = z.object({
  email: z.string().email().max(255),
  fullName: z.string().min(2).max(180),
  roleCode: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z][a-z0-9_-]*$/, "Código de perfil inválido"),
});

export const updateMemberSchema = z.object({
  roleCode: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z][a-z0-9_-]*$/, "Código de perfil inválido")
    .optional(),
});

export const setInvitedMemberPasswordSchema = z
  .object({
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

export const updateRolePermissionsSchema = z.object({
  permissionCodes: z.array(z.string().min(1).max(80)),
});

export const createRoleSchema = z.object({
  name: z.string().min(2).max(80),
  code: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z][a-z0-9_-]*$/, "Use apenas letras minúsculas, números, _ ou -")
    .optional(),
  description: z.string().max(255).optional().nullable(),
  permissionCodes: z.array(z.string().min(1).max(80)).default([]),
});

export const updateRoleSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().max(255).optional().nullable(),
});

export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type SetInvitedMemberPasswordInput = z.infer<typeof setInvitedMemberPasswordSchema>;
export type UpdateRolePermissionsInput = z.infer<typeof updateRolePermissionsSchema>;
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;

export const PROTECTED_ROLE_CODES = new Set(["owner", "superadmin"]);

export function slugifyRoleCode(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}
