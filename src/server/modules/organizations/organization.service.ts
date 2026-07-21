import { randomBytes, randomUUID } from "node:crypto";

import { prisma } from "../../shared/database";

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = slugify(base) || "org";
  let attempt = 0;

  while (attempt < 20) {
    const exists = await prisma.organization.findFirst({
      where: { slug },
      select: { id: true },
    });
    if (!exists) return slug;
    attempt += 1;
    slug = `${slugify(base).slice(0, 90)}-${randomBytes(3).toString("hex")}`;
  }

  return `${slugify(base).slice(0, 80)}-${randomBytes(6).toString("hex")}`;
}

export async function createOrganizationWithOwner(input: {
  userId: bigint;
  fullName: string;
  companyName?: string;
  email: string;
}): Promise<{ organizationId: bigint; organizationUuid: string }> {
  const legalName = input.companyName?.trim() || `${input.fullName} — Organização`;
  const tradeName = input.companyName?.trim() || input.fullName;
  const slug = await ensureUniqueSlug(tradeName || input.email.split("@")[0] || "org");

  const ownerRole = await prisma.role.findUnique({
    where: { code: "owner" },
    select: { id: true },
  });

  if (!ownerRole) {
    throw new Error("Role owner não encontrada. Execute o seed do banco.");
  }

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        uuid: randomUUID(),
        legalName,
        tradeName,
        slug,
        status: "trial",
        planTier: "free",
        trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      select: { id: true, uuid: true },
    });

    await tx.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: input.userId,
        roleId: ownerRole.id,
        status: "active",
        acceptedAt: new Date(),
      },
    });

    return organization;
  });

  return { organizationId: result.id, organizationUuid: result.uuid };
}

export async function getOrganizationByUuidForUser(organizationUuid: string, userId: bigint) {
  return prisma.organization.findFirst({
    where: {
      uuid: organizationUuid,
      deletedAt: null,
      members: {
        some: {
          userId,
          status: "active",
        },
      },
    },
    select: {
      id: true,
      uuid: true,
      legalName: true,
      tradeName: true,
      slug: true,
      planTier: true,
      status: true,
    },
  });
}

export async function listUserOrganizations(userId: bigint) {
  const memberships = await prisma.organizationMember.findMany({
    where: {
      userId,
      status: "active",
      organization: { deletedAt: null },
    },
    include: {
      organization: {
        select: {
          uuid: true,
          legalName: true,
          tradeName: true,
          slug: true,
          planTier: true,
          status: true,
        },
      },
      role: {
        select: { code: true, name: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return memberships.map((m) => ({
    uuid: m.organization.uuid,
    legalName: m.organization.legalName,
    tradeName: m.organization.tradeName,
    slug: m.organization.slug,
    planTier: m.organization.planTier,
    status: m.organization.status,
    role: m.role,
  }));
}

export function organizationDisplayName(org: {
  tradeName: string | null;
  legalName: string;
}): string {
  return org.tradeName?.trim() || org.legalName;
}
