export type TeamUserStatus = "active" | "invited" | "suspended";

export type PermissionItem = {
  code: string;
  label: string;
  description: string;
};

export type PermissionGroup = {
  id: string;
  label: string;
  page: string;
  permissions: PermissionItem[];
};

export const PERMISSION_GROUPS: PermissionGroup[] = [
  {
    id: "brands",
    label: "Marcas",
    page: "/dashboard",
    permissions: [
      { code: "brands.read", label: "Visualizar marcas", description: "Listar e abrir detalhes de marcas" },
      { code: "brands.write", label: "Gerenciar marcas", description: "Criar, editar e arquivar marcas" },
    ],
  },
  {
    id: "threats",
    label: "Ameaças",
    page: "/dashboard/threats",
    permissions: [
      { code: "threats.read", label: "Visualizar ameaças", description: "Ver grafo e lista de ameaças" },
      { code: "threats.write", label: "Gerenciar ameaças", description: "Classificar e atualizar casos" },
      { code: "threats.takedown", label: "Solicitar takedown", description: "Iniciar fluxos de remoção" },
    ],
  },
  {
    id: "alerts",
    label: "Alertas",
    page: "/dashboard/alerts",
    permissions: [
      { code: "alerts.read", label: "Visualizar alertas", description: "Inbox e histórico de alertas" },
      { code: "alerts.manage", label: "Gerenciar alertas", description: "Atribuir, resolver e escalar" },
    ],
  },
  {
    id: "legal",
    label: "Jurídico",
    page: "/dashboard/legal",
    permissions: [
      { code: "legal.read", label: "Visualizar jurídico", description: "Dossiês e evidências" },
      { code: "legal.write", label: "Editar jurídico", description: "Atualizar casos e documentos" },
    ],
  },
  {
    id: "reports",
    label: "Relatórios",
    page: "/dashboard/reports",
    permissions: [
      { code: "reports.read", label: "Visualizar relatórios", description: "Dashboards e exports" },
      { code: "reports.generate", label: "Gerar relatórios", description: "Criar PDFs e briefings" },
    ],
  },
  {
    id: "billing",
    label: "Faturamento",
    page: "/dashboard/settings",
    permissions: [
      { code: "billing.read", label: "Visualizar faturamento", description: "Plano, uso e notas fiscais" },
      { code: "billing.manage", label: "Gerenciar faturamento", description: "Alterar plano e pagamento" },
    ],
  },
  {
    id: "team",
    label: "Equipe",
    page: "/dashboard/settings",
    permissions: [
      { code: "team.manage", label: "Gerenciar equipe", description: "Convites, papéis e remoções" },
    ],
  },
  {
    id: "integrations",
    label: "Integrações",
    page: "/dashboard/settings",
    permissions: [
      { code: "integrations.manage", label: "Gerenciar integrações", description: "Slack, webhooks e API" },
    ],
  },
  {
    id: "endpoints",
    label: "Endpoints",
    page: "/dashboard/endpoints",
    permissions: [
      {
        code: "endpoints.manage",
        label: "Gerenciar endpoints",
        description: "Ligar, calibrar e monitorar fontes de captura",
      },
    ],
  },
  {
    id: "ai",
    label: "IA",
    page: "/dashboard/ai",
    permissions: [
      { code: "ai.use", label: "Usar assistente IA", description: "Brand AI e autopilot" },
    ],
  },
  {
    id: "warroom",
    label: "War Room",
    page: "/dashboard/warroom",
    permissions: [
      { code: "warroom.access", label: "Acessar War Room", description: "Sala de crise em tempo real" },
    ],
  },
];

export const STATUS_LABEL: Record<TeamUserStatus, string> = {
  active: "Ativo",
  invited: "Convidado",
  suspended: "Suspenso",
};

export const PROTECTED_ROLE_CODES = new Set(["owner", "superadmin"]);

/** Perfis de organização atribuíveis a membros (exceto protegidos). */
export function isAssignableRole(role: { code: string; scope: string }): boolean {
  return role.scope === "org" && !PROTECTED_ROLE_CODES.has(role.code);
}
export function buildPermissionMap(roles: Array<{ code: string; permissions: string[] }>) {
  const allCodes = PERMISSION_GROUPS.flatMap((group) => group.permissions.map((perm) => perm.code));
  const result: Record<string, Record<string, boolean>> = {};

  for (const role of roles) {
    const allowed = new Set(role.permissions);
    result[role.code] = {};
    for (const code of allCodes) {
      result[role.code][code] = allowed.has(code);
    }
  }

  return result;
}

export function permissionsToCodes(map: Record<string, boolean>): string[] {
  return Object.entries(map)
    .filter(([, enabled]) => enabled)
    .map(([code]) => code);
}
