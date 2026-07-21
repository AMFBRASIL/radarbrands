import { useCallback, useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  RefreshCcw,
  ScrollText,
  Search,
  SkipForward,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { fetchEndpointRuns, type EndpointRunItem } from "@/lib/endpoints-api";

type EndpointsLogsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  endpointCodes?: Array<{ code: string; name: string }>;
};

const STATUS_META: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  done: {
    label: "OK",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    icon: CheckCircle2,
  },
  failed: {
    label: "Falha",
    className: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    icon: XCircle,
  },
  skipped: {
    label: "Skip",
    className: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    icon: SkipForward,
  },
  running: {
    label: "Rodando",
    className: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    icon: Loader2,
  },
  queued: {
    label: "Fila",
    className: "bg-slate-500/15 text-slate-300 border-slate-500/30",
    icon: Clock3,
  },
};

function formatWhen(iso: string) {
  try {
    return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ptBR });
  } catch {
    return iso;
  }
}

function formatClock(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function EndpointsLogsModal({ open, onOpenChange, endpointCodes = [] }: EndpointsLogsModalProps) {
  const [runs, setRuns] = useState<EndpointRunItem[]>([]);
  const [summary, setSummary] = useState({ total: 0, done: 0, failed: 0, skipped: 0, running: 0 });
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("all");
  const [triggeredBy, setTriggeredBy] = useState<string>("all");
  const [code, setCode] = useState<string>("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEndpointRuns({
        limit: 200,
        status: status === "all" ? undefined : status,
        triggeredBy: triggeredBy === "all" ? undefined : triggeredBy,
        code: code === "all" ? undefined : code,
        q: q.trim() || undefined,
      });
      setRuns(data.runs);
      setSummary(data.summary);
      setSelectedId((prev) => {
        if (prev && data.runs.some((run) => run.id === prev)) return prev;
        return data.runs[0]?.id ?? null;
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar logs");
    } finally {
      setLoading(false);
    }
  }, [status, triggeredBy, code, q]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open || !autoRefresh) return;
    const timer = setInterval(() => {
      void load();
    }, 8_000);
    return () => clearInterval(timer);
  }, [open, autoRefresh, load]);

  const selected = useMemo(
    () => runs.find((run) => run.id === selectedId) ?? null,
    [runs, selectedId],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[92vh] max-w-[min(96vw,1280px)] flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border/60 px-6 py-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground">
                  <ScrollText className="h-4 w-4" />
                </div>
                <DialogTitle className="font-display text-xl">Logs de captura</DialogTitle>
              </div>
              <DialogDescription>
                Histórico em tempo quase real de todas as execuções das APIs — cron, testes manuais, skips e falhas.
              </DialogDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoRefresh((v) => !v)}
              >
                <RefreshCcw className={cn("mr-1.5 h-3.5 w-3.5", autoRefresh && "animate-spin")} />
                Auto {autoRefresh ? "ON" : "OFF"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
                {loading ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />}
                Atualizar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-3 border-b border-border/60 px-6 py-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryChip label="Na lista" value={summary.total} />
          <SummaryChip label="OK" value={summary.done} tone="green" />
          <SummaryChip label="Falhas" value={summary.failed} tone="red" />
          <SummaryChip label="Skips" value={summary.skipped} tone="amber" />
          <SummaryChip label="Rodando" value={summary.running} tone="cyan" />
        </div>

        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 px-6 py-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Filtrar por nome ou código…"
              className="h-9 pl-9"
            />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="done">OK</SelectItem>
              <SelectItem value="failed">Falha</SelectItem>
              <SelectItem value="skipped">Skip</SelectItem>
              <SelectItem value="running">Rodando</SelectItem>
            </SelectContent>
          </Select>
          <Select value={triggeredBy} onValueChange={setTriggeredBy}>
            <SelectTrigger className="h-9 w-[140px]">
              <SelectValue placeholder="Origem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas origens</SelectItem>
              <SelectItem value="cron">Cron</SelectItem>
              <SelectItem value="manual">Manual</SelectItem>
            </SelectContent>
          </Select>
          <Select value={code} onValueChange={setCode}>
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="Endpoint" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos endpoints</SelectItem>
              {endpointCodes.map((item) => (
                <SelectItem key={item.code} value={item.code}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[420px_1fr]">
          <div className="max-h-[52vh] overflow-y-auto border-b border-border/60 lg:max-h-none lg:border-b-0 lg:border-r">
            {loading && runs.length === 0 ? (
              <div className="flex items-center justify-center gap-2 p-10 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Carregando logs…
              </div>
            ) : runs.length === 0 ? (
              <div className="p-10 text-center text-sm text-muted-foreground">
                <FileText className="mx-auto mb-2 h-8 w-8 opacity-40" />
                Nenhum log ainda. Ative o worker (`npm run worker:endpoints`) ou use “Testar agora”.
              </div>
            ) : (
              <ul className="divide-y divide-border/50">
                {runs.map((run) => {
                  const meta = STATUS_META[run.status] ?? STATUS_META.queued;
                  const Icon = meta.icon;
                  const active = run.id === selectedId;
                  return (
                    <li key={run.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(run.id)}
                        className={cn(
                          "w-full px-4 py-3 text-left transition hover:bg-muted/30",
                          active && "bg-primary/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">{run.endpointName}</div>
                            <div className="truncate font-mono text-[10px] text-muted-foreground">
                              {run.endpointCode} · {run.category}
                            </div>
                          </div>
                          <Badge variant="outline" className={cn("shrink-0 text-[10px]", meta.className)}>
                            <Icon className={cn("mr-1 h-3 w-3", run.status === "running" && "animate-spin")} />
                            {meta.label}
                          </Badge>
                        </div>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                          <span>{formatWhen(run.createdAt)}</span>
                          <span>{run.triggeredBy}</span>
                          {run.latencyMs != null && <span>{run.latencyMs}ms</span>}
                          {run.error && (
                            <span className="inline-flex items-center gap-1 text-rose-400">
                              <AlertTriangle className="h-3 w-3" /> erro
                            </span>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="flex min-h-[280px] max-h-[52vh] flex-col lg:max-h-none">
            {!selected ? (
              <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
                Selecione uma execução à esquerda para ver o detalhe.
              </div>
            ) : (
              <>
                <div className="border-b border-border/60 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{selected.endpointName}</h3>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {selected.endpointCode}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] uppercase">
                      {selected.triggeredBy}
                    </Badge>
                  </div>
                  <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <div className="uppercase tracking-wider text-[10px]">Início</div>
                      <div className="text-foreground">{formatClock(selected.startedAt)}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wider text-[10px]">Fim</div>
                      <div className="text-foreground">{formatClock(selected.finishedAt)}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wider text-[10px]">Latência / duração</div>
                      <div className="text-foreground">
                        {selected.latencyMs != null ? `${selected.latencyMs} ms` : "—"}
                        {selected.durationMs != null ? ` · ${selected.durationMs} ms total` : ""}
                      </div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wider text-[10px]">Itens</div>
                      <div className="text-foreground">{selected.itemsFound}</div>
                    </div>
                  </div>
                  {selected.error && (
                    <div className="mt-3 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                      {selected.error}
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-emerald-300">
                  {selected.log.length === 0 ? (
                    <div className="text-muted-foreground">
                      Sem linhas de log detalhadas nesta execução
                      {selected.status === "done" ? " (rodadas antigas antes do detalhamento)." : "."}
                    </div>
                  ) : (
                    selected.log.map((line, idx) => (
                      <div key={`${selected.id}-${idx}`} className="whitespace-pre-wrap">
                        {line}
                      </div>
                    ))
                  )}
                  {selected.status === "running" && (
                    <div className="mt-1 animate-pulse text-primary">▌</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SummaryChip({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: number;
  tone?: "cyan" | "green" | "red" | "amber";
}) {
  const tones = {
    cyan: "text-cyan-300",
    green: "text-emerald-300",
    red: "text-rose-300",
    amber: "text-amber-300",
  };
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("font-display text-2xl font-bold", tones[tone])}>{value}</div>
    </div>
  );
}
