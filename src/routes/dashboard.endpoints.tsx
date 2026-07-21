import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SimplePage } from "@/components/dashboard/simple";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  applyEndpointsPreset,
  bulkEndpoints,
  createEndpoint,
  fetchEndpoints,
  setEndpointsMaster,
  testEndpoint,
  updateEndpoint,
  type EndpointItem,
} from "@/lib/endpoints-api";
import { EndpointsLogsModal } from "@/components/dashboard/endpoints-logs-modal";
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Database,
  Filter,
  Globe,
  Heart,
  KeyRound,
  Layers,
  Loader2,
  Newspaper,
  Play,
  Plus,
  Power,
  Radar,
  RefreshCcw,
  ScrollText,
  Search,
  ShieldAlert,
  ShoppingBag,
  Signal,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
  Video,
  Wand2,
  Wifi,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/endpoints")({
  component: EndpointsPage,
});

type Health = "healthy" | "degraded" | "down" | "paused";
type Category =
  | "search"
  | "social"
  | "marketplace"
  | "appstore"
  | "darkweb"
  | "domain"
  | "news"
  | "review"
  | "video"
  | "messaging"
  | "ai";

type Endpoint = EndpointItem;

const CATS: { id: Category; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { id: "search", label: "Buscadores", icon: Search, color: "from-cyan-500/25 to-blue-500/10" },
  { id: "social", label: "Redes Sociais", icon: Heart, color: "from-fuchsia-500/25 to-pink-500/10" },
  { id: "marketplace", label: "Marketplaces", icon: ShoppingBag, color: "from-amber-500/25 to-orange-500/10" },
  { id: "appstore", label: "Lojas de Apps", icon: Smartphone, color: "from-emerald-500/25 to-teal-500/10" },
  { id: "darkweb", label: "Dark Web", icon: ShieldAlert, color: "from-red-500/25 to-rose-500/10" },
  { id: "domain", label: "Domínios & DNS", icon: Globe, color: "from-indigo-500/25 to-violet-500/10" },
  { id: "news", label: "Notícias & Mídia", icon: Newspaper, color: "from-slate-500/25 to-slate-700/10" },
  { id: "review", label: "Reviews & Reclamações", icon: Store, color: "from-yellow-500/25 to-amber-500/10" },
  { id: "video", label: "Vídeo & Streaming", icon: Video, color: "from-purple-500/25 to-fuchsia-500/10" },
  { id: "messaging", label: "Mensageria & Grupos", icon: Signal, color: "from-lime-500/25 to-green-500/10" },
  { id: "ai", label: "IA & LLMs", icon: Bot, color: "from-rose-500/25 to-red-500/10" },
];

function endpointCode(e: Endpoint): string {
  return e.code ?? e.id;
}

function EndpointsPage() {
  const [items, setItems] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Category | "all">("all");
  const [onlyOn, setOnlyOn] = useState(false);
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [globalOn, setGlobalOn] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [logsOpen, setLogsOpen] = useState(false);
  const [configItem, setConfigItem] = useState<Endpoint | null>(null);

  const loadEndpoints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEndpoints();
      setItems(data.endpoints);
      setGlobalOn(data.masterEnabled);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar endpoints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEndpoints();
  }, [loadEndpoints]);

  const filtered = useMemo(() => {
    return items.filter((e) => {
      if (tab !== "all" && e.category !== tab) return false;
      if (onlyOn && !e.enabled) return false;
      if (onlyProblems && !(e.health === "degraded" || e.health === "down" || (e.requiresKey && !e.keySet))) return false;
      if (q && !(`${e.name} ${e.desc}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [items, q, tab, onlyOn, onlyProblems]);

  const stats = useMemo(() => {
    const on = items.filter((i) => i.enabled).length;
    const degraded = items.filter((i) => i.health === "degraded" || i.health === "down").length;
    const missingKey = items.filter((i) => i.requiresKey && !i.keySet).length;
    const hits = items.reduce((s, i) => s + (i.enabled ? i.hits24h : 0), 0);
    const cost = items.reduce((s, i) => s + (i.enabled ? (i.hits24h / 1000) * i.costPer1k : 0), 0);
    return { total: items.length, on, degraded, missingKey, hits, cost };
  }, [items]);

  const patchItem = (updated: Endpoint) => {
    const code = endpointCode(updated);
    setItems((prev) => prev.map((e) => (endpointCode(e) === code ? updated : e)));
    setConfigItem((prev) => (prev && endpointCode(prev) === code ? updated : prev));
  };

  const toggle = async (code: string) => {
    const item = items.find((e) => endpointCode(e) === code);
    if (!item) return;
    try {
      const updated = await updateEndpoint(code, { enabled: !item.enabled });
      patchItem(updated);
      toast.success(updated.enabled ? "Endpoint ativado" : "Endpoint desativado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao alterar endpoint");
    }
  };

  const handleMasterSwitch = async (enabled: boolean) => {
    const prev = globalOn;
    setGlobalOn(enabled);
    try {
      await setEndpointsMaster(enabled);
      await loadEndpoints();
      toast.success(enabled ? "Captura global ativada" : "Captura global suspensa");
    } catch (error) {
      setGlobalOn(prev);
      toast.error(error instanceof Error ? error.message : "Falha ao alterar master switch");
    }
  };

  const bulk = async (cat: Category | "all", value: boolean) => {
    try {
      const { count } = await bulkEndpoints(cat, value);
      await loadEndpoints();
      toast.success(`${count} endpoint${count === 1 ? "" : "s"} ${value ? "ativado" : "desativado"}${count === 1 ? "" : "s"}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha na ação em massa");
    }
  };

  const applyPreset = async (preset: "max" | "balanced" | "eco") => {
    try {
      const result = await applyEndpointsPreset(preset);
      setItems(result.endpoints);
      setGlobalOn(result.masterEnabled);
      const labels = { max: "Máxima cobertura", balanced: "Balanceado", eco: "Econômico" };
      toast.success(`Preset "${labels[preset]}" aplicado (${result.count} endpoints)`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao aplicar preset");
    }
  };

  const handleConfigSave = async (patch: {
    frequencyMin: number;
    priority: 1 | 2 | 3;
    concurrency: number;
    region: string;
    apiKey?: string;
  }) => {
    if (!configItem) return;
    const code = endpointCode(configItem);
    try {
      const updated = await updateEndpoint(code, {
        frequencyMin: patch.frequencyMin,
        priority: patch.priority,
        concurrency: patch.concurrency,
        region: patch.region,
        ...(patch.apiKey ? { apiKey: patch.apiKey } : {}),
      });
      patchItem(updated);
      toast.success("Configurações salvas");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar configurações");
      throw error;
    }
  };

  const handleConfigTest = async () => {
    if (!configItem) return;
    const code = endpointCode(configItem);
    try {
      const { result, endpoint } = await testEndpoint(code);
      if (endpoint) patchItem(endpoint);
      if (result.ok) {
        toast.success(`Teste OK${result.latencyMs != null ? ` — ${result.latencyMs} ms` : ""}`);
      } else {
        toast.error(result.error ?? "Teste falhou");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao testar endpoint");
    }
  };

  const handleAddEndpoint = async (data: {
    name: string;
    baseUrl: string;
    category: Category;
    frequencyMin: number;
    requiresKey: boolean;
  }) => {
    try {
      const created = await createEndpoint(data);
      setItems((prev) => [...prev, created]);
      toast.success("Endpoint adicionado");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao adicionar endpoint");
      throw error;
    }
  };

  if (loading) {
    return (
      <SimplePage
        eyebrow="Configurações · Coração da plataforma"
        title="Endpoints de Busca"
        description="Ligue, desligue e calibre cada fonte de dados que o Radar | brands vasculha. Cada endpoint aqui é um sensor da sua marca no mundo."
      >
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border/60 bg-card/40">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="text-sm">Carregando endpoints…</span>
          </div>
        </div>
      </SimplePage>
    );
  }

  return (
    <SimplePage
      eyebrow="Configurações · Coração da plataforma"
      title="Endpoints de Busca"
      description="Ligue, desligue e calibre cada fonte de dados que o Radar | brands vasculha. Cada endpoint aqui é um sensor da sua marca no mundo."
    >
      {/* Master control */}
      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-border/60 bg-card/60 p-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${globalOn ? "bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]" : "bg-muted text-muted-foreground"}`}>
          <Radar className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="font-display text-lg font-semibold">Master switch</div>
            <Badge variant={globalOn ? "default" : "secondary"} className="text-[10px]">{globalOn ? "OPERANDO" : "SUSPENSO"}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">Corte ou libere toda a captura da plataforma em uma tecla — kill-switch global.</p>
        </div>
        <Switch checked={globalOn} onCheckedChange={(v) => void handleMasterSwitch(v)} />
      </div>

      {/* KPI cards */}
      <div className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon={Wifi} label="Endpoints ativos" value={`${stats.on}/${stats.total}`} sub={`${Math.round((stats.on / Math.max(stats.total, 1)) * 100)}% da malha operando`} tone="cyan" />
        <Stat icon={AlertTriangle} label="Com problema" value={`${stats.degraded}`} sub={stats.degraded > 0 ? "Requer atenção" : "Tudo estável"} tone={stats.degraded > 0 ? "amber" : "cyan"} />
        <Stat icon={KeyRound} label="Chave pendente" value={`${stats.missingKey}`} sub={stats.missingKey > 0 ? "Configurar credenciais" : "Sem pendências"} tone={stats.missingKey > 0 ? "red" : "cyan"} />
        <Stat icon={Activity} label="Coletas 24h" value={stats.hits.toLocaleString("pt-BR")} sub={`≈ R$ ${stats.cost.toFixed(2).replace(".", ",")}/dia`} tone="green" />
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar endpoint, ex: Instagram, urlscan, dark web…" className="pl-9" />
        </div>
        <Button variant={onlyOn ? "default" : "outline"} size="sm" onClick={() => setOnlyOn((v) => !v)}>
          <Power className="mr-1.5 h-3.5 w-3.5" /> Só ativos
        </Button>
        <Button variant={onlyProblems ? "default" : "outline"} size="sm" onClick={() => setOnlyProblems((v) => !v)}>
          <AlertTriangle className="mr-1.5 h-3.5 w-3.5" /> Só problemas
        </Button>
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <Button variant="outline" size="sm" onClick={() => void applyPreset("eco")}>
          <Zap className="mr-1.5 h-3.5 w-3.5" /> Econômico
        </Button>
        <Button variant="outline" size="sm" onClick={() => void applyPreset("balanced")}>
          <Wand2 className="mr-1.5 h-3.5 w-3.5" /> Balanceado
        </Button>
        <Button variant="outline" size="sm" onClick={() => void applyPreset("max")}>
          <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Máxima cobertura
        </Button>
        <Button variant="outline" size="sm" onClick={() => setLogsOpen(true)}>
          <ScrollText className="mr-1.5 h-3.5 w-3.5" /> Logs
        </Button>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Adicionar endpoint
        </Button>
      </div>

      {/* Category tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as Category | "all")} className="mb-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Layers className="mr-1.5 h-3.5 w-3.5" /> Todos <span className="ml-1 text-xs opacity-70">({items.length})</span>
          </TabsTrigger>
          {CATS.map((c) => {
            const count = items.filter((i) => i.category === c.id).length;
            const on = items.filter((i) => i.category === c.id && i.enabled).length;
            return (
              <TabsTrigger key={c.id} value={c.id} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <c.icon className="mr-1.5 h-3.5 w-3.5" /> {c.label}
                <span className="ml-1.5 text-[10px] opacity-70">{on}/{count}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {tab !== "all" && (
            <div className="mb-3 flex items-center justify-between rounded-lg border border-dashed border-border/60 bg-card/40 px-3 py-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5" /> Ações em massa nesta categoria
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => void bulk(tab, true)}>
                  <Play className="mr-1.5 h-3 w-3" /> Ativar todos
                </Button>
                <Button size="sm" variant="outline" onClick={() => void bulk(tab, false)}>
                  <Power className="mr-1.5 h-3 w-3" /> Desligar todos
                </Button>
              </div>
            </div>
          )}
          <div className="grid gap-3 xl:grid-cols-2">
            {filtered.map((e) => (
              <EndpointCard
                key={endpointCode(e)}
                e={e}
                onToggle={() => void toggle(endpointCode(e))}
                onConfig={() => setConfigItem(e)}
              />
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full rounded-xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
                Nenhum endpoint encontrado com os filtros atuais.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add endpoint dialog */}
      <AddEndpointDialog open={addOpen} onOpenChange={setAddOpen} onAdd={handleAddEndpoint} />

      <EndpointsLogsModal
        open={logsOpen}
        onOpenChange={setLogsOpen}
        endpointCodes={items.map((item) => ({ code: endpointCode(item), name: item.name }))}
      />

      {/* Config dialog */}
      <ConfigDialog
        item={configItem}
        onOpenChange={(o) => !o && setConfigItem(null)}
        onSave={handleConfigSave}
        onTest={handleConfigTest}
      />
    </SimplePage>
  );
}

function Stat({ icon: Icon, label, value, sub, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub?: string; tone: "cyan" | "green" | "amber" | "red" }) {
  const tones: Record<string, { text: string; bg: string; ring: string; glow: string }> = {
    cyan: { text: "text-cyan-300", bg: "bg-cyan-500/15", ring: "ring-cyan-400/30", glow: "from-cyan-500/10" },
    green: { text: "text-emerald-300", bg: "bg-emerald-500/15", ring: "ring-emerald-400/30", glow: "from-emerald-500/10" },
    amber: { text: "text-amber-300", bg: "bg-amber-500/15", ring: "ring-amber-400/30", glow: "from-amber-500/10" },
    red: { text: "text-rose-300", bg: "bg-rose-500/15", ring: "ring-rose-400/30", glow: "from-rose-500/10" },
  };
  const t = tones[tone];
  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${t.glow} to-transparent opacity-60`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="mt-1.5 font-display text-3xl font-bold leading-none tracking-tight">{value}</div>
          {sub && <div className="mt-1.5 truncate text-[11px] text-muted-foreground">{sub}</div>}
        </div>
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${t.bg} ring-1 ${t.ring}`}>
          <Icon className={`h-4 w-4 ${t.text}`} />
        </div>
      </div>
    </div>
  );
}

function HealthDot({ health }: { health: Health }) {
  const map: Record<Health, { c: string; l: string }> = {
    healthy: { c: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,.7)]", l: "Saudável" },
    degraded: { c: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,.7)]", l: "Degradado" },
    down: { c: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,.7)]", l: "Fora do ar" },
    paused: { c: "bg-slate-500", l: "Pausado" },
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${map[health].c}`} /> {map[health].l}
    </span>
  );
}

function EndpointCard({ e, onToggle, onConfig }: { e: Endpoint; onToggle: () => void; onConfig: () => void }) {
  const cat = CATS.find((c) => c.id === e.category)!;
  return (
    <div className={`group relative overflow-hidden rounded-2xl border ${e.enabled ? "border-border/60" : "border-border/40 opacity-80"} bg-card/60 p-4 transition-all hover:border-primary/40`}>
      <div className={`pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br ${cat.color} opacity-40`} />
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <cat.icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="font-display text-sm font-semibold">{e.name}</h3>
            {e.tag && <Badge variant="outline" className="text-[9px] uppercase tracking-wider">{e.tag}</Badge>}
            {e.custom && <Badge variant="outline" className="text-[9px] uppercase tracking-wider text-primary">Custom</Badge>}
            {e.requiresKey && !e.keySet && (
              <Badge variant="destructive" className="text-[9px] uppercase tracking-wider">
                <KeyRound className="mr-1 h-2.5 w-2.5" /> chave faltando
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{e.desc}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
            <HealthDot health={e.enabled ? e.health : "paused"} />
            <span className="inline-flex items-center gap-1"><RefreshCcw className="h-3 w-3" /> {formatFreq(e.frequencyMin)}</span>
            <span className="inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" /> {e.hits24h.toLocaleString("pt-BR")}/24h</span>
            <span className="inline-flex items-center gap-1"><Signal className="h-3 w-3" /> {e.latencyMs}ms</span>
            {e.region && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" /> {e.region}</span>}
            <span className="inline-flex items-center gap-1"><Database className="h-3 w-3" /> P{e.priority}</span>
          </div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>Taxa de sucesso</span>
              <span>{e.successRate.toFixed(1)}%</span>
            </div>
            <Progress value={e.successRate} className="mt-1 h-1" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Switch checked={e.enabled} onCheckedChange={onToggle} />
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onConfig}>
            Configurar <ChevronRight className="ml-0.5 h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function formatFreq(m: number) {
  if (m < 1) return "tempo real";
  if (m === 1) return "a cada 1 min";
  if (m < 60) return `a cada ${m} min`;
  if (m % 60 === 0) return `a cada ${m / 60}h`;
  return `${m} min`;
}

function ConfigDialog({
  item,
  onOpenChange,
  onSave,
  onTest,
}: {
  item: Endpoint | null;
  onOpenChange: (o: boolean) => void;
  onSave: (patch: {
    frequencyMin: number;
    priority: 1 | 2 | 3;
    concurrency: number;
    region: string;
    apiKey?: string;
  }) => Promise<void>;
  onTest: () => Promise<void>;
}) {
  const [freq, setFreq] = useState<number>(15);
  const [prio, setPrio] = useState<number>(2);
  const [conc, setConc] = useState<number>(4);
  const [region, setRegion] = useState<string>("GLOBAL");
  const [key, setKey] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (item) {
      setFreq(item.frequencyMin);
      setPrio(item.priority);
      setConc(item.concurrency);
      setRegion(item.region ?? "GLOBAL");
      setKey("");
    }
  }, [item]);

  if (!item) return null;
  const cat = CATS.find((c) => c.id === item.category)!;

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({
        frequencyMin: freq,
        priority: prio as 1 | 2 | 3,
        concurrency: conc,
        region,
        ...(key ? { apiKey: key } : {}),
      });
      onOpenChange(false);
    } catch {
      // toast handled by parent
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try {
      await onTest();
    } finally {
      setTesting(false);
    }
  };

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
              <cat.icon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="font-display">{item.name}</DialogTitle>
              <DialogDescription>{item.desc}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-xs font-medium">Frequência: <span className="text-primary">{formatFreq(freq)}</span></Label>
            <Slider value={[freq]} min={1} max={720} step={1} onValueChange={(v) => setFreq(v[0])} />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 min</span><span>1h</span><span>6h</span><span>12h</span>
            </div>

            <Label className="text-xs font-medium">Prioridade</Label>
            <Select value={String(prio)} onValueChange={(v) => setPrio(Number(v))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1">P1 — Crítico (SLA rígido)</SelectItem>
                <SelectItem value="2">P2 — Importante</SelectItem>
                <SelectItem value="3">P3 — Complementar</SelectItem>
              </SelectContent>
            </Select>

            <Label className="text-xs font-medium">Concorrência (workers): {conc}</Label>
            <Slider value={[conc]} min={1} max={40} step={1} onValueChange={(v) => setConc(v[0])} />

            <Label className="text-xs font-medium">Região preferencial</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="GLOBAL">Global</SelectItem>
                <SelectItem value="BR">Brasil</SelectItem>
                <SelectItem value="LATAM">LATAM</SelectItem>
                <SelectItem value="NA">Américas do Norte</SelectItem>
                <SelectItem value="EU">Europa</SelectItem>
                <SelectItem value="APAC">APAC</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {item.requiresKey && (
              <>
                <Label className="text-xs font-medium">Chave / Token de API {item.keySet ? <span className="ml-1 inline-flex items-center gap-1 text-emerald-400"><CheckCircle2 className="h-3 w-3" /> configurada</span> : <span className="ml-1 inline-flex items-center gap-1 text-rose-400"><AlertTriangle className="h-3 w-3" /> ausente</span>}</Label>
                <Input type="password" placeholder="cole aqui a chave / token" value={key} onChange={(ev) => setKey(ev.target.value)} />
                <p className="text-[11px] text-muted-foreground">Armazenamos criptografado em vault. Rotação automática recomendada a cada 90 dias.</p>
              </>
            )}

            <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-xs">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium">Diagnóstico</span>
                <HealthDot health={item.enabled ? item.health : "paused"} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <span>Latência</span><span className="text-foreground">{item.latencyMs} ms</span>
                <span>Sucesso</span><span className="text-foreground">{item.successRate.toFixed(1)}%</span>
                <span>Coletas 24h</span><span className="text-foreground">{item.hits24h.toLocaleString("pt-BR")}</span>
                <span>Custo/1k</span><span className="text-foreground">R$ {item.costPer1k.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" disabled={testing} onClick={() => void handleTest()}>
                  {testing ? <Loader2 className="mr-1 h-3 w-3 animate-spin" /> : <Play className="mr-1 h-3 w-3" />}
                  Testar agora
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-xs"><RefreshCcw className="mr-1 h-3 w-3" /> Reindexar</Button>
              </div>
            </div>

            <Accordion type="single" collapsible>
              <AccordionItem value="adv">
                <AccordionTrigger className="text-xs">Regras avançadas</AccordionTrigger>
                <AccordionContent className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 p-2">
                    <span>Retry com backoff exponencial</span><Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 p-2">
                    <span>Ignorar SSL inválido (não recomendado)</span><Switch />
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 p-2">
                    <span>Rotação de user-agent</span><Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between rounded-md border border-border/60 bg-card/40 p-2">
                    <span>Proxy residencial</span><Switch />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
          <Button onClick={() => void handleSave()} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Salvar alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddEndpointDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAdd: (data: {
    name: string;
    baseUrl: string;
    category: Category;
    frequencyMin: number;
    requiresKey: boolean;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<Category>("search");
  const [freq, setFreq] = useState(30);
  const [requiresKey, setRequiresKey] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name.trim() || !url.trim()) {
      toast.error("Preencha nome e URL do endpoint");
      return;
    }
    setSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        baseUrl: url.trim(),
        category,
        frequencyMin: freq,
        requiresKey,
      });
      setName("");
      setUrl("");
      setCategory("search");
      setFreq(30);
      setRequiresKey(true);
      onOpenChange(false);
    } catch {
      // toast handled by parent
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display">Adicionar endpoint customizado</DialogTitle>
          <DialogDescription>Conecte qualquer API pública, feed RSS ou scraper interno como fonte de captura do Radar.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Nome</Label>
            <Input placeholder="Ex.: Radar Interno – RSS Financeiro" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL / Base do endpoint</Label>
            <Input placeholder="https://api.exemplo.com/v1/search?q={termo}" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATS.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Frequência (min)</Label>
              <Input type="number" min={1} value={freq} onChange={(e) => setFreq(Number(e.target.value) || 30)} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 p-3">
            <div>
              <div className="text-sm font-medium">Requer autenticação</div>
              <div className="text-xs text-muted-foreground">API key, Bearer token ou OAuth.</div>
            </div>
            <Switch checked={requiresKey} onCheckedChange={setRequiresKey} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button onClick={() => void submit()} disabled={submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-1.5 h-3.5 w-3.5" />}
            Adicionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
