import { Link } from "@tanstack/react-router";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const nav: { label: string; href: string; to?: string }[] = [
  { label: "Plataforma", href: "#plataforma" },
  { label: "Como funciona", href: "/como-funciona", to: "/como-funciona" },
  { label: "Proteção", href: "#protecao" },
  { label: "IA", href: "#ia" },
  { label: "Preços", href: "#precos" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto mt-3 max-w-7xl px-4">
        <div className="glass-strong flex items-center justify-between rounded-2xl px-4 py-3 ring-gradient">
          <Link to="/" className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] glow-primary">
              <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold tracking-tight">BrandShield</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
                AI
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Login
            </Link>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm" asChild>
              <a href="#scan">Teste gratuito</a>
            </Button>
            <Button size="sm" asChild className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
              <a href="#scan">Monitorar marca agora</a>
            </Button>
          </div>

          <button
            className="rounded-md p-2 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="glass-strong mt-2 flex flex-col gap-1 rounded-2xl p-3 md:hidden">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/dashboard"
              className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
            >
              Login
            </Link>
            <Button className="mt-2 bg-[image:var(--gradient-primary)] text-primary-foreground" asChild>
              <a href="#scan">Monitorar marca agora</a>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
