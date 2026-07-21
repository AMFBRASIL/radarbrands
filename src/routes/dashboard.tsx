import { createFileRoute, Link, Outlet, redirect, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { LogOut, Search, Settings } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { CommandPalette, useCommandPalette } from "@/components/dashboard/command-palette";
import { NotificationsBell } from "@/components/dashboard/notifications-bell";
import { AiChatFab } from "@/components/dashboard/ai-chat-fab";
import { fetchCurrentAuth } from "@/lib/fetch-current-auth";
import { logoutRequest } from "@/lib/auth-api";
import {
  canAccessRoute,
  getFirstAccessibleDashboardPath,
  getUserPermissions,
} from "@/lib/navigation-access";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ location }) => {
    const auth = await fetchCurrentAuth();
    if (!auth) {
      throw redirect({ to: "/login" });
    }

    const permissions = getUserPermissions(auth);
    const pathname = location.pathname;

    if (!auth.membership && pathname !== "/dashboard/onboarding" && pathname !== "/dashboard/profile") {
      throw redirect({ to: "/dashboard/onboarding" });
    }

    if (!canAccessRoute(pathname, permissions)) {
      const to = getFirstAccessibleDashboardPath(permissions);
      throw redirect({
        href: `${to}?denied=${encodeURIComponent(pathname)}`,
      });
    }

    return { auth };
  },
  head: () => ({
    meta: [
      { title: "Dashboard · Radar | brands" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();
  const { auth } = Route.useRouteContext();
  const { open, setOpen } = useCommandPalette();
  const permissions = getUserPermissions(auth);
  const locationSearch = useRouterState({ select: (state) => state.location.searchStr });
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  useEffect(() => {
    const params = new URLSearchParams(locationSearch);
    const denied = params.get("denied");
    if (!denied) return;

    toast.error("Acesso negado", {
      description: "Seu perfil não tem permissão para acessar essa área.",
    });

    params.delete("denied");
    const nextSearch = params.toString();
    navigate({
      to: pathname,
      search: nextSearch ? (Object.fromEntries(params) as never) : undefined,
      replace: true,
    });
  }, [locationSearch, navigate, pathname]);

  const displayName = auth.user.displayName ?? auth.user.fullName;
  const orgName = auth.organization?.displayName ?? "Sem organização";

  const handleLogout = async () => {
    try {
      await logoutRequest();
      toast.info("Você saiu da sessão", { description: "Redirecionando para o login..." });
      setTimeout(() => navigate({ to: "/login" }), 400);
    } catch {
      toast.error("Não foi possível encerrar a sessão");
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar key={permissions.join("|")} permissions={permissions} />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur">
            <SidebarTrigger />
            <button
              onClick={() => setOpen(true)}
              className="relative hidden max-w-md flex-1 items-center gap-2 rounded-md border border-border/60 bg-muted/30 px-3 py-1.5 text-left text-sm text-muted-foreground transition hover:bg-muted md:flex"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1">Buscar marca, domínio, alerta…</span>
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border/60 bg-background px-1.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </button>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <NotificationsBell />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-2 py-1 transition hover:bg-muted">
                    <div className="h-6 w-6 rounded-full bg-[image:var(--gradient-primary)]" />
                    <div className="hidden text-left text-xs sm:block">
                      <div className="font-medium">{displayName}</div>
                      <div className="text-muted-foreground">{orgName}</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="flex cursor-pointer items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Editar dados
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-8">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} permissions={permissions} />
      <AiChatFab />
    </SidebarProvider>
  );
}
