import { useState } from "react";
import { Bell, ShieldAlert, Globe, Megaphone, Instagram, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Link } from "@tanstack/react-router";

type Notif = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  time: string;
  tone: "danger" | "warning" | "success";
  to: string;
};

const initial: Notif[] = [
  {
    id: "1",
    icon: ShieldAlert,
    title: "Ameaça crítica detectada",
    desc: "Domínio cadbrasiI.com.br registrado há 4 min",
    time: "agora",
    tone: "danger",
    to: "/dashboard/domains",
  },
  {
    id: "2",
    icon: Megaphone,
    title: "Concorrente em Google Ads",
    desc: 'Anunciante usando "Cadbrasil" no título',
    time: "12 min",
    tone: "warning",
    to: "/dashboard/ads",
  },
  {
    id: "3",
    icon: Instagram,
    title: "Perfil falso identificado",
    desc: "@cadbrasil.of removido automaticamente",
    time: "1 h",
    tone: "success",
    to: "/dashboard/social",
  },
  {
    id: "4",
    icon: Globe,
    title: "3 novos domínios monitorados",
    desc: "Radar expandiu a varredura noturna",
    time: "3 h",
    tone: "success",
    to: "/dashboard/domains",
  },
];

export function NotificationsBell() {
  const [items, setItems] = useState(initial);
  const [open, setOpen] = useState(false);
  const unread = items.length;

  const dismiss = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          aria-label="Notificações"
          className="relative rounded-lg p-2 hover:bg-muted"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <>
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 font-mono text-[9px] font-bold text-destructive-foreground">
                {unread}
              </span>
              <span className="absolute right-1 top-1 h-4 w-4 animate-ping rounded-full bg-destructive/60" />
            </>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div>
            <div className="text-sm font-semibold">Notificações</div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              {unread} não lidas
            </div>
          </div>
          <button
            onClick={() => setItems([])}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Marcar todas
          </button>
        </div>
        <div className="max-h-[420px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Tudo em dia. Nenhuma notificação.
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {items.map((n) => {
                const Icon = n.icon;
                const tone =
                  n.tone === "danger"
                    ? "bg-destructive/15 text-destructive"
                    : n.tone === "warning"
                    ? "bg-[color:var(--warning)]/15 text-[color:var(--warning)]"
                    : "bg-[color:var(--success)]/15 text-[color:var(--success)]";
                return (
                  <li key={n.id} className="group relative">
                    <Link
                      to={n.to}
                      onClick={() => setOpen(false)}
                      className="flex items-start gap-3 p-3 pr-9 hover:bg-muted/40"
                    >
                      <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">{n.title}</div>
                        <div className="truncate text-xs text-muted-foreground">{n.desc}</div>
                        <div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                          {n.time}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        dismiss(n.id);
                      }}
                      aria-label="Dispensar"
                      className="absolute right-2 top-2 rounded p-1 opacity-0 transition group-hover:opacity-100 hover:bg-muted"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="border-t border-border/60 p-2">
          <Link
            to="/dashboard/alerts"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-center text-xs font-medium text-primary hover:bg-muted"
          >
            Ver todos os alertas →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
