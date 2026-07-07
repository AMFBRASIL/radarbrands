import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Shield, Mail, Lock, Eye, EyeOff, Fingerprint, ArrowRight,
  Radar, Sparkles, Command,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/login2")({
  head: () => ({
    meta: [
      { title: "Entrar · Radar | brand" },
      { name: "description", content: "Portal do cliente Radar | brand." },
    ],
  }),
  component: Login2Page,
});

function Login2Page() {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050b14] text-white">
      {/* ambient */}
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
            <span className="font-display text-sm font-bold tracking-tight">Radar | brand</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-400">Sua marca no Radar</span>
          </div>
        </Link>
        <Link
          to="/register2"
          className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm font-medium backdrop-blur-xl transition hover:border-cyan-400/40 hover:bg-white/10"
        >
          Criar conta
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </header>

      <main className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 gap-8 px-6 pb-10 lg:grid-cols-[1.05fr_.95fr]">
        {/* LEFT — brand panel (sem dados) */}
        <section className="relative hidden overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-10 lg:flex lg:flex-col lg:justify-center">
          <Corner className="left-3 top-3" pos="tl" />
          <Corner className="right-3 top-3" pos="tr" />
          <Corner className="left-3 bottom-3" pos="bl" />
          <Corner className="right-3 bottom-3" pos="br" />

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
            <Radar className="h-3 w-3" /> Portal de acesso
          </div>

          <h2 className="mt-6 max-w-md font-display text-4xl font-bold leading-[1.05] tracking-tight">
            Sua marca sob{" "}
            <span className="italic text-cyan-300" style={{ fontFamily: "'Fraunces', serif" }}>
              vigilância contínua
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm text-white/60">
            Autentique-se para acessar seu cockpit de proteção.
          </p>

          {/* Radar visual (sem blips nem rótulos) */}
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
          </div>
        </section>


        {/* RIGHT — form */}
        <section className="flex items-center">
          <div className="relative w-full">
            {/* glow behind card */}
            <div aria-hidden className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-cyan-400/30 via-transparent to-emerald-400/20 opacity-60 blur-2xl" />
            <div className="relative rounded-[26px] border border-white/10 bg-[#0a121e]/80 p-8 backdrop-blur-2xl shadow-[0_20px_80px_-20px_rgba(34,211,238,0.25)] sm:p-10">
              {/* corner accents */}
              <Corner className="left-2 top-2" pos="tl" small />
              <Corner className="right-2 top-2" pos="tr" small />
              <Corner className="left-2 bottom-2" pos="bl" small />
              <Corner className="right-2 bottom-2" pos="br" small />

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300">
                <Command className="h-3 w-3" /> Portal Cliente
              </div>

              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-[42px]">
                Bem-vinda{" "}
                <span className="italic text-cyan-300" style={{ fontFamily: "'Fraunces', serif" }}>
                  de volta
                </span>
              </h1>
              <p className="mt-2.5 text-sm text-white/60">
                Autentique-se para acessar o cockpit de proteção da sua marca.
              </p>

              {/* SSO */}
              <div className="mt-7 grid grid-cols-2 gap-3">
                <SsoButton icon={<GoogleIcon />} label="Google" />
                <SsoButton icon={<Fingerprint className="h-4 w-4" />} label="Gov.br" />
              </div>

              <div className="my-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-white/30">
                <div className="h-px flex-1 bg-white/10" /> ou credenciais <div className="h-px flex-1 bg-white/10" />
              </div>

              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  await new Promise((resolve) => setTimeout(resolve, 1400));
                  setIsLoading(false);
                  toast.success("Login realizado com sucesso", {
                    description: "Redirecionando para o dashboard...",
                  });
                  setTimeout(() => navigate({ to: "/dashboard" }), 800);
                }}
              >
                <FieldLabel label="E-mail corporativo" hint="verificado por SPF/DKIM" />
                <InputShell icon={<Mail className="h-4 w-4" />}>
                  <input
                    required
                    type="email"
                    placeholder="voce@empresa.com.br"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
                  />
                </InputShell>

                <div className="flex items-center justify-between pt-1">
                  <FieldLabel label="Chave de acesso" />
                  <a href="#" className="font-mono text-[10px] uppercase tracking-widest text-cyan-400/80 hover:text-cyan-300">
                    Esqueci minha senha
                  </a>
                </div>
                <InputShell icon={<Lock className="h-4 w-4" />}>
                  <input
                    required
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••••••"
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="text-white/40 transition hover:text-white"
                    aria-label="Mostrar senha"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </InputShell>

                <label className="flex items-center gap-2 pt-1 text-sm text-white/60">
                  <input type="checkbox" defaultChecked className="h-4 w-4 rounded accent-cyan-400" />
                  Manter sessão segura por 30 dias
                </label>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-4 text-sm font-bold uppercase tracking-widest text-[#050b14] shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Autenticando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Iniciar sessão
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                  {!isLoading && (
                    <span
                      aria-hidden
                      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                    />
                  )}
                </button>
              </form>

              {/* Footer inside card */}
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5 font-mono text-[10px] uppercase tracking-widest text-white/30">
                <span>TLS 1.3 · AES-256</span>
                <span>LGPD · ISO 27001</span>
              </div>

              <div className="mt-4 text-center text-sm text-white/50">
                Ainda não tem conta?{" "}
                <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
                  Criar acesso gratuito →
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .h-13 { height: 3.25rem; }
      `}</style>
    </div>
  );
}


function Corner({ className = "", pos, small = false }: { className?: string; pos: "tl" | "tr" | "bl" | "br"; small?: boolean }) {
  const s = small ? "h-3 w-3" : "h-4 w-4";
  const map: Record<string, string> = {
    tl: "border-l border-t rounded-tl",
    tr: "border-r border-t rounded-tr",
    bl: "border-l border-b rounded-bl",
    br: "border-r border-b rounded-br",
  };
  return <div aria-hidden className={`absolute ${s} border-cyan-400/40 ${map[pos]} ${className}`} />;
}

function SsoButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/10"
    >
      {icon} {label}
    </button>
  );
}

function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">{label}</label>
      {hint && <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">{hint}</span>}
    </div>
  );
}

function InputShell({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#050b14]/60 px-3.5 transition focus-within:border-cyan-400/60 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]">
      <span className="text-white/40">{icon}</span>
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}
