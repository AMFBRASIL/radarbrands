import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Brain,
  Crown,
  Eye,
  FileAudio,
  Gavel,
  Globe,
  Home,
  Megaphone,
  Network,
  Radar,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type Item = { title: string; url: string; icon: React.ComponentType<{ className?: string }>; exact?: boolean; badge?: string };

const overview: Item[] = [
  { title: "Dashboard", url: "/dashboard", icon: Home, exact: true },
  { title: "Alertas", url: "/dashboard/alerts", icon: AlertTriangle },
  { title: "Monitoramento", url: "/dashboard/monitoring", icon: ShieldCheck },
];

const protection: Item[] = [
  { title: "Domínios", url: "/dashboard/domains", icon: Globe },
  { title: "Redes Sociais", url: "/dashboard/social", icon: Smartphone },
  { title: "Google Ads", url: "/dashboard/ads", icon: Megaphone },
  { title: "Marketplaces", url: "/dashboard/marketplace", icon: ShoppingCart },
  { title: "App Stores", url: "/dashboard/apps", icon: Smartphone, badge: "NEW" },
  { title: "Dark Web", url: "/dashboard/darkweb", icon: Eye, badge: "NEW" },
];

const intelligence: Item[] = [
  { title: "Threat Graph", url: "/dashboard/threats", icon: Network, badge: "PRO" },
  { title: "Predictive Risk", url: "/dashboard/predict", icon: Radar, badge: "PRO" },
  { title: "Deepfake Detector", url: "/dashboard/deepfake", icon: FileAudio, badge: "PRO" },
  { title: "Crisis Radar", url: "/dashboard/crisis", icon: Zap, badge: "PRO" },
  { title: "Competitor Intel", url: "/dashboard/competitors", icon: Brain, badge: "PRO" },
  { title: "Influencer Watch", url: "/dashboard/influencers", icon: Users },
];

const automation: Item[] = [
  { title: "AI Autopilot", url: "/dashboard/autopilot", icon: Sparkles, badge: "BETA" },
  { title: "Brand AI Assistant", url: "/dashboard/ai", icon: Bot },
  { title: "Playbooks", url: "/dashboard/playbooks", icon: Workflow, badge: "NEW" },
];

const business: Item[] = [
  { title: "ROI Calculator", url: "/dashboard/roi", icon: Wallet, badge: "NEW" },
  { title: "Executive Briefing", url: "/dashboard/briefing", icon: Crown, badge: "NEW" },
  { title: "Relatórios", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Jurídico", url: "/dashboard/legal", icon: Gavel },
];

const account: Item[] = [
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
];

const groups: { label: string; items: Item[] }[] = [
  { label: "Visão Geral", items: overview },
  { label: "Proteção", items: protection },
  { label: "Inteligência IA", items: intelligence },
  { label: "Automação", items: automation },
  { label: "Negócio", items: business },
  { label: "Conta", items: account },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-bold">BrandShield</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-primary">
              AI Console
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {groups.map((g) => (
          <SidebarGroup key={g.label}>
            <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {g.items.map((it) => (
                  <SidebarMenuItem key={it.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(it.url, it.exact)}
                      tooltip={it.title}
                    >
                      <Link to={it.url} className="flex items-center gap-2">
                        <it.icon className="h-4 w-4" />
                        <span className="flex-1 truncate">{it.title}</span>
                        {it.badge && (
                          <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary group-data-[collapsible=icon]:hidden">
                            {it.badge}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
