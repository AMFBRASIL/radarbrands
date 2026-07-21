import type { ReactNode } from "react";

export function Corner({
  className = "",
  pos,
  small = false,
}: {
  className?: string;
  pos: "tl" | "tr" | "bl" | "br";
  small?: boolean;
}) {
  const s = small ? "h-3 w-3" : "h-4 w-4";
  const map: Record<string, string> = {
    tl: "border-l border-t rounded-tl",
    tr: "border-r border-t rounded-tr",
    bl: "border-l border-b rounded-bl",
    br: "border-r border-b rounded-br",
  };
  return <div aria-hidden className={`absolute ${s} border-cyan-400/40 ${map[pos]} ${className}`} />;
}

export function SsoButton({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="group flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/85 transition hover:-translate-y-0.5 hover:border-cyan-400/40 hover:bg-white/10"
    >
      {icon} {label}
    </button>
  );
}

export function FieldLabel({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-center justify-between">
      <label className="font-mono text-[10px] uppercase tracking-widest text-white/50">{label}</label>
      {hint && <span className="font-mono text-[9px] uppercase tracking-widest text-white/25">{hint}</span>}
    </div>
  );
}

export function InputShell({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-white/10 bg-[#050b14]/60 px-3.5 transition focus-within:border-cyan-400/60 focus-within:shadow-[0_0_0_3px_rgba(34,211,238,0.15)]">
      <span className="text-white/40">{icon}</span>
      {children}
    </div>
  );
}

export function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function RadarSweepStyles() {
  return (
    <style>{`
      @keyframes radarSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      .h-13 { height: 3.25rem; }
    `}</style>
  );
}
