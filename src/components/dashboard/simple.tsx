import { createFileRoute } from "@tanstack/react-router";

export function SimplePage({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-mono uppercase tracking-widest text-primary">{eyebrow}</div>
        <h1 className="mt-1 font-display text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function Panel({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-5 ring-gradient">
      {title && <div className="mb-3 font-display text-lg font-semibold">{title}</div>}
      {children}
    </div>
  );
}

// dummy route so Vite doesn't complain if this file is discovered
export const Route = createFileRoute("/dashboard/_shared" as never)({} as never);
