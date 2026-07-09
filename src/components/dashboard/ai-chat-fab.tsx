import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, Minimize2 } from "lucide-react";

type Msg = { role: "user" | "ai"; text: string };

const suggestions = [
  "Quantos alertas críticos essa semana?",
  "Gere um resumo executivo pro CEO",
  "Quais domínios mais suspeitos agora?",
  "Como está meu Brand Health Score?",
];

const canned: Record<string, string> = {
  default:
    "Analisei os dados da sua conta. Você tem **3 alertas críticos** ativos, seu Brand Health Score está em **87/100** (tendência positiva) e nas últimas 24h bloqueamos 12 ameaças. Quer que eu detalhe algum ponto?",
  alerta:
    "Nos últimos 7 dias registrei **12 alertas** — 3 críticos, 5 médios e 4 baixos. O crítico mais recente: domínio `cadbrasiI.com.br` (typosquatting). Já preparei o takedown, aguardando seu OK.",
  resumo:
    "**Resumo executivo — semana:**\n\n- Score protetivo: 87/100 (+3)\n- Ameaças bloqueadas: 47\n- Receita protegida estimada: R$ 128.400\n- 1 crise mitigada em <15 min\n\nQuer que eu exporte em PDF?",
  domínio:
    "Top 3 domínios suspeitos monitorados agora:\n\n1. **cadbrasiI.com.br** — typosquatting (I maiúsculo no lugar de l)\n2. **cad-brasil.net** — clone de layout\n3. **cadbrasil-oficial.com** — usando marca sem autorização\n\nPosso disparar takedown nos 3?",
  score:
    "Seu **Brand Health Score = 87/100** — status Saudável ✅. Subiu 3 pontos em 30 dias. O canal mais fraco é **Ads (78)** — recomendo ativar o Autopilot pra bloqueio automático de brand bidding.",
};

function reply(input: string): string {
  const t = input.toLowerCase();
  if (t.includes("alerta")) return canned.alerta;
  if (t.includes("resumo") || t.includes("ceo") || t.includes("executivo")) return canned.resumo;
  if (t.includes("domínio") || t.includes("dominio")) return canned.domínio;
  if (t.includes("score") || t.includes("saúde") || t.includes("health")) return canned.score;
  return canned.default;
}

export function AiChatFab() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Oi, sou a **Radar AI**. Posso responder sobre alertas, marcas, score e gerar relatórios. Como posso ajudar?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMsgs((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "ai", text: reply(t) }]);
      setTyping(false);
    }, 900);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir Radar AI"
          className="group fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[image:var(--gradient-primary)] px-4 py-3 text-primary-foreground shadow-2xl transition hover:scale-105"
        >
          <span className="relative flex h-6 w-6 items-center justify-center">
            <Sparkles className="h-5 w-5" />
            <span className="absolute inset-0 animate-ping rounded-full bg-primary-foreground/30" />
          </span>
          <span className="hidden text-sm font-semibold group-hover:inline sm:inline">Radar AI</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border/60 bg-[image:var(--gradient-primary)]/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-primary)]">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold">Radar AI</div>
                <div className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> online · contextual
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setOpen(false)} className="rounded p-1.5 hover:bg-muted" aria-label="Minimizar">
                <Minimize2 className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="rounded p-1.5 hover:bg-muted" aria-label="Fechar">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: m.text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"),
                  }}
                />
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-muted px-3 py-2.5">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {msgs.length <= 1 && (
            <div className="border-t border-border/60 px-3 py-2">
              <div className="mb-1.5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                Sugestões
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] hover:bg-muted"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 bg-background/60 p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte à Radar AI…"
              className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-40"
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
