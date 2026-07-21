import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Loader2, User, Building2 } from "lucide-react";
import { FrauncesItalic, RadarAuthLayout } from "@/components/auth/radar-auth-layout";
import {
  FieldLabel,
  InputShell,
  RadarSweepStyles,
} from "@/components/auth/radar-auth-primitives";
import { fetchCurrentAuth } from "@/lib/fetch-current-auth";
import { registerRequest } from "@/lib/auth-api";
import { DASHBOARD_HOME, redirectAfterAuth } from "@/lib/auth-redirect";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const auth = await fetchCurrentAuth();
    if (auth) {
      throw redirect({ to: DASHBOARD_HOME });
    }
  },
  head: () => ({
    meta: [
      { title: "Criar conta · Radar | brands" },
      { name: "description", content: "Crie sua conta no Radar | brands e proteja sua marca com monitoramento 24/7." },
      { property: "og:title", content: "Criar conta · Radar | brands" },
      { property: "og:description", content: "Cadastro no portal Radar | brands." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <>
      <RadarAuthLayout
        mode="register"
        heroEyebrow="Novo acesso"
        heroTitle={
          <>
            Comece a proteger sua <FrauncesItalic>marca agora</FrauncesItalic>
          </>
        }
        heroSubtitle="Crie sua conta em segundos e ative seu radar."
        formTitle={
          <>
            Ative seu <FrauncesItalic>radar</FrauncesItalic>
          </>
        }
        formSubtitle="Crie sua conta e comece a monitorar sua marca em anúncios, marketplaces e registros."
        dividerLabel="ou cadastre-se"
        footer={
          <>
            Já tem uma conta?{" "}
            <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Entrar agora →
            </Link>
          </>
        }
      >
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (password !== confirmPassword) {
              toast.error("As senhas não coincidem");
              return;
            }
            setIsLoading(true);
            try {
              await registerRequest({
                fullName,
                companyName: companyName || undefined,
                email,
                password,
                confirmPassword,
              });
              toast.success("Conta criada com sucesso", {
                description: "Redirecionando para o dashboard...",
              });
              await redirectAfterAuth(router);
            } catch (error) {
              toast.error("Falha ao criar conta", {
                description: error instanceof Error ? error.message : "Tente novamente",
              });
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <FieldLabel label="Nome completo" />
          <InputShell icon={<User className="h-4 w-4" />}>
            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
            />
          </InputShell>

          <FieldLabel label="Empresa" hint="opcional" />
          <InputShell icon={<Building2 className="h-4 w-4" />}>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nome da empresa"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
            />
          </InputShell>

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

          <FieldLabel label="Chave de acesso" />
          <InputShell icon={<Lock className="h-4 w-4" />}>
            <input
              required
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <FieldLabel label="Confirmar chave de acesso" />
          <InputShell icon={<Lock className="h-4 w-4" />}>
            <input
              required
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-white/40 transition hover:text-white"
              aria-label="Mostrar confirmação de senha"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </InputShell>

          <label className="flex items-start gap-2 pt-1 text-sm text-white/60">
            <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-cyan-400" />
            <span className="leading-relaxed">
              Aceito os <a href="#" className="text-cyan-300 hover:text-cyan-200">Termos de Uso</a> e a{" "}
              <a href="#" className="text-cyan-300 hover:text-cyan-200">Política de Privacidade</a>.
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-4 text-sm font-bold uppercase tracking-widest text-[#050b14] shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Criando conta...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Criar conta
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
