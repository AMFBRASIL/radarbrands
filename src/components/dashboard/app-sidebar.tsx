import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Gavel,
  Globe,
  Home,
  Megaphone,
  Settings,
  Shield,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
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

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home, exact: true },
  { title: "Monitoramento", url: "/dashboard/monitoring", icon: ShieldCheck },
  { title: "Alertas", url: "/dashboard/alerts", icon: AlertTriangle },
  { title: "Domínios", url: "/dashboard/domains", icon: Globe },
  { title: "Redes Sociais", url: "/dashboard/social", icon: Smartphone },
  { title: "Google Ads", url: "/dashboard/ads", icon: Megaphone },
  { title: "Marketplaces", url: "/dashboard/marketplace", icon: ShoppingCart },
  { title: "Jurídico", url: "/dashboard/legal", icon: Gavel },
  { title: "IA Assistant", url: "/dashboard/ai", icon: Bot },
  { title: "Relatórios", url: "/dashboard/reports", icon: BarChart3 },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
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
        <SidebarGroup>
          <SidebarGroupLabel>Proteção</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((it) => (
                <SidebarMenuItem key={it.title}>
                  <SidebarMenuButton asChild isActive={isActive(it.url, it.exact)} tooltip={it.title}>
                    <Link to={it.url} className="flex items-center gap-2">
                      <it.icon className="h-4 w-4" />
                      <span>{it.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
