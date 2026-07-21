import { createHash, randomBytes } from "node:crypto";

import { prisma } from "../../shared/database";
import { BusinessRuleError, NotFoundError } from "../../shared/errors";

const INVITE_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

export function generateInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createInviteToken(input: {
  userId: bigint;
  organizationId: bigint;
  createdBy?: bigint | null;
}): Promise<{ rawToken: string; expiresAt: Date }> {
  const rawToken = generateInviteToken();
  const tokenHash = hashInviteToken(rawToken);
  const expiresAt = new Date(Date.now() + INVITE_TOKEN_TTL_MS);

  await prisma.userInviteToken.updateMany({
    where: {
      userId: input.userId,
      organizationId: input.organizationId,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });

  await prisma.userInviteToken.create({
    data: {
      userId: input.userId,
      organizationId: input.organizationId,
      tokenHash,
      expiresAt,
      createdBy: input.createdBy ?? null,
    },
  });

  return { rawToken, expiresAt };
}

export async function findValidInviteToken(rawToken: string) {
  const tokenHash = hashInviteToken(rawToken);
  const now = new Date();

  const record = await prisma.userInviteToken.findFirst({
    where: {
      tokenHash,
      usedAt: null,
      expiresAt: { gt: now },
    },
    include: {
      user: {
        select: {
          id: true,
          uuid: true,
          email: true,
          fullName: true,
          status: true,
          passwordHash: true,
          deletedAt: true,
        },
      },
      organization: {
        select: {
          id: true,
          uuid: true,
          legalName: true,
          tradeName: true,
          deletedAt: true,
        },
      },
    },
  });

  if (!record || record.user.deletedAt || record.organization.deletedAt) {
    throw new NotFoundError("Convite inválido ou expirado");
  }

  const membership = await prisma.organizationMember.findUnique({
    where: {
      organizationId_userId: {
        organizationId: record.organizationId,
        userId: record.userId,
      },
    },
    select: { status: true },
  });

  if (!membership || membership.status === "removed") {
    throw new BusinessRuleError("Este convite não está mais disponível");
  }

  return record;
}

export async function consumeInviteToken(tokenId: bigint): Promise<void> {
  await prisma.userInviteToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() },
  });
}

export async function invalidateInviteTokensForMembership(input: {
  userId: bigint;
  organizationId: bigint;
}): Promise<void> {
  await prisma.userInviteToken.updateMany({
    where: {
      userId: input.userId,
      organizationId: input.organizationId,
      usedAt: null,
    },
    data: { usedAt: new Date() },
  });
}
