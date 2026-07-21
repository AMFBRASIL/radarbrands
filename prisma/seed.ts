import { config } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { SEED_ENDPOINTS } from "./seed-endpoints-data";

config();

const prisma = new PrismaClient();

const ROLES = [
  { code: "owner", name: "Owner", scope: "org" as const, description: "Dono da conta — controle total" },
  { code: "admin", name: "Admin", scope: "org" as const, description: "Administrador da organização" },
  { code: "security", name: "Security Analyst", scope: "org" as const, description: "Analista de ameaças" },
  { code: "legal", name: "Jurídico", scope: "org" as const, description: "Advogado / casos legais" },
  { code: "marketing", name: "Marketing / PR", scope: "org" as const, description: "Comunicação e crise" },
  { code: "viewer", name: "Viewer", scope: "org" as const, description: "Somente leitura" },
  {
    code: "client",
    name: "Cliente",
    scope: "org" as const,
    description: "Acesso do cliente às páginas de acompanhamento da marca",
  },
  { code: "superadmin", name: "Super Admin", scope: "system" as const, description: "Equipe Radar" },
];

const PERMISSIONS = [
  ["brands.read", "brands"],
  ["brands.write", "brands"],
  ["threats.read", "threats"],
  ["threats.write", "threats"],
  ["threats.takedown", "threats"],
  ["alerts.read", "alerts"],
  ["alerts.manage", "alerts"],
  ["legal.read", "legal"],
  ["legal.write", "legal"],
  ["reports.read", "reports"],
  ["reports.generate", "reports"],
  ["billing.read", "billing"],
  ["billing.manage", "billing"],
  ["team.manage", "team"],
  ["integrations.manage", "integrations"],
  ["endpoints.manage", "endpoints"],
  ["ai.use", "ai"],
  ["warroom.access", "warroom"],
] as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  owner: PERMISSIONS.map(([code]) => code),
  admin: [
    "brands.read",
    "brands.write",
    "threats.read",
    "threats.write",
    "threats.takedown",
    "alerts.read",
    "alerts.manage",
    "legal.read",
    "legal.write",
    "reports.read",
    "reports.generate",
    "billing.read",
    "team.manage",
    "integrations.manage",
    "endpoints.manage",
    "ai.use",
    "warroom.access",
  ],
  security: [
    "brands.read",
    "threats.read",
    "threats.write",
    "threats.takedown",
    "alerts.read",
    "alerts.manage",
    "reports.read",
    "ai.use",
    "warroom.access",
  ],
  legal: ["brands.read", "threats.read", "legal.read", "legal.write", "reports.read", "reports.generate"],
  marketing: ["brands.read", "threats.read", "alerts.read", "reports.read", "warroom.access"],
  viewer: ["brands.read", "threats.read", "alerts.read", "reports.read"],
  client: [
    "brands.read",
    "threats.read",
    "alerts.read",
    "reports.read",
    "reports.generate",
    "legal.read",
  ],
  superadmin: PERMISSIONS.map(([code]) => code),
};

async function seedRolesAndPermissions() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        scope: role.scope,
        description: role.description,
      },
      create: role,
    });
  }

  for (const [code, category] of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code },
      update: { category },
      create: { code, category },
    });
  }

  const roles = await prisma.role.findMany({ select: { id: true, code: true } });
  const permissions = await prisma.permission.findMany({ select: { id: true, code: true } });
  const permissionByCode = new Map(permissions.map((p) => [p.code, p.id]));

  for (const role of roles) {
    const codes = ROLE_PERMISSIONS[role.code] ?? [];
    for (const code of codes) {
      const permissionId = permissionByCode.get(code);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId,
        },
      });
    }
  }
}

async function seedPlans() {
  const plans = [
    {
      code: "free",
      name: "Free",
      priceMonthlyBrl: 0,
      priceYearlyBrl: 0,
      brandLimit: 1,
      userLimit: 2,
      monitorLimit: 5,
      takedownLimitMonthly: 0,
      features: ["monitoring_basic"],
      isPublic: true,
    },
    {
      code: "starter",
      name: "Starter",
      priceMonthlyBrl: 497,
      priceYearlyBrl: 4970,
      brandLimit: 3,
      userLimit: 5,
      monitorLimit: 25,
      takedownLimitMonthly: 5,
      features: ["monitoring", "alerts", "reports_basic"],
      isPublic: true,
    },
  ];

  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { code: plan.code },
      update: {
        name: plan.name,
        priceMonthlyBrl: plan.priceMonthlyBrl,
        priceYearlyBrl: plan.priceYearlyBrl,
        brandLimit: plan.brandLimit,
        userLimit: plan.userLimit,
        monitorLimit: plan.monitorLimit,
        takedownLimitMonthly: plan.takedownLimitMonthly,
        features: plan.features,
        isPublic: plan.isPublic,
      },
      create: {
        code: plan.code,
        name: plan.name,
        priceMonthlyBrl: plan.priceMonthlyBrl,
        priceYearlyBrl: plan.priceYearlyBrl,
        brandLimit: plan.brandLimit,
        userLimit: plan.userLimit,
        monitorLimit: plan.monitorLimit,
        takedownLimitMonthly: plan.takedownLimitMonthly,
        features: plan.features,
        isPublic: plan.isPublic,
      },
    });
  }
}

async function seedSearchEndpoints() {
  await prisma.platformSetting.upsert({
    where: { key: "endpoints.master_enabled" },
    update: {},
    create: {
      key: "endpoints.master_enabled",
      value: true,
    },
  });

  const now = Date.now();
  for (const endpoint of SEED_ENDPOINTS) {
    const nextRunAt =
      endpoint.enabled && endpoint.health !== "paused"
        ? new Date(now + endpoint.frequencyMin * 60_000)
        : null;

    await prisma.searchEndpoint.upsert({
      where: { code: endpoint.code },
      update: {
        name: endpoint.name,
        category: endpoint.category,
        description: endpoint.description,
        frequencyMin: endpoint.frequencyMin,
        priority: endpoint.priority,
        costPer1k: endpoint.costPer1k,
        requiresKey: endpoint.requiresKey,
        region: endpoint.region ?? null,
        concurrency: endpoint.concurrency,
        tag: endpoint.tag ?? null,
        baseUrl: endpoint.baseUrl ?? null,
      },
      create: {
        code: endpoint.code,
        name: endpoint.name,
        category: endpoint.category,
        description: endpoint.description,
        enabled: endpoint.enabled,
        frequencyMin: endpoint.frequencyMin,
        priority: endpoint.priority,
        health: endpoint.enabled ? endpoint.health : "paused",
        latencyMs: endpoint.latencyMs,
        successRate: endpoint.successRate,
        hits24h: endpoint.hits24h,
        costPer1k: endpoint.costPer1k,
        requiresKey: endpoint.requiresKey,
        region: endpoint.region ?? null,
        concurrency: endpoint.concurrency,
        tag: endpoint.tag ?? null,
        baseUrl: endpoint.baseUrl ?? null,
        isCustom: false,
        nextRunAt,
        advanced: {
          retryBackoff: true,
          ignoreSsl: false,
          rotateUa: true,
          residentialProxy: false,
        },
      },
    });
  }
}

async function main() {
  console.info("Seed: roles, permissions, planos e endpoints...");
  await seedRolesAndPermissions();
  await seedPlans();
  await seedSearchEndpoints();

  const roleCount = await prisma.role.count();
  const permissionCount = await prisma.permission.count();
  const planCount = await prisma.plan.count();
  const endpointCount = await prisma.searchEndpoint.count();
  console.info(
    `Roles: ${roleCount} | Permissions: ${permissionCount} | Plans: ${planCount} | Endpoints: ${endpointCount}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
