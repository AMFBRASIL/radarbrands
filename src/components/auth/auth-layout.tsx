import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import { ReactNode } from "react";
import shieldImg from "@/assets/auth-shield.png";

interface AuthLayoutProps {
  side: "login" | "register";
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
  bullets?: string[];
}

export function AuthLayout({ side, eyebrow, title, subtitle, children, footer, bullets }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Top nav */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] glow-primary">
            <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold tracking-tight">Radar | brands</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              Sua marca no Radar
            </span>
          </div>
        </Link>
        <Link
          to={side === "login" ? "/register" : "/login"}
          className="glass-strong rounded-full px-5 py-2 text-sm font-medium ring-gradient transition-transform hover:-translate-y-0.5"
        >
          {side === "login" ? "Criar conta →" : "Entrar →"}
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        {/* Floating visual */}
        <section className="relative hidden min-h-[640px] lg:block">
          {/* Concentric rings */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {[320, 460, 600].map((s) => (
              <div
                key={s}
                className="absolute rounded-full border border-primary/15"
                style={{
                  width: s,
                  height: s,
                  left: -s / 2,
                  top: -s / 2,
                }}
              />
            ))}
          </div>

          {/* Floating chips */}
          <div className="absolute left-4 top-24 glass-strong ring-gradient rounded-2xl px-4 py-3 shadow-xl animate-[float_6s_ease-in-out_infinite]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
                ✓
              </div>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Marca concedida</div>
                <div className="font-mono text-[11px] text-muted-foreground">AURORA · BR 928.471.339</div>
              </div>
            </div>
          </div>

          <div className="absolute right-6 top-8 rounded-full bg-foreground px-4 py-2 text-background shadow-2xl animate-[float_7s_ease-in-out_infinite_reverse]">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest">
              <Shield className="h-3.5 w-3.5" /> INPI Conectado
            </div>
            <div className="font-mono text-[10px] opacity-70">RPI 2.812 · sincronizado</div>
          </div>

          <div className="absolute bottom-16 right-2 glass-strong ring-gradient w-[280px] rounded-2xl p-4 shadow-xl animate-[float_8s_ease-in-out_infinite]">
            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Monitoramento ativo
            </div>
            <div className="mt-1 text-lg font-bold">27 marcas protegidas</div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full w-4/5 rounded-full bg-[image:var(--gradient-primary)]" />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">Última varredura · há 12 min</div>
          </div>

          {/* Central floating hero */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={shieldImg}
              alt="Radar brand shield"
              width={420}
              height={420}
              className="h-[420px] w-[420px] object-contain drop-shadow-[0_30px_60px_rgba(59,130,246,0.35)] animate-[float_6s_ease-in-out_infinite]"
            />
          </div>

          {/* Bullets under */}
          {bullets && (
            <ul className="absolute bottom-0 left-0 space-y-2">
              {bullets.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-[11px] text-emerald-500">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Form card */}
        <section className="flex items-center">
          <div className="glass-strong ring-gradient w-full rounded-3xl p-8 shadow-2xl sm:p-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Shield className="h-3.5 w-3.5" /> {eyebrow}
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-3 text-muted-foreground">{subtitle}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 pb-8 text-center text-xs text-muted-foreground">
        Protegido por TLS 1.3 · LGPD compliant · ISO 27001
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-14px) rotate(0.5deg); }
        }
        .absolute.left-1\\/2.top-1\\/2 img { animation-name: float; }
      `}</style>
    </div>
  );
}
