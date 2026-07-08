import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Building2, Eye, EyeOff, Fingerprint } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/register")({
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
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);

  return (
    <AuthLayout
      side="register"
      eyebrow="Criar acesso"
      title={
        <>
          Sua marca no <em className="font-serif italic text-primary">Radar</em>
        </>
      }
      subtitle="Ative o monitoramento 24/7 e receba alertas críticos antes que a concorrência se antecipe."
      bullets={[
        "Onboarding jurídico em 24 horas",
        "Integração INPI, Google Ads e Meta Ads",
        "SLA de resposta em 12 minutos",
      ]}
      footer={
        <>
          Já possui conta?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Entrar no painel
          </Link>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        <button className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ring-gradient transition hover:-translate-y-0.5">
          <GoogleIcon /> Google
        </button>
        <button className="glass flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium ring-gradient transition hover:-translate-y-0.5">
          <Fingerprint className="h-4 w-4" /> Gov.br
        </button>
      </div>

      <div className="my-6 flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        <div className="h-px flex-1 bg-border" /> ou com e-mail <div className="h-px flex-1 bg-border" />
      </div>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          navigate({ to: "/dashboard" });
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <Field label="Nome completo" icon={<User className="h-4 w-4 text-muted-foreground" />}>
            <input required placeholder="Ana Souza" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
          </Field>
          <Field label="Empresa" icon={<Building2 className="h-4 w-4 text-muted-foreground" />}>
            <input required placeholder="Sua empresa" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
          </Field>
        </div>

        <Field label="E-mail corporativo" icon={<Mail className="h-4 w-4 text-muted-foreground" />}>
          <input required type="email" placeholder="voce@empresa.com.br" className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" />
        </Field>

        <Field label="Senha" icon={<Lock className="h-4 w-4 text-muted-foreground" />}>
          <input
            required
            type={showPass ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button type="button" onClick={() => setShowPass((v) => !v)} className="text-muted-foreground hover:text-foreground">
            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </Field>

        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded accent-primary" />
          Li e concordo com os <a className="text-primary hover:underline" href="#">Termos</a> e a{" "}
          <a className="text-primary hover:underline" href="#">Política de Privacidade</a>.
        </label>

        <Button type="submit" className="h-12 w-full rounded-xl text-base font-semibold">
          Criar minha conta →
        </Button>
      </form>
    </AuthLayout>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <div className="glass flex items-center gap-2 rounded-xl px-3 ring-gradient focus-within:ring-2 focus-within:ring-primary">
        {icon}
        {children}
      </div>
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
