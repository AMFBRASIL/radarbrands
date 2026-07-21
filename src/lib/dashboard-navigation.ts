import {
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  Crown,
  Eye,
  FileAudio,
  FlaskConical,
  Gavel,
  Gift,
  Globe,
  Home,
  Megaphone,
  Network,
  Radar,
  Rocket,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  Signal,
  Smartphone,
  Sparkles,
  Tv,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

import type { NavItem } from "@/lib/navigation-access";

export const sidebarOverview: NavItem[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home, exact: true, permission: "brands.read" },
  { title: "Alertas", url: "/dashboard/alerts", icon: AlertTriangle, permission: "alerts.read" },
  { title: "Monitoramento", url: "/dashboard/monitoring", icon: ShieldCheck, permission: "brands.read" },
];

export const sidebarProtection: NavItem[] = [
  { title: "Domínios", url: "/dashboard/domains", icon: Globe, permission: "brands.read" },
  { title: "Redes Sociais", url: "/dashboard/social", icon: Smartphone, permission: "brands.read" },
  { title: "Google Ads", url: "/dashboard/ads", icon: Megaphone, permission: "brands.read" },
  { title: "Marketplaces", url: "/dashboard/marketplace", icon: ShoppingCart, permission: "brands.read" },
  { title: "App Stores", url: "/dashboard/apps", icon: Smartphone, badge: "NEW", permission: "brands.read" },
  { title: "Dark Web", url: "/dashboard/darkweb", icon: Eye, badge: "NEW", permission: "threats.read" },
];

export const sidebarIntelligence: NavItem[] = [
  { title: "War Room", url: "/dashboard/warroom", icon: ShieldAlert, badge: "LIVE", permission: "warroom.access" },
  { title: "Threat Graph", url: "/dashboard/threats", icon: Network, badge: "PRO", permission: "threats.read" },
  { title: "Predictive Risk", url: "/dashboard/predict", icon: Radar, badge: "PRO", permission: "threats.read" },
  { title: "Deepfake Detector", url: "/dashboard/deepfake", icon: FileAudio, badge: "PRO", permission: "threats.read" },
  { title: "Crisis Radar", url: "/dashboard/crisis", icon: Zap, badge: "PRO", permission: "threats.read" },
  { title: "Competitor Intel", url: "/dashboard/competitors", icon: Brain, badge: "PRO", permission: "threats.read" },
  { title: "Influencer Watch", url: "/dashboard/influencers", icon: Users, permission: "threats.read" },
];

export const sidebarAutomation: NavItem[] = [
  { title: "AI Autopilot", url: "/dashboard/autopilot", icon: Sparkles, badge: "BETA", permission: "ai.use" },
  { title: "Brand AI Assistant", url: "/dashboard/ai", icon: Bot, permission: "ai.use" },
  { title: "Playbooks", url: "/dashboard/playbooks", icon: Workflow, badge: "NEW", permission: "alerts.manage" },
];

export const sidebarBusiness: NavItem[] = [
  { title: "Semana Radar", url: "/dashboard/wrapped", icon: Gift, badge: "NEW", permission: "reports.read" },
  { title: "ROI Calculator", url: "/dashboard/roi", icon: Wallet, badge: "NEW", permission: "reports.read" },
  { title: "Executive Briefing", url: "/dashboard/briefing", icon: Crown, badge: "NEW", permission: "reports.read" },
  { title: "Relatórios", url: "/dashboard/reports", icon: BarChart3, permission: "reports.read" },
  { title: "Jurídico", url: "/dashboard/legal", icon: Gavel, permission: "legal.read" },
];

export const sidebarAccount: NavItem[] = [
  {
    title: "Endpoints de Busca",
    url: "/dashboard/endpoints",
    icon: Radar,
    badge: "CORE",
    permission: "endpoints.manage",
  },
  { title: "Onboarding", url: "/dashboard/onboarding", icon: Rocket, badge: "SETUP", permission: null },
  { title: "Modo TV", url: "/dashboard/tv", icon: Tv, badge: "NEW", permission: "brands.read" },
  { title: "Playground", url: "/playground", icon: FlaskConical, permission: null },
  { title: "Status pública", url: "/status", icon: Signal, permission: null },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
    permission: ["team.manage", "integrations.manage", "billing.read", "billing.manage", "endpoints.manage"],
  },
];

export const sidebarGroups: { label: string; items: NavItem[] }[] = [
  { label: "Visão Geral", items: sidebarOverview },
  { label: "Proteção", items: sidebarProtection },
  { label: "Inteligência IA", items: sidebarIntelligence },
  { label: "Automação", items: sidebarAutomation },
  { label: "Negócio", items: sidebarBusiness },
  { label: "Conta", items: sidebarAccount },
];

export const commandPaletteItems: Array<NavItem & { group: string }> = [
  { title: "Dashboard", url: "/dashboard", icon: Home, group: "Ir para", keywords: "home início", permission: "brands.read" },
  { title: "Alertas", url: "/dashboard/alerts", icon: AlertTriangle, group: "Ir para", permission: "alerts.read" },
  { title: "War Room", url: "/dashboard/warroom", icon: ShieldAlert, group: "Ir para", keywords: "crise sla", permission: "warroom.access" },
  { title: "Monitoramento", url: "/dashboard/monitoring", icon: ShieldCheck, group: "Ir para", permission: "brands.read" },
  { title: "Domínios", url: "/dashboard/domains", icon: Globe, group: "Proteção", permission: "brands.read" },
  { title: "Redes sociais", url: "/dashboard/social", icon: Smartphone, group: "Proteção", permission: "brands.read" },
  { title: "Google Ads", url: "/dashboard/ads", icon: Megaphone, group: "Proteção", permission: "brands.read" },
  { title: "Marketplaces", url: "/dashboard/marketplace", icon: ShoppingCart, group: "Proteção", permission: "brands.read" },
  { title: "Dark Web", url: "/dashboard/darkweb", icon: Eye, group: "Proteção", permission: "threats.read" },
  { title: "Predictive Risk", url: "/dashboard/predict", icon: Radar, group: "Inteligência", permission: "threats.read" },
  { title: "Crisis Radar", url: "/dashboard/crisis", icon: Zap, group: "Inteligência", permission: "threats.read" },
  { title: "AI Autopilot", url: "/dashboard/autopilot", icon: Sparkles, group: "Automação", permission: "ai.use" },
  { title: "Brand AI Assistant", url: "/dashboard/ai", icon: Bot, group: "Automação", permission: "ai.use" },
  { title: "Semana Radar", url: "/dashboard/wrapped", icon: Gift, group: "Negócio", keywords: "wrapped resumo", permission: "reports.read" },
  { title: "ROI Calculator", url: "/dashboard/roi", icon: Wallet, group: "Negócio", permission: "reports.read" },
  { title: "Relatórios", url: "/dashboard/reports", icon: BarChart3, group: "Negócio", permission: "reports.read" },
  { title: "Modo TV", url: "/dashboard/tv", icon: Tv, group: "Ferramentas", keywords: "apresentação telão", permission: "brands.read" },
  { title: "Playground público", url: "/playground", icon: FlaskConical, group: "Ferramentas", permission: null },
  { title: "Status pública", url: "/status", icon: Signal, group: "Ferramentas", permission: null },
  { title: "Onboarding", url: "/dashboard/onboarding", icon: Rocket, group: "Conta", permission: null },
  {
    title: "Configurações",
    url: "/dashboard/settings",
    icon: Settings,
    group: "Conta",
    permission: ["team.manage", "integrations.manage", "billing.read", "billing.manage"],
  },
];
