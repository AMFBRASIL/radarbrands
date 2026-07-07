import { createFileRoute } from "@tanstack/react-router";
import { Panel, SimplePage } from "@/components/dashboard/simple";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

const nets = [
  { icon: Instagram, name: "Instagram", fake: 4, mentions: "12.4k", sent: 78 },
  { icon: Facebook, name: "Facebook", fake: 2, mentions: "3.2k", sent: 71 },
  { icon: Youtube, name: "YouTube", fake: 1, mentions: "980", sent: 82 },
  { icon: Linkedin, name: "LinkedIn", fake: 0, mentions: "1.1k", sent: 90 },
];

export const Route = createFileRoute("/dashboard/social")({
  component: SocialPage,
});

function SocialPage() {
  return (
    <SimplePage
      eyebrow="Social Media Protection"
      title="Redes sociais"
      description="Perfis falsos, menções, crises e sentimento em tempo real."
    >
      <div className="grid gap-4 md:grid-cols-4">
        {nets.map((n) => (
          <Panel key={n.name}>
            <n.icon className="h-5 w-5 text-primary" />
            <div className="mt-3 font-display text-2xl font-bold">{n.mentions}</div>
            <div className="text-xs text-muted-foreground">menções · {n.sent}% positivo</div>
            <div className="mt-3 text-xs text-destructive">{n.fake} perfis falsos</div>
          </Panel>
        ))}
      </div>
    </SimplePage>
  );
}
