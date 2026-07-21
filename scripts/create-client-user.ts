import { randomUUID } from "node:crypto";
import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { createRequire } from "node:module";
import { join } from "node:path";

config();

const prisma = new PrismaClient();
const require = createRequire(join(process.cwd(), "package.json"));
const argon2 = require("argon2") as typeof import("argon2");

const EMAIL = "cliente.teste@radarbrands.local";
const FULL_NAME = "Cliente Teste";
const PASSWORD = "Cliente123!";
const ROLE_CODE = "client";

async function main() {
  const organization = await prisma.organization.findFirst({
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" },
    select: { id: true, uuid: true, legalName: true, tradeName: true },
  });

  if (!organization) {
    throw new Error("Nenhuma organização encontrada. Faça login/registro antes.");
  }

  const role = await prisma.role.findUnique({
    where: { code: ROLE_CODE },
    select: { id: true, name: true },
  });

  if (!role) {
    throw new Error(`Perfil "${ROLE_CODE}" não encontrado. Rode npm run db:seed.`);
  }

  const passwordHash = await argon2.hash(PASSWORD, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    create: {
      uuid: randomUUID(),
      email: EMAIL,
      fullName: FULL_NAME,
      displayName: "Cliente",
      passwordHash,
      passwordAlgo: "argon2id",
      status: "active",
      emailVerifiedAt: new Date(),
    },
    update: {
      fullName: FULL_NAME,
      displayName: "Cliente",
      passwordHash,
      passwordAlgo: "argon2id",
      status: "active",
      deletedAt: null,
    },
    select: { id: true, uuid: true, email: true },
  });

  await prisma.organizationMember.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    create: {
      organizationId: organization.id,
      userId: user.id,
      roleId: role.id,
      status: "active",
      invitedAt: new Date(),
      acceptedAt: new Date(),
    },
    update: {
      roleId: role.id,
      status: "active",
      acceptedAt: new Date(),
    },
  });

  const orgName = organization.tradeName?.trim() || organization.legalName;
  console.log("Usuário Cliente criado/atualizado:");
  console.log(`  Organização: ${orgName}`);
  console.log(`  E-mail:      ${EMAIL}`);
  console.log(`  Senha:       ${PASSWORD}`);
  console.log(`  Perfil:      ${role.name} (${ROLE_CODE})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
