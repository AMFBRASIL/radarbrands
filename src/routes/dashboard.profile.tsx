import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { SimplePage } from "@/components/dashboard/simple";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2, Lock, User2, Mail, Phone, Building2, Shield } from "lucide-react";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [name, setName] = useState("Marina Souza");
  const [phone, setPhone] = useState("+55 11 98888-0000");
  const [role, setRole] = useState("Coordenadora Jurídica");
  const [company, setCompany] = useState("Cadbrasil");
  const [bio, setBio] = useState("Responsável pelo monitoramento de marca e take-downs do grupo Cadbrasil.");

  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      setSavingProfile(false);
      toast.success("Dados atualizados com sucesso");
    }, 900);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 8) {
      toast.error("A nova senha precisa ter ao menos 8 caracteres");
      return;
    }
    if (newPass !== confirmPass) {
      toast.error("As senhas não coincidem");
      return;
    }
    setSavingPassword(true);
    setTimeout(() => {
      setSavingPassword(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      toast.success("Senha alterada com sucesso");
    }, 900);
  };

  return (
    <SimplePage
      eyebrow="Minha conta"
      title="Editar dados"
      description="Atualize suas informações pessoais e sua senha de acesso."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Coluna esquerda — Card do usuário */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]" />
              <div>
                <div className="font-display text-base font-semibold">{name}</div>
                <div className="text-xs text-muted-foreground">{role}</div>
              </div>
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> marina@cadbrasil.com.br</div>
              <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {phone}</div>
              <div className="flex items-center gap-2"><Building2 className="h-3.5 w-3.5" /> {company}</div>
            </div>
            <div className="mt-4 rounded-lg border border-border/60 bg-muted/30 p-3 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-1.5 font-medium text-foreground">
                <Shield className="h-3.5 w-3.5 text-primary" /> Conta protegida
              </div>
              MFA ativado · Último acesso há 2h
            </div>
          </div>
        </aside>

        {/* Coluna direita — Formulários */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dados pessoais */}
          <form
            onSubmit={handleSaveProfile}
            className="rounded-2xl border border-border/60 bg-card/60 p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <User2 className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold">Informações pessoais</h2>
                <p className="text-xs text-muted-foreground">O e-mail da conta não pode ser alterado.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-medium">Nome completo</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-medium">E-mail</Label>
                <div className="relative">
                  <Input id="email" value="marina@cadbrasil.com.br" disabled className="pr-20" />
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                    Bloqueado
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium">Telefone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role" className="text-xs font-medium">Cargo</Label>
                <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="company" className="text-xs font-medium">Empresa</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="bio" className="text-xs font-medium">Sobre você</Label>
                <Textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>
                ) : (
                  "Salvar alterações"
                )}
              </Button>
            </div>
          </form>

          {/* Alterar senha */}
          <form
            onSubmit={handleSavePassword}
            className="rounded-2xl border border-border/60 bg-card/60 p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Lock className="h-4 w-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-semibold">Alterar senha</h2>
                <p className="text-xs text-muted-foreground">Use ao menos 8 caracteres, com letras e números.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="current" className="text-xs font-medium">Senha atual</Label>
                <div className="relative">
                  <Input
                    id="current"
                    type={showCurrent ? "text" : "password"}
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Mostrar senha"
                  >
                    {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new" className="text-xs font-medium">Nova senha</Label>
                <div className="relative">
                  <Input
                    id="new"
                    type={showNew ? "text" : "password"}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Mostrar senha"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm" className="text-xs font-medium">Confirmar nova senha</Label>
                <div className="relative">
                  <Input
                    id="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Mostrar senha"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <Button type="submit" disabled={savingPassword}>
                {savingPassword ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Atualizando...</>
                ) : (
                  "Atualizar senha"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SimplePage>
  );
}
