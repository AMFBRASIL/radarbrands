import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { Bell, LogOut, Search, Settings, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard · Radar | brand" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardLayout,
});

function DashboardLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.info("Você saiu da sessão", { description: "Redirecionando para o login..." });
    setTimeout(() => navigate({ to: "/login2" }), 600);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur">
            <SidebarTrigger />
            <div className="relative hidden max-w-md flex-1 md:block">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar marca, domínio, alerta…"
                className="h-9 border-border/60 bg-muted/30 pl-8"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <ThemeToggle />
              <button className="relative rounded-lg p-2 hover:bg-muted">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-2 py-1 transition hover:bg-muted">
                    <div className="h-6 w-6 rounded-full bg-[image:var(--gradient-primary)]" />
                    <div className="hidden text-left text-xs sm:block">
                      <div className="font-medium">Marina Souza</div>
                      <div className="text-muted-foreground">Cadbrasil</div>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings" className="flex cursor-pointer items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Editar dados
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer">
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
    </SidebarProvider>
  );
}
