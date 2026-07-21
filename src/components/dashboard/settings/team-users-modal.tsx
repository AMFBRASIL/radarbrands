import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Loader2,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  UserPlus,
  Users2,
} from "lucide-react";
import { toast } from "sonner";

import { SettingsModalShell } from "@/components/dashboard/settings/settings-modal-shell";
import { AccessProfilesModal } from "@/components/dashboard/settings/access-profiles-modal";
import {
  isAssignableRole,
  PROTECTED_ROLE_CODES,
  STATUS_LABEL,
} from "@/components/dashboard/settings/team-data";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  fetchTeamMembers,
  fetchTeamRoles,
  inviteTeamMember,
  removeTeamMember,
  resendTeamInvite,
  setInvitedMemberPassword,
  updateTeamMemberRole,
  type TeamMember,
  type TeamRole,
} from "@/lib/team-api";
import { meRequest } from "@/lib/auth-api";
import { refreshDashboardAuth } from "@/lib/auth-session";

type TeamUsersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatLastAccess(member: TeamMember): string {
  if (member.status === "invited") {
    if (!member.invitedAt) return "Convite pendente";
    return `Convite ${formatDistanceToNow(new Date(member.invitedAt), { addSuffix: true, locale: ptBR })}`;
  }
  if (!member.lastLoginAt) return "Nunca acessou";
  return formatDistanceToNow(new Date(member.lastLoginAt), { addSuffix: true, locale: ptBR });
}

export function TeamUsersModal({ open, onOpenChange }: TeamUsersModalProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [profilesOpen, setProfilesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [passwordMember, setPasswordMember] = useState<TeamMember | null>(null);
  const [passwordForm, setPasswordForm] = useState({ password: "", confirmPassword: "" });
  const [users, setUsers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    fullName: "",
    email: "",
    roleCode: "viewer",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [members, roleList] = await Promise.all([fetchTeamMembers(), fetchTeamRoles()]);
      setUsers(members);
      setRoles(roleList);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar equipe");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void loadData();
    }
  }, [open, loadData]);

  const assignableRoles = useMemo(
    () => roles.filter((role) => isAssignableRole(role)),
    [roles],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.roleName.toLowerCase().includes(q),
    );
  }, [search, users]);

  const handleInvite = async () => {
    if (!inviteForm.fullName.trim() || !inviteForm.email.trim()) {
      toast.error("Preencha nome e e-mail");
      return;
    }

    setSubmitting(true);
    try {
      const member = await inviteTeamMember({
        fullName: inviteForm.fullName.trim(),
        email: inviteForm.email.trim().toLowerCase(),
        roleCode: inviteForm.roleCode,
      });
      setUsers((prev) => {
        const exists = prev.some((row) => row.uuid === member.uuid);
        return exists ? prev.map((row) => (row.uuid === member.uuid ? member : row)) : [...prev, member];
      });
      setInviteOpen(false);
      setInviteForm({ fullName: "", email: "", roleCode: "viewer" });
      toast.success("Convite enviado com sucesso");
      void loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao convidar usuário");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (member: TeamMember, roleCode: string) => {
    if (PROTECTED_ROLE_CODES.has(member.roleCode)) return;
    try {
      const updated = await updateTeamMemberRole(member.uuid, roleCode);
      setUsers((prev) => prev.map((row) => (row.uuid === updated.uuid ? updated : row)));
      const auth = await meRequest();
      if (auth.user.uuid === member.uuid) {
        await refreshDashboardAuth(router);
        toast.success(`Seu perfil foi alterado para ${updated.roleName}`);
      } else {
        toast.success(`Perfil atualizado para ${updated.roleName}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar perfil");
    }
  };

  const handleRemove = async (member: TeamMember) => {
    if (PROTECTED_ROLE_CODES.has(member.roleCode)) return;
    try {
      await removeTeamMember(member.uuid);
      setUsers((prev) => prev.filter((row) => row.uuid !== member.uuid));
      toast.success("Usuário removido da organização");
      void loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao remover usuário");
    }
  };

  const handleResendInvite = async (member: TeamMember) => {
    try {
      await resendTeamInvite(member.uuid);
      toast.success("Convite reenviado com link para criar senha");
      void loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao reenviar convite");
    }
  };

  const handleSetPassword = async () => {
    if (!passwordMember) return;
    if (passwordForm.password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      return;
    }
    if (passwordForm.password !== passwordForm.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await setInvitedMemberPassword(passwordMember.uuid, passwordForm);
      setUsers((prev) => prev.map((row) => (row.uuid === updated.uuid ? updated : row)));
      setPasswordMember(null);
      setPasswordForm({ password: "", confirmPassword: "" });
      toast.success("Senha definida. O usuário já pode fazer login.");
      void loadData();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao definir senha");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SettingsModalShell
        open={open}
        onOpenChange={onOpenChange}
        title="Usuários & Permissões"
        eyebrow="Equipe"
        description="Gerencie membros, convites e perfis de acesso da organização."
        icon={Users2}
        gradient="from-indigo-500/25 to-purple-500/10"
        headerAction={
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" onClick={() => setProfilesOpen(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Perfil de Acesso
            </Button>
            <Button onClick={() => setInviteOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Convidar usuário
            </Button>
          </div>
        }
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {users.length} usuários · {users.filter((user) => user.status === "active").length} ativos
            </p>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, e-mail ou perfil..."
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando equipe...
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <div className="hidden gap-3 border-b border-border/60 bg-muted/30 px-4 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground md:grid md:grid-cols-[1.4fr_1fr_0.8fr_0.7fr_40px]">
                <span>Usuário</span>
                <span>Perfil</span>
                <span>Status</span>
                <span>Último acesso</span>
                <span />
              </div>

              <ul className="divide-y divide-border/60">
                {filtered.map((user) => (
                  <li
                    key={user.uuid}
                    className="flex flex-col gap-3 px-4 py-4 transition hover:bg-muted/20 md:grid md:grid-cols-[1.4fr_1fr_0.8fr_0.7fr_40px] md:items-center md:gap-3 md:py-3"
                  >
                    <div className="min-w-0">
                      <div className="truncate font-medium">{user.fullName}</div>
                      <div className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                        <Mail className="h-3 w-3 shrink-0" />
                        {user.email}
                      </div>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {user.roleName}
                    </span>

                    <span
                      className={cn(
                        "inline-flex w-fit rounded-full px-2 py-0.5 text-[11px] font-medium",
                        user.status === "active" && "bg-emerald-500/15 text-emerald-400",
                        user.status === "invited" && "bg-amber-500/15 text-amber-400",
                        user.status === "suspended" && "bg-red-500/15 text-red-400",
                      )}
                    >
                      {STATUS_LABEL[user.status]}
                    </span>

                    <span className="text-xs text-muted-foreground">{formatLastAccess(user)}</span>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 self-end md:self-auto">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {!PROTECTED_ROLE_CODES.has(user.roleCode) && (
                          <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Alterar perfil</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                              {assignableRoles.map((role) => (
                                <DropdownMenuItem
                                  key={role.code}
                                  disabled={role.code === user.roleCode}
                                  onClick={() => void handleRoleChange(user, role.code)}
                                >
                                  {role.name}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuSubContent>
                          </DropdownMenuSub>
                        )}
                        <DropdownMenuItem onClick={() => setProfilesOpen(true)}>
                          Editar permissões do perfil
                        </DropdownMenuItem>
                        {user.status === "invited" && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setPasswordMember(user);
                                setPasswordForm({ password: "", confirmPassword: "" });
                              }}
                            >
                              Definir senha
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => void handleResendInvite(user)}>
                              Reenviar convite
                            </DropdownMenuItem>
                          </>
                        )}
                        {!PROTECTED_ROLE_CODES.has(user.roleCode) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => void handleRemove(user)}
                            >
                              Remover da organização
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </li>
                ))}
              </ul>

              {filtered.length === 0 && (
                <div className="px-4 py-10 text-center text-sm text-muted-foreground">
                  {users.length === 0
                    ? "Nenhum membro na equipe ainda."
                    : `Nenhum usuário encontrado para "${search}".`}
                </div>
              )}
            </div>
          )}

          <div className="rounded-xl border border-border/60 bg-card/40 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Perfis de acesso</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Defina o que cada perfil pode ver e fazer em cada área do painel. Clique em{" "}
                  <strong>Perfil de Acesso</strong> para editar permissões por página.
                </p>
                <Button variant="link" className="mt-1 h-auto p-0 text-primary" onClick={() => setProfilesOpen(true)}>
                  Gerenciar perfis →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SettingsModalShell>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-name">Nome completo</Label>
              <Input
                id="invite-name"
                value={inviteForm.fullName}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, fullName: e.target.value }))}
                placeholder="Maria Silva"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">E-mail</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteForm.email}
                onChange={(e) => setInviteForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="maria@empresa.com.br"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Perfil de acesso</Label>
              <Select
                value={inviteForm.roleCode}
                onValueChange={(value) => setInviteForm((prev) => ({ ...prev, roleCode: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent>
                  {assignableRoles.map((role) => (
                    <SelectItem key={role.code} value={role.code}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleInvite()} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar convite"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(passwordMember)}
        onOpenChange={(open) => {
          if (!open) {
            setPasswordMember(null);
            setPasswordForm({ password: "", confirmPassword: "" });
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Definir senha do convidado</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Defina uma senha para{" "}
              <strong>{passwordMember?.fullName}</strong> ({passwordMember?.email}). O convite será
              ativado e o usuário poderá entrar imediatamente.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="set-password">Nova senha</Label>
              <Input
                id="set-password"
                type="password"
                autoComplete="new-password"
                value={passwordForm.password}
                onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="set-password-confirm">Confirmar senha</Label>
              <Input
                id="set-password-confirm"
                type="password"
                autoComplete="new-password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
                }
                placeholder="Repita a senha"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setPasswordMember(null);
                setPasswordForm({ password: "", confirmPassword: "" });
              }}
            >
              Cancelar
            </Button>
            <Button onClick={() => void handleSetPassword()} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar senha"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AccessProfilesModal
        open={profilesOpen}
        onOpenChange={setProfilesOpen}
        onSaved={() => void loadData()}
      />
    </>
  );
}
