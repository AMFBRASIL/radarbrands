import { Link } from "@tanstack/react-router";
import { ArrowRight, Command, Fingerprint, Radar, Shield } from "lucide-react";
import type { ReactNode } from "react";

import { Corner, GoogleIcon, SsoButton } from "./radar-auth-primitives";

const BRAND_BLIPS = [
  { name: "Marca 1", angle: 35, distance: 95, delay: "0s" },
  { name: "Marca 2", angle: 120, distance: 135, delay: "1.2s" },
  { name: "Marca 3", angle: 215, distance: 110, delay: "2.4s" },
  { name: "Marca 4", angle: 305, distance: 155, delay: "3.1s" },
];

interface RadarAuthLayoutProps {
  mode: "login" | "register";
  heroEyebrow: string;
  heroTitle: ReactNode;
  heroSubtitle: string;
  showBrandBlips?: boolean;
  formEyebrow?: string;
  formTitle: ReactNode;
  formSubtitle: string;
  dividerLabel: string;
  children: ReactNode;
  footer: ReactNode;
}

export function RadarAuthLayout({
  mode,
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  showBrandBlips = false,
  formEyebrow = "Portal Cliente",
  formTitle,
  formSubtitle,
  dividerLabel,
  children,
  footer,
}: RadarAuthLayoutProps) {
  const alternateRoute = mode === "login" ? "/register" : "/login";
  const alternateLabel = mode === "login" ? "Criar conta" : "Já tenho conta";

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b14] text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-[20%] -left-[10%] h-[60%] w-[60%] rounded-full bg-cyan-500/10 blur-[140px]" />
        <div className="absolute -bottom-[20%] right-[-10%] h-[60%] w-[60%] rounded-full bg-emerald-500/10 blur-[140px]" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(34,211,238,.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(34,211,238,.5) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
      </div>

      <header className="relative z-20 mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 shadow-[0_0_30px_rgba(34,211,238,0.35)]">
            <Shield className="h-5 w-5 text-[#050b14]" strokeWidth={2.75} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-bold tracking-tight">Radar | brands</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-400">Sua marca no Radar</span>
          </div>
        </Link>
        <Link
          to={alternateRoute}
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-white/10"
        >
          {alternateLabel}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 pb-10 lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 lg:flex lg:flex-col lg:justify-center">
          <Corner className="left-3 top-3" pos="tl" />
          <Corner className="right-3 top-3" pos="tr" />
          <Corner className="left-3 bottom-3" pos="bl" />
          <Corner className="right-3 bottom-3" pos="br" />

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
            <Radar className="h-3 w-3" /> {heroEyebrow}
          </div>

          <h2 className="mt-6 max-w-md font-display text-4xl font-bold leading-[1.05] tracking-tight">{heroTitle}</h2>
          <p className="mt-3 max-w-md text-sm text-white/60">{heroSubtitle}</p>

          <div className="relative mx-auto mt-10 h-[320px] w-[320px]">
            {[80, 140, 200, 260, 320].map((s, i) => (
              <div
                key={s}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/15"
                style={{ width: s, height: s, opacity: 1 - i * 0.12 }}
              />
            ))}
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-cyan-400/10" />
            <div className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-cyan-400/10" />
            <div
              className="absolute left-1/2 top-1/2 h-[160px] w-[160px] origin-top-left"
              style={{
                background: "conic-gradient(from 0deg, rgba(34,211,238,0.55), transparent 25%)",
                transformOrigin: "0 0",
                animation: "radarSweep 4s linear infinite",
                borderRadius: "0 100% 0 0",
              }}
            />
            <div className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan-400/40 bg-cyan-400/10 backdrop-blur-xl">
              <Shield className="h-6 w-6 text-cyan-300" />
            </div>

            {showBrandBlips &&
              BRAND_BLIPS.map((brand) => {
                const rad = (brand.angle * Math.PI) / 180;
                const x = 160 + brand.distance * Math.cos(rad);
                const y = 160 + brand.distance * Math.sin(rad);
                return (
                  <div
                    key={brand.name}
                    className="absolute flex items-center gap-2"
                    style={{ left: x, top: y, transform: "translate(-50%, -50%)", animationDelay: brand.delay }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/60"
                        style={{ animationDelay: brand.delay }}
                      />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
                    </span>
                    <span className="whitespace-nowrap rounded-md bg-[#050b14]/70 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-cyan-200/80 backdrop-blur-sm">
                      {brand.name}
                    </span>
                  </div>
                );
              })}
          </div>
        </section>

        <section className="flex items-center">
          <div className="relative w-full">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-cyan-400/30 via-transparent to-emerald-400/20 opacity-60 blur-2xl"
            />
            <div className="relative rounded-[26px] border border-white/10 bg-[#0a121e]/80 p-8 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(34,211,238,0.25)] sm:p-10">
              <Corner className="left-2 top-2" pos="tl" small />
              <Corner className="right-2 top-2" pos="tr" small />
              <Corner className="left-2 bottom-2" pos="bl" small />
              <Corner className="right-2 bottom-2" pos="br" small />

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                <Command className="h-3 w-3" /> {formEyebrow}
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-[42px]">{formTitle}</h1>
              <p className="mt-2.5 text-sm text-white/60">{formSubtitle}</p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <SsoButton icon={<GoogleIcon />} label="Google" />
                <SsoButton icon={<Fingerprint className="h-4 w-4" />} label="Gov.br" />
              </div>

              <div className="my-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
                <div className="h-px flex-1 bg-white/10" /> {dividerLabel} <div className="h-px flex-1 bg-white/10" />
              </div>

              {children}

              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5 font-mono text-[10px] uppercase tracking-widest text-white/30">
                <span>TLS 1.3 · AES-256</span>
                <span>LGPD · ISO 27001</span>
              </div>

              <div className="mt-4 text-center text-sm text-white/50">{footer}</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function FrauncesItalic({ children }: { children: ReactNode }) {
  return (
    <span className="italic text-cyan-300" style={{ fontFamily: "'Fraunces', serif" }}>
      {children}
    </span>
  );
}
