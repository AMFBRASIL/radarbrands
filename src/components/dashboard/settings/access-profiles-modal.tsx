import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Check, Globe2, Loader2, Pencil, Plus, Shield, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { SettingsModalShell } from "@/components/dashboard/settings/settings-modal-shell";
import {
  buildPermissionMap,
  PERMISSION_GROUPS,
  permissionsToCodes,
  PROTECTED_ROLE_CODES,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  createTeamRole,
  fetchTeamRoles,
  updateRolePermissions,
  updateTeamRole,
  type TeamRole,
} from "@/lib/team-api";
import { meRequest } from "@/lib/auth-api";
import { refreshDashboardAuth } from "@/lib/auth-session";

type AccessProfilesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved?: () => void;
};

const CLIENT_DEFAULT_PERMISSIONS = [
  "brands.read",
  "threats.read",
  "alerts.read",
  "reports.read",
  "reports.generate",
  "legal.read",
];

export function AccessProfilesModal({ open, onOpenChange, onSaved }: AccessProfilesModalProps) {
  const router = useRouter();
  const [roles, setRoles] = useState<TeamRole[]>([]);
  const [selectedRole, setSelectedRole] = useState("admin");
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentRoleCode, setCurrentRoleCode] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [editingMeta, setEditingMeta] = useState(false);

  const loadRoles = useCallback(async (preferCode?: string) => {
    setLoading(true);
    try {
      const [data, auth] = await Promise.all([fetchTeamRoles(), meRequest()]);
      setCurrentRoleCode(auth.membership?.roleCode ?? null);
      setRoles(data);
      setPermissions(buildPermissionMap(data));
      const preferred =
        (preferCode && data.some((role) => role.code === preferCode) ? preferCode : null) ??
        data.find((role) => !PROTECTED_ROLE_CODES.has(role.code))?.code ??
        data[0]?.code ??
        "admin";
      setSelectedRole(preferred);
      setDirty(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao carregar perfis");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      void loadRoles();
    }
  }, [open, loadRoles]);

  const rolePermissions = permissions[selectedRole] ?? {};
  const enabledCount = useMemo(
    () => Object.values(rolePermissions).filter(Boolean).length,
    [rolePermissions],
  );
  const totalCount = PERMISSION_GROUPS.reduce((acc, group) => acc + group.permissions.length, 0);
  const selectedRoleMeta = roles.find((role) => role.code === selectedRole);
  const isProtected = PROTECTED_ROLE_CODES.has(selectedRole);
  const editingOwnRole = currentRoleCode !== null && selectedRole === currentRoleCode;

  const togglePermission = (code: string, enabled: boolean) => {
    if (isProtected) {
      toast.message("Perfil protegido", {
        description: "Owner e Super Admin possuem acesso total por padrão.",
      });
      return;
    }
    setPermissions((prev) => ({
      ...prev,
      [selectedRole]: {
        ...prev[selectedRole],
        [code]: enabled,
      },
    }));
    setDirty(true);
  };

  const toggleGroup = (groupId: string, enabled: boolean) => {
    if (isProtected) return;
    const group = PERMISSION_GROUPS.find((row) => row.id === groupId);
    if (!group) return;
    setPermissions((prev) => {
      const next = { ...prev[selectedRole] };
      for (const perm of group.permissions) {
        next[perm.code] = enabled;
      }
      return { ...prev, [selectedRole]: next };
    });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!selectedRoleMeta || isProtected) return;
    setSaving(true);
    try {
      const updated = await updateRolePermissions(selectedRole, permissionsToCodes(rolePermissions));
      setRoles((prev) => prev.map((role) => (role.code === updated.code ? updated : role)));
      setPermissions((prev) => ({
        ...prev,
        [updated.code]: buildPermissionMap([updated])[updated.code],
      }));
      setDirty(false);

      const auth = await meRequest();
      const affectsCurrentUser = auth.membership?.roleCode === updated.code;
      await refreshDashboardAuth(router);

      if (affectsCurrentUser) {
        toast.success(`Perfil ${updated.name} atualizado`, {
          description: "Menu e acessos sincronizados com suas novas permissões.",
        });
      } else {
        toast.success(`Perfil ${updated.name} atualizado`, {
          description: "Membros com este perfil verão as mudanças ao atualizar a sessão.",
        });
      }

      onSaved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setCreateForm({ name: "", code: "", description: "" });
    setCreateOpen(true);
  };

  const openEditMeta = () => {
    if (!selectedRoleMeta || isProtected) return;
    setEditForm({
      name: selectedRoleMeta.name,
      description: selectedRoleMeta.description ?? "",
    });
    setEditOpen(true);
  };

  const handleCreate = async () => {
    if (!createForm.name.trim()) {
      toast.error("Informe o nome do perfil");
      return;
    }
    setCreating(true);
    try {
      const created = await createTeamRole({
        name: createForm.name.trim(),
        code: createForm.code.trim() || undefined,
        description: createForm.description.trim() || null,
        permissionCodes:
          createForm.name.trim().toLowerCase().includes("cliente") || createForm.code.trim() === "client"
            ? CLIENT_DEFAULT_PERMISSIONS
            : ["brands.read", "threats.read", "alerts.read", "reports.read"],
      });
      setCreateOpen(false);
      toast.success(`Perfil ${created.name} criado`);
      await loadRoles(created.code);
      onSaved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao criar perfil");
    } finally {
      setCreating(false);
    }
  };

  const handleEditMeta = async () => {
    if (!selectedRoleMeta || !editForm.name.trim()) {
      toast.error("Informe o nome do perfil");
      return;
    }
    setEditingMeta(true);
    try {
      const updated = await updateTeamRole(selectedRole, {
        name: editForm.name.trim(),
        description: editForm.description.trim() || null,
      });
      setRoles((prev) => prev.map((role) => (role.code === updated.code ? updated : role)));
      setEditOpen(false);
      toast.success("Dados do perfil atualizados");
      onSaved?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao editar perfil");
    } finally {
      setEditingMeta(false);
    }
  };

  return (
    <>
      <SettingsModalShell
        open={open}
        onOpenChange={onOpenChange}
        title="Perfis de Acesso"
        eyebrow="RBAC"
        description="Selecione um perfil e configure permissões por página do painel."
        icon={Shield}
        gradient="from-violet-500/25 to-fuchsia-500/10"
        size="large"
        headerAction={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={openCreate}>
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Novo perfil
            </Button>
            <div className="text-right text-xs text-muted-foreground">
              <div className="font-mono uppercase tracking-widest text-primary">Permissões ativas</div>
              <div className="text-lg font-semibold text-foreground">
                {enabledCount}/{totalCount}
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Perfil selecionado: <strong>{selectedRoleMeta?.name ?? "—"}</strong>
              {dirty && " · alterações não salvas"}
              {!editingOwnRole && currentRoleCode && (
                <span className="mt-1 block text-amber-400/90">
                  Você está logado como <strong>{currentRoleCode}</strong> — o menu só muda ao editar o seu próprio
                  perfil ou ao entrar com um usuário desse perfil.
                </span>
              )}
            </p>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={() => void handleSave()} disabled={!dirty || saving || isProtected}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar perfil"
                )}
              </Button>
            </div>
          </div>
        }
        contentClassName="!overflow-hidden !py-0"
      >
        {loading ? (
          <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando perfis...
          </div>
        ) : (
          <div className="grid h-full min-h-[520px] grid-cols-1 lg:grid-cols-[320px_1fr]">
            <div className="border-b border-border/60 bg-muted/10 p-4 lg:border-b-0 lg:border-r lg:overflow-y-auto">
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Perfis da organização
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={openCreate}>
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Criar
                </Button>
              </div>
              <div className="space-y-2">
                {roles.map((role) => {
                  const selected = selectedRole === role.code;
                  const count = Object.values(permissions[role.code] ?? {}).filter(Boolean).length;
                  return (
                    <button
                      key={role.code}
                      type="button"
                      onClick={() => setSelectedRole(role.code)}
                      className={cn(
                        "group relative w-full overflow-hidden rounded-2xl border p-4 text-left transition-all",
                        selected
                          ? "border-primary bg-primary/10 shadow-[var(--shadow-glow)]"
                          : "border-border/60 bg-card/40 hover:border-primary/40 hover:bg-card/70",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
                          <Shield className="h-4 w-4" />
                        </div>
                        {selected && (
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-sm font-semibold">{role.name}</h3>
                          {role.scope === "system" && (
                            <span className="rounded bg-fuchsia-500/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-fuchsia-400">
                              Sistema
                            </span>
                          )}
                          {role.code === "client" && (
                            <span className="rounded bg-cyan-500/15 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-cyan-300">
                              Cliente
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{role.description}</p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
                          <span>{role.memberCount} membros</span>
                          <span>·</span>
                          <span>{count} permissões</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="overflow-y-auto p-4 lg:p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-primary">
                    Permissões do perfil
                  </div>
                  <h3 className="font-display text-lg font-bold">{selectedRoleMeta?.name}</h3>
                  <p className="text-xs text-muted-foreground">{selectedRoleMeta?.description}</p>
                  {selectedRoleMeta && (
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground/70">{selectedRoleMeta.code}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!isProtected && (
                    <Button variant="outline" size="sm" onClick={openEditMeta}>
                      <Pencil className="mr-1.5 h-3.5 w-3.5" />
                      Editar dados
                    </Button>
                  )}
                  {isProtected && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300">
                      <Sparkles className="h-3 w-3" /> Acesso total
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                {PERMISSION_GROUPS.map((group) => {
                  const groupCodes = group.permissions.map((perm) => perm.code);
                  const groupEnabled = groupCodes.every((code) => rolePermissions[code]);
                  const groupPartial =
                    !groupEnabled && groupCodes.some((code) => rolePermissions[code]);

                  return (
                    <section
                      key={group.id}
                      className="overflow-hidden rounded-2xl border border-border/60 bg-card/30"
                    >
                      <div className="flex items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-4 py-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <Globe2 className="h-4 w-4 shrink-0 text-primary" />
                            <h4 className="font-medium">{group.label}</h4>
                          </div>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{group.page}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="hidden text-[10px] uppercase tracking-wider text-muted-foreground sm:inline">
                            {groupPartial ? "Parcial" : groupEnabled ? "Tudo ligado" : "Desligado"}
                          </span>
                          <Switch
                            checked={groupEnabled}
                            onCheckedChange={(on) => toggleGroup(group.id, on)}
                            disabled={isProtected}
                          />
                        </div>
                      </div>

                      <ul className="divide-y divide-border/50">
                        {group.permissions.map((perm) => (
                          <li
                            key={perm.code}
                            className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-muted/10"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium">{perm.label}</div>
                              <div className="text-xs text-muted-foreground">{perm.description}</div>
                              <div className="mt-1 font-mono text-[10px] text-muted-foreground/70">{perm.code}</div>
                            </div>
                            <Switch
                              checked={!!rolePermissions[perm.code]}
                              onCheckedChange={(on) => togglePermission(perm.code, on)}
                              disabled={isProtected}
                            />
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </SettingsModalShell>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Novo perfil de acesso</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="role-name">Nome</Label>
              <Input
                id="role-name"
                value={createForm.name}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Cliente"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-code">Código (opcional)</Label>
              <Input
                id="role-code"
                value={createForm.code}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    code: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                  }))
                }
                placeholder="client"
              />
              <p className="text-[11px] text-muted-foreground">
                Se vazio, geramos a partir do nome. Ex.: Cliente → client
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role-desc">Descrição</Label>
              <Textarea
                id="role-desc"
                value={createForm.description}
                onChange={(e) => setCreateForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Acesso do cliente às páginas de acompanhamento"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleCreate()} disabled={creating}>
              {creating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar perfil"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Editar perfil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Código</Label>
              <Input value={selectedRole} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-role-name">Nome</Label>
              <Input
                id="edit-role-name"
                value={editForm.name}
                onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="edit-role-desc">Descrição</Label>
              <Textarea
                id="edit-role-desc"
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => void handleEditMeta()} disabled={editingMeta}>
              {editingMeta ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar dados"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
