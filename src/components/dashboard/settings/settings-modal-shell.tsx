import type { ComponentType, ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

type SettingsModalShellProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  eyebrow: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  headerAction?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
  size?: "default" | "large";
};

export function SettingsModalShell({
  open,
  onOpenChange,
  title,
  eyebrow,
  description,
  icon: Icon,
  gradient,
  headerAction,
  footer,
  children,
  contentClassName,
  size = "default",
}: SettingsModalShellProps) {
  const isLarge = size === "large";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "gap-0 overflow-hidden border-border/60 bg-background/95 p-0 sm:rounded-2xl",
          isLarge ? "max-w-[min(96vw,1400px)]" : "max-w-6xl",
        )}
      >
        <div
          className={cn(
            "grid h-[85vh] max-h-[900px] grid-cols-1",
            isLarge ? "md:grid-cols-[300px_1fr]" : "md:grid-cols-[320px_1fr]",
          )}
        >
          <aside className="relative hidden overflow-hidden border-r border-border/60 md:block">
            <div className={cn("absolute inset-0 bg-gradient-to-br", gradient)} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(var(--primary)/0.35),transparent_55%),radial-gradient(circle_at_80%_90%,hsl(var(--primary)/0.25),transparent_50%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.55),rgba(0,0,0,0.85))]" />
            <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(hsl(var(--foreground))_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground))_1px,transparent_1px)] [background-size:32px_32px]" />

            <div className="relative flex h-full flex-col p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">{eyebrow}</div>
                  <div className="font-display text-lg font-bold leading-tight text-white">{title}</div>
                </div>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-white/70">{description}</p>

              <div className="mt-auto pt-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-[11px] text-white/60">
                  <div className="mb-1 flex items-center gap-1.5 text-white/80">
                    <Sparkles className="h-3.5 w-3.5 text-primary" /> Dica
                  </div>
                  Alterações em perfis e permissões são registradas na trilha de auditoria.
                </div>
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border/60 px-6 py-5 md:px-8">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-primary md:hidden">
                  {eyebrow}
                </div>
                <h2 className="font-display text-xl font-bold md:text-2xl">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground md:hidden">{description}</p>
              </div>
              {headerAction}
            </header>

            <div className={cn("flex-1 overflow-y-auto px-6 py-6 scrollbar-none md:px-8", contentClassName)}>
              {children}
            </div>

            {footer && (
              <footer className="border-t border-border/60 bg-card/40 px-6 py-4 md:px-8">{footer}</footer>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
