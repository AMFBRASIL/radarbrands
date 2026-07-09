import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  Command as CommandIcon,
  Eye,
  FlaskConical,
  Gift,
  Globe,
  Home,
  Megaphone,
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
  Wallet,
  Zap,
} from "lucide-react";

type Item = {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  keywords?: string;
};

const items: Item[] = [
  { label: "Dashboard", to: "/dashboard", icon: Home, group: "Ir para", keywords: "home início" },
  { label: "Alertas", to: "/dashboard/alerts", icon: AlertTriangle, group: "Ir para" },
  { label: "War Room", to: "/dashboard/warroom", icon: ShieldAlert, group: "Ir para", keywords: "crise sla" },
  { label: "Monitoramento", to: "/dashboard/monitoring", icon: ShieldCheck, group: "Ir para" },
  { label: "Domínios", to: "/dashboard/domains", icon: Globe, group: "Proteção" },
  { label: "Redes sociais", to: "/dashboard/social", icon: Smartphone, group: "Proteção" },
  { label: "Google Ads", to: "/dashboard/ads", icon: Megaphone, group: "Proteção" },
  { label: "Marketplaces", to: "/dashboard/marketplace", icon: ShoppingCart, group: "Proteção" },
  { label: "Dark Web", to: "/dashboard/darkweb", icon: Eye, group: "Proteção" },
  { label: "Predictive Risk", to: "/dashboard/predict", icon: Radar, group: "Inteligência" },
  { label: "Crisis Radar", to: "/dashboard/crisis", icon: Zap, group: "Inteligência" },
  { label: "AI Autopilot", to: "/dashboard/autopilot", icon: Sparkles, group: "Automação" },
  { label: "Brand AI Assistant", to: "/dashboard/ai", icon: Bot, group: "Automação" },
  { label: "Semana Radar", to: "/dashboard/wrapped", icon: Gift, group: "Negócio", keywords: "wrapped resumo" },
  { label: "ROI Calculator", to: "/dashboard/roi", icon: Wallet, group: "Negócio" },
  { label: "Relatórios", to: "/dashboard/reports", icon: BarChart3, group: "Negócio" },
  { label: "Modo TV", to: "/dashboard/tv", icon: Tv, group: "Ferramentas", keywords: "apresentação telão" },
  { label: "Playground público", to: "/playground", icon: FlaskConical, group: "Ferramentas" },
  { label: "Status pública", to: "/status", icon: Signal, group: "Ferramentas" },
  { label: "Onboarding", to: "/dashboard/onboarding", icon: Rocket, group: "Conta" },
  { label: "Configurações", to: "/dashboard/settings", icon: Settings, group: "Conta" },
];

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const groups = Array.from(new Set(items.map((i) => i.group)));

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar rotas, ações, marcas…" />
      <CommandList>
        <CommandEmpty>Nada encontrado.</CommandEmpty>
        {groups.map((g, idx) => (
          <div key={g}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={g}>
              {items
                .filter((i) => i.group === g)
                .map((i) => (
                  <CommandItem
                    key={i.to}
                    value={`${i.label} ${i.keywords ?? ""}`}
                    onSelect={() => go(i.to)}
                  >
                    <i.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    {i.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </div>
        ))}
        <CommandSeparator />
        <CommandGroup heading="Dica">
          <CommandItem disabled>
            <CommandIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            Pressione
            <CommandShortcut>⌘K</CommandShortcut>
            em qualquer tela
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return { open, setOpen };
}
