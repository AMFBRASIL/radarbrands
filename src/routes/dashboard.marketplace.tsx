import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";
import { ShoppingCart } from "lucide-react";

const mps = [
  { mp: "Amazon", items: 12, revoke: 5 },
  { mp: "Mercado Livre", items: 34, revoke: 18 },
  { mp: "Shopee", items: 21, revoke: 9 },
];

export const Route = createFileRoute("/dashboard/marketplace")({
  component: MarketplacePage,
});

function MarketplacePage() {
  return (
    <SimplePage
      eyebrow="Marketplace Monitor"
      title="Marketplaces"
      description="Produtos falsificados, revenda não autorizada e uso indevido."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {mps.map((m) => (
          <Panel key={m.mp}>
            <ShoppingCart className="h-5 w-5 text-primary" />
            <div className="mt-2 font-display text-lg font-semibold">{m.mp}</div>
            <div className="mt-3 font-display text-3xl font-bold">{m.items}</div>
            <div className="text-xs text-muted-foreground">itens suspeitos</div>
            <div className="mt-3 text-xs text-destructive">
              {m.revoke} prontos para take-down
            </div>
          </Panel>
        ))}
      </div>
    </SimplePage>
  );
}
