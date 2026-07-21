import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Shield } from "lucide-react";
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
import { sidebarGroups } from "@/lib/dashboard-navigation";
import { filterNavItems } from "@/lib/navigation-access";

type AppSidebarProps = {
  permissions: string[];
};

export function AppSidebar({ permissions }: AppSidebarProps) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (url: string, exact?: boolean) =>
    exact ? pathname === url : pathname === url || pathname.startsWith(url + "/");

  const visibleGroups = useMemo(
    () =>
      sidebarGroups
        .map((group) => ({
          ...group,
          items: filterNavItems(group.items, permissions),
        }))
        .filter((group) => group.items.length > 0),
    [permissions],
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLDivElement>('[data-sidebar="content"]');
    if (!el) return;
    const check = () => {
      const more = el.scrollHeight - el.clientHeight - el.scrollTop > 8;
      setHasMore(more);
    };
    check();
    el.addEventListener("scroll", check, { passive: true });
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", check);
      ro.disconnect();
    };
  }, [visibleGroups]);

  const scrollDown = () => {
    const el = scrollRef.current?.querySelector<HTMLDivElement>('[data-sidebar="content"]');
    el?.scrollBy({ top: 200, behavior: "smooth" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border/60">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
            <Shield className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-bold">Radar | brands</span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-primary">
              Sua marca no Radar
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <div ref={scrollRef} className="relative flex min-h-0 flex-1 flex-col">
        <SidebarContent className="scrollbar-none">
          {visibleGroups.map((group) => (
            <SidebarGroup key={group.label}>
              <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.url, item.exact)}
                        tooltip={item.title}
                      >
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span className="flex-1 truncate">{item.title}</span>
                          {item.badge && (
                            <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary group-data-[collapsible=icon]:hidden">
                              {item.badge}
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
          <div className="h-8" />
        </SidebarContent>
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-sidebar via-sidebar/90 to-transparent transition-opacity duration-300 ${
            hasMore ? "opacity-100" : "opacity-0"
          }`}
        />
        <button
          type="button"
          onClick={scrollDown}
          aria-label="Ver mais itens do menu"
          className={`absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 rounded-2xl border border-sidebar-border/70 bg-sidebar/95 px-4 py-2 text-primary shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-sidebar-accent group-data-[collapsible=icon]:hidden ${
            hasMore ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
          }`}
        >
          <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/80">
            Mais módulos
          </span>
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </Sidebar>
  );
}
