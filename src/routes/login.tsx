import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { FrauncesItalic, RadarAuthLayout } from "@/components/auth/radar-auth-layout";
import {
  FieldLabel,
  InputShell,
  RadarSweepStyles,
} from "@/components/auth/radar-auth-primitives";
import { fetchCurrentAuth } from "@/lib/fetch-current-auth";
import { loginRequest } from "@/lib/auth-api";
import { DASHBOARD_HOME, redirectAfterAuth } from "@/lib/auth-redirect";

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const auth = await fetchCurrentAuth();
    if (auth) {
      throw redirect({ to: DASHBOARD_HOME });
    }
  },
  head: () => ({
    meta: [
      { title: "Entrar · Radar | brands" },
      { name: "description", content: "Acesse o painel do Radar | brands e proteja sua marca em tempo real." },
      { property: "og:title", content: "Entrar · Radar | brands" },
      { property: "og:description", content: "Portal do cliente Radar | brands." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  return (
    <>
      <RadarAuthLayout
        mode="login"
        heroEyebrow="Portal de acesso"
        heroTitle={
          <>
            Sua marca sob <FrauncesItalic>vigilância contínua</FrauncesItalic>
          </>
        }
        heroSubtitle="Autentique-se para acessar seu cockpit de proteção."
        showBrandBlips
        formTitle={
          <>
            Bem-vinda <FrauncesItalic>de volta</FrauncesItalic>
          </>
        }
        formSubtitle="Autentique-se para acessar o cockpit de proteção da sua marca."
        dividerLabel="ou credenciais"
        footer={
          <>
            Ainda não tem conta?{" "}
            <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Criar acesso gratuito →
            </Link>
          </>
        }
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            try {
              await loginRequest({ email, password, rememberMe });
              toast.success("Login realizado com sucesso", {
                description: "Redirecionando para o dashboard...",
              });
              await redirectAfterAuth(router);
            } catch (error) {
              toast.error("Falha no login", {
                description: error instanceof Error ? error.message : "Tente novamente",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <FieldLabel label="E-mail corporativo" hint="verificado por SPF/DKIM" />
          <InputShell icon={<Mail className="h-4 w-4" />}>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              minLength={8}
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
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded accent-cyan-400"
            />
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
      </RadarAuthLayout>
      <RadarSweepStyles />
    </>
  );
}
