import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CreditCard, Lock, Check, ArrowLeft, Sparkles, QrCode, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/pagamento")({
  head: () => ({
    meta: [
      { title: "Pagamento · Radar | brands" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PagamentoPage,
});

type Summary = {
  brands: { name: string; segment: string }[];
  modules: { id: string; name: string; price: number }[];
  perBrand: number;
  brandCount: number;
  total: number;
};

type Method = "card" | "pix" | "boleto";

function PagamentoPage() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [method, setMethod] = useState<Method>("card");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("rb.onboarding");
      if (raw) setSummary(JSON.parse(raw));
    } catch {}
  }, []);

  function pay(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      toast.success("Pagamento aprovado!", { description: "Sua conta está ativa." });
      setTimeout(() => navigate({ to: "/dashboard" }), 1500);
    }, 1600);
  }

  const total = summary?.total ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard/onboarding" className="rounded-lg border border-border/60 p-2 hover:bg-muted">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary">
            <Lock className="h-3.5 w-3.5" /> Pagamento seguro
          </div>
          <h1 className="mt-1 font-display text-3xl font-bold">Primeira mensalidade</h1>
          <p className="text-sm text-muted-foreground">
            Ative sua conta e comece a proteger suas marcas agora.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Payment form */}
        <div className="space-y-6">
          <section className="glass-strong rounded-2xl p-6">
            <h2 className="font-display text-xl font-semibold">Forma de pagamento</h2>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {([
                { id: "card", label: "Cartão", icon: CreditCard },
                { id: "pix", label: "PIX", icon: QrCode },
                { id: "boleto", label: "Boleto", icon: FileText },
              ] as const).map((m) => {
                const Icon = m.icon;
                const on = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm transition ${
                      on ? "border-primary/50 bg-primary/5" : "border-border/60 bg-card/40 hover:bg-card/70"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${on ? "text-primary" : "text-muted-foreground"}`} />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <form onSubmit={pay} className="mt-6 space-y-4">
              {method === "card" && (
                <>
                  <div>
                    <Label>Nome no cartão</Label>
                    <Input required placeholder="Como está no cartão" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Número do cartão</Label>
                    <Input required placeholder="0000 0000 0000 0000" inputMode="numeric" maxLength={19} className="mt-1.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Validade</Label>
                      <Input required placeholder="MM/AA" maxLength={5} className="mt-1.5" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input required placeholder="123" maxLength={4} className="mt-1.5" />
                    </div>
                  </div>
                </>
              )}

              {method === "pix" && (
                <div className="rounded-xl border border-border/60 bg-card/40 p-6 text-center">
                  <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl bg-muted">
                    <QrCode className="h-20 w-20 text-muted-foreground" />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Escaneie o QR Code no app do seu banco. A ativação ocorre em segundos após o pagamento.
                  </p>
                </div>
              )}

              {method === "boleto" && (
                <div className="rounded-xl border border-border/60 bg-card/40 p-5 text-sm">
                  <p>Um boleto será gerado no seu e-mail. A ativação ocorre em até 2 dias úteis após a compensação.</p>
                  <div className="mt-3">
                    <Label>CPF/CNPJ do pagador</Label>
                    <Input required placeholder="000.000.000-00" className="mt-1.5" />
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={processing || done}>
                {done ? (
                  <><Check className="mr-2 h-4 w-4" /> Pagamento aprovado</>
                ) : processing ? (
                  "Processando..."
                ) : (
                  <>Pagar R$ {total.toLocaleString("pt-BR")}</>
                )}
              </Button>

              <p className="text-center text-[11px] text-muted-foreground">
                <Lock className="mr-1 inline h-3 w-3" />
                Pagamento processado com criptografia de ponta a ponta.
              </p>
            </form>
          </section>
        </div>

        {/* Summary */}
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <div className="glass-strong rounded-2xl p-6 ring-gradient">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="font-mono text-xs uppercase tracking-widest text-primary">Resumo</span>
            </div>

            {summary ? (
              <>
                <div className="mt-4">
                  <div className="text-xs text-muted-foreground">Total mensal</div>
                  <div className="font-display text-4xl font-bold tracking-tight">
                    R$ {summary.total.toLocaleString("pt-BR")}
                    <span className="text-base font-normal text-muted-foreground">/mês</span>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    R$ {summary.perBrand.toLocaleString("pt-BR")} × {summary.brandCount} marca{summary.brandCount > 1 ? "s" : ""}
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Marcas</div>
                  {summary.brands.map((b, i) => (
                    <div key={i} className="rounded-lg border border-border/60 bg-card/40 px-3 py-2 text-sm">
                      {b.name || `Marca ${i + 1}`}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Módulos ({summary.modules.length})
                  </div>
                  <div className="max-h-40 space-y-1 overflow-y-auto">
                    {summary.modules.map((m) => (
                      <div key={m.id} className="flex items-center justify-between text-xs">
                        <span className="truncate text-muted-foreground">{m.name}</span>
                        <span className="font-mono">R$ {m.price.toLocaleString("pt-BR")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Badge className="mt-5 w-full justify-center bg-primary/10 text-primary hover:bg-primary/15">
                  Ativação em até 24h
                </Badge>
              </>
            ) : (
              <div className="mt-4 rounded-lg border border-border/60 bg-card/40 p-4 text-sm text-muted-foreground">
                Nenhum resumo encontrado.{" "}
                <Link to="/dashboard/onboarding" className="text-primary underline">
                  Voltar ao onboarding
                </Link>
                .
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
