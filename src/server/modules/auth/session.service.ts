import { prisma } from "../../shared/database";
import {
  SESSION_MAX_AGE_DEFAULT_SEC,
  SESSION_MAX_AGE_REMEMBER_SEC,
  generateSessionToken,
  hashSessionToken,
} from "../../shared/auth/cookies";

export async function createSession(input: {
  userId: bigint;
  userAgent?: string | null;
  rememberMe?: boolean;
}) {
  const token = generateSessionToken();
  const tokenHash = hashSessionToken(token);
  const maxAgeSec = input.rememberMe ? SESSION_MAX_AGE_REMEMBER_SEC : SESSION_MAX_AGE_DEFAULT_SEC;
  const expiresAt = new Date(Date.now() + maxAgeSec * 1000);

  await prisma.session.create({
    data: {
      userId: input.userId,
      tokenHash,
      userAgent: input.userAgent?.slice(0, 512) ?? null,
      expiresAt,
    },
  });

  return { token, maxAgeSec, expiresAt };
}

export async function revokeSessionByToken(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token);
  await prisma.session.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllUserSessions(userId: bigint): Promise<void> {
  await prisma.session.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function findValidSessionByToken(token: string) {
  const tokenHash = hashSessionToken(token);
  const now = new Date();

  return prisma.session.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: now },
    },
    include: {
      user: {
        select: {
          id: true,
          uuid: true,
          email: true,
          fullName: true,
          displayName: true,
          avatarUrl: true,
          status: true,
          deletedAt: true,
        },
      },
    },
  });
}
