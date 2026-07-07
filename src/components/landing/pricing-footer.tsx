import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

const plans = [
  {
    name: "Starter",
    price: "R$ 99",
    period: "/mês",
    description: "Monitoramento essencial para pequenas marcas.",
    features: [
      "1 marca monitorada",
      "Monitoramento básico (Google + Domínios)",
      "10 alertas / mês",
      "Relatório mensal",
    ],
    cta: "Começar",
  },
  {
    name: "Business",
    price: "R$ 299",
    period: "/mês",
    description: "IA, alertas em tempo real e redes sociais.",
    features: [
      "5 marcas monitoradas",
      "Redes sociais + Google Ads",
      "Alertas ilimitados em tempo real",
      "Brand AI Assistant",
      "Relatórios semanais",
    ],
    cta: "Testar 14 dias grátis",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "R$ 999",
    period: "/mês",
    description: "Proteção completa com suporte jurídico.",
    features: [
      "Marcas ilimitadas",
      "Marketplaces + Trademark Center",
      "Documentos jurídicos automatizados",
      "Take-down assistido",
      "Suporte dedicado + SLA",
    ],
    cta: "Falar com vendas",
  },
];

export function Pricing() {
  return (
    <section id="precos" className="scroll-mt-24 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="text-xs font-mono uppercase tracking-widest text-primary">Preços</div>
          <h2 className="mt-3 font-display text-3xl font-bold md:text-5xl">
            Um plano para cada estágio da sua marca
          </h2>
          <p className="mt-3 text-muted-foreground">
            Sem taxas escondidas. Cancele a qualquer momento.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-3xl p-8 ${
                p.highlight
                  ? "glass-strong ring-gradient glow-primary"
                  : "glass ring-gradient"
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[image:var(--gradient-primary)] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  Mais popular
                </div>
              )}
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span className="font-display text-lg font-semibold">{p.name}</span>
              </div>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold">{p.price}</span>
                <span className="text-muted-foreground">{p.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                asChild
                className={`mt-8 w-full ${
                  p.highlight
                    ? "bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90"
                    : ""
                }`}
                variant={p.highlight ? "default" : "outline"}
              >
                <Link to="/dashboard">{p.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl glass-strong ring-gradient p-10 text-center md:p-16">
          <div className="absolute inset-0 grid-bg" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold md:text-5xl">
              Sua marca está sendo usada agora mesmo.
              <span className="text-gradient"> Descubra onde.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
              Escaneamos em 90 segundos e mostramos onde sua marca está exposta.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90" asChild>
                <a href="#scan">Analisar minha marca grátis</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard">Ver dashboard demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 py-12">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)]">
              <Shield className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold">BrandShield AI</div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Brand Intelligence
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Proteção e inteligência de marca com IA. Monitoramento 24/7 em todas as superfícies
            digitais.
          </p>
        </div>
        <FooterCol
          title="Produto"
          items={["Plataforma", "Brand Monitor", "Ads Guardian", "Trademark Center"]}
        />
        <FooterCol title="Empresa" items={["Sobre", "Clientes", "Segurança", "Contato"]} />
      </div>
      <div className="mx-auto mt-10 flex max-w-7xl flex-col items-center justify-between gap-3 border-t border-border/60 px-4 pt-6 text-xs text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} BrandShield AI · Todos os direitos reservados</span>
        <span className="font-mono">SOC2 · LGPD · ISO 27001</span>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i}>
            <a className="text-foreground/80 hover:text-foreground" href="#">
              {i}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
