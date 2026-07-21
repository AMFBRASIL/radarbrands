import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, Mail, Sparkles } from "lucide-react";
import { FrauncesItalic, RadarAuthLayout } from "@/components/auth/radar-auth-layout";
import {
  FieldLabel,
  InputShell,
  RadarSweepStyles,
} from "@/components/auth/radar-auth-primitives";
import { acceptInviteRequest, previewInviteRequest } from "@/lib/auth-api";
import { DASHBOARD_HOME, redirectAfterAuth } from "@/lib/auth-redirect";
import { fetchCurrentAuth } from "@/lib/fetch-current-auth";

export const Route = createFileRoute("/accept-invite")({
  validateSearch: (search: Record<string, unknown>): { token?: string } => {
    const token = typeof search.token === "string" ? search.token : undefined;
    return token ? { token } : {};
  },
  beforeLoad: async () => {
    const auth = await fetchCurrentAuth();
    if (auth) {
      throw redirect({ to: DASHBOARD_HOME });
    }
  },
  head: () => ({
    meta: [
      { title: "Aceitar convite · Radar | brands" },
      {
        name: "description",
        content: "Defina sua senha e acesse o Radar | brands com o convite recebido.",
      },
    ],
  }),
  component: AcceptInvitePage,
});

function AcceptInvitePage() {
  const router = useRouter();
  const { token = "" } = Route.useSearch();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadPreview() {
      if (!token) {
        setPreviewError("Link de convite inválido. Solicite um novo convite.");
        setLoadingPreview(false);
        return;
      }

      setLoadingPreview(true);
      setPreviewError(null);
      try {
        const preview = await previewInviteRequest(token);
        if (cancelled) return;
        setEmail(preview.email);
        setFullName(preview.fullName);
        setOrganizationName(preview.organizationName);
      } catch (error) {
        if (cancelled) return;
        setPreviewError(
          error instanceof Error ? error.message : "Convite inválido ou expirado",
        );
      } finally {
        if (!cancelled) setLoadingPreview(false);
      }
    }

    void loadPreview();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <RadarAuthLayout
        mode="register"
        heroEyebrow="Convite"
        heroTitle={
          <>
            Crie sua senha e <FrauncesItalic>entre no Radar</FrauncesItalic>
          </>
        }
        heroSubtitle={
          organizationName
            ? `Você foi convidado para ${organizationName}. Defina uma senha para acessar o painel.`
            : "Use o link do e-mail de convite para definir sua senha e acessar o painel."
        }
        formTitle={
          <>
            Definir <FrauncesItalic>senha</FrauncesItalic>
          </>
        }
        formSubtitle={
          fullName
            ? `Olá, ${fullName}. Escolha uma senha segura para entrar.`
            : "Escolha uma senha segura para ativar seu acesso."
        }
        dividerLabel="acesso por convite"
        footer={
          <>
            Já tem senha?{" "}
            <Link to="/login" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Entrar →
            </Link>
          </>
        }
      >
        {loadingPreview ? (
          <div className="flex items-center gap-2 py-8 text-sm text-white/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            Validando convite...
          </div>
        ) : previewError ? (
          <div className="space-y-4 py-4">
            <p className="text-sm text-rose-300">{previewError}</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200"
            >
              Ir para o login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (password !== confirmPassword) {
                toast.error("As senhas não coincidem");
                return;
              }
              if (password.length < 8) {
                toast.error("A senha deve ter pelo menos 8 caracteres");
                return;
              }

              setIsLoading(true);
              try {
                await acceptInviteRequest({ token, password, confirmPassword });
                toast.success("Senha definida com sucesso", {
                  description: "Redirecionando para o dashboard...",
                });
                await redirectAfterAuth(router);
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Falha ao aceitar convite");
              } finally {
                setIsLoading(false);
              }
            }}
          >
            <FieldLabel label="E-mail do convite" />
            <InputShell icon={<Mail className="h-4 w-4" />}>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full bg-transparent py-3 text-sm text-white/70 outline-none"
              />
            </InputShell>

            <FieldLabel label="Nova senha" hint="mín. 8 caracteres" />
            <InputShell icon={<Lock className="h-4 w-4" />}>
              <input
                required
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
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

            <FieldLabel label="Confirmar senha" />
            <InputShell icon={<Lock className="h-4 w-4" />}>
              <input
                required
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="new-password"
                minLength={8}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/25"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="text-white/40 transition hover:text-white"
                aria-label="Mostrar confirmação"
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </InputShell>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative mt-2 flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 py-4 text-sm font-bold uppercase tracking-widest text-[#050b14] shadow-[0_10px_40px_-10px_rgba(34,211,238,0.6)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Ativando...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Criar senha e entrar
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </form>
        )}
      </RadarAuthLayout>
      <RadarSweepStyles />
    </>
  );
}
