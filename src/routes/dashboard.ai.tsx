import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Msg = { role: "user" | "ai"; text: string };

const initial: Msg[] = [
  {
    role: "ai",
    text:
      "Olá, Marina 👋 Sou o Brand AI Assistant. Analisei 24.982 fontes nas últimas 24h. Como posso ajudar?",
  },
];

const suggestions = [
  "Minha marca está protegida?",
  "Quais os riscos críticos de hoje?",
  "Gerar relatório executivo",
];

export const Route = createFileRoute("/dashboard/ai")({
  component: AIPage,
});

function AIPage() {
  const [messages, setMessages] = useState<Msg[]>(initial);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    const q = text.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }]);
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text:
            "Analisei 24.982 fontes. Sua marca está 92% protegida.\n\nEncontrei 3 riscos ativos:\n1. Domínio parecido registrado (cadbrasiI.com.br)\n2. Anúncio Google Ads utilizando seu nome\n3. Perfil falso no Instagram\n\nDeseja iniciar proteção automática nos 3?",
        },
      ]);
    }, 700);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-4xl flex-col">
      <div className="mb-4">
        <div className="text-xs font-mono uppercase tracking-widest text-primary">
          Brand Intelligence
        </div>
        <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-bold">
          <Bot className="h-7 w-7 text-primary" /> Brand AI Assistant
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto rounded-2xl glass ring-gradient p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" ? (
              <div className="max-w-[80%] whitespace-pre-line rounded-2xl bg-muted/40 px-4 py-3 text-sm">
                <div className="mb-1 flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-primary">
                  <Sparkles className="h-3 w-3" /> Radar | brand
                </div>
                {m.text}
              </div>
            ) : (
              <div className="max-w-[80%] rounded-2xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm text-primary-foreground">
                {m.text}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs hover:bg-muted"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-3 flex gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte à IA sobre sua marca…"
          className="h-11 border-border/60 bg-card/60"
        />
        <Button type="submit" size="lg" className="bg-[image:var(--gradient-primary)] text-primary-foreground hover:opacity-90">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
