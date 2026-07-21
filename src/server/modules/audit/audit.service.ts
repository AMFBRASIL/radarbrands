import type { ActorType, Prisma } from "@prisma/client";

import { prisma } from "../../shared/database";

export async function writeAuditLog(input: {
  organizationId?: bigint | null;
  actorUserId?: bigint | null;
  actorType?: ActorType;
  action: string;
  entityType: string;
  entityId?: bigint | null;
  userAgent?: string | null;
  before?: Prisma.InputJsonValue | null;
  after?: Prisma.InputJsonValue | null;
}) {
  await prisma.auditLog.create({
    data: {
      organizationId: input.organizationId ?? null,
      actorUserId: input.actorUserId ?? null,
      actorType: input.actorType ?? "user",
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      userAgent: input.userAgent?.slice(0, 512) ?? null,
      before: input.before ?? undefined,
      after: input.after ?? undefined,
    },
  });
}