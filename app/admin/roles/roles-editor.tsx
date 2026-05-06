"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Shield, ChevronDown, ChevronRight } from "lucide-react";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import type { PermissionDef } from "@/lib/admin/permissions";

type Role = {
  id: string;
  name: string;
  description: string;
  is_super: boolean;
  permissions: string[];
  user_count: number;
};

export function RolesEditor({
  roles,
  permissions,
  onAdd,
  onUpdate,
  onDelete,
}: {
  roles: Role[];
  permissions: PermissionDef[];
  onAdd: (input: { name: string; description: string; permissions: string[] }) => Promise<{ ok: boolean; error?: string; role_id?: string }>;
  onUpdate: (input: { id: string; name: string; description: string; permissions: string[] }) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [list, setList] = useState<Role[]>(roles);
  const [openId, setOpenId] = useState<string>("");

  const [adding, setAdding] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const groupedPerms = permissions.reduce<Record<string, PermissionDef[]>>((acc, p) => {
    (acc[p.group] ||= []).push(p);
    return acc;
  }, {});

  const togglePerm = (set: string[], k: string) =>
    set.includes(k) ? set.filter((x) => x !== k) : [...set, k];

  const updateRoleField = (id: string, patch: Partial<Role>) =>
    setList((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const saveRole = async (r: Role) => {
    const res = await onUpdate({
      id: r.id,
      name: r.name,
      description: r.description,
      permissions: r.permissions,
    });
    if (!res.ok) return toast.error(res.error ?? "Errore");
    toast.success("Ruolo aggiornato");
  };

  const removeRole = async (r: Role) => {
    if (!confirm(`Eliminare il ruolo "${r.name}"?`)) return;
    const res = await onDelete(r.id);
    if (!res.ok) return toast.error(res.error ?? "Errore");
    setList((prev) => prev.filter((x) => x.id !== r.id));
    toast.success("Ruolo eliminato");
  };

  const addRole = async () => {
    setSubmitting(true);
    try {
      const res = await onAdd(adding);
      if (!res.ok) return toast.error(res.error ?? "Errore");
      toast.success("Ruolo creato");
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <FormSection title="Ruoli esistenti">
        <div className="space-y-3">
          {list.map((r) => {
            const open = openId === r.id;
            return (
              <div key={r.id} className="border border-[var(--color-line)] bg-white">
                <header className="flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? "" : r.id)}
                    className="flex flex-1 items-center gap-2 text-left"
                    disabled={r.is_super}
                  >
                    {!r.is_super && (open ? <ChevronDown size={15} /> : <ChevronRight size={15} />)}
                    {r.is_super && <Shield size={15} className="text-[var(--color-brass-deep)]" />}
                    <span className="font-[var(--font-display)] text-[18px]">{r.name}</span>
                    <span className="ml-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
                      {r.user_count} {r.user_count === 1 ? "utente" : "utenti"} ·{" "}
                      {r.is_super ? "tutti i permessi" : `${r.permissions.length} permessi`}
                    </span>
                  </button>
                  {!r.is_super && (
                    <button
                      type="button"
                      onClick={() => removeRole(r)}
                      className="rounded p-1 text-[var(--color-terra)] hover:bg-white"
                      title="Elimina ruolo"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </header>

                {open && !r.is_super && (
                  <div className="space-y-5 p-5">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label="Nome ruolo">
                        <Input value={r.name} onChange={(e) => updateRoleField(r.id, { name: e.target.value })} />
                      </Field>
                      <Field label="Descrizione">
                        <Input value={r.description} onChange={(e) => updateRoleField(r.id, { description: e.target.value })} />
                      </Field>
                    </div>
                    <PermissionsCheckboxes
                      groups={groupedPerms}
                      selected={r.permissions}
                      onToggle={(k) =>
                        updateRoleField(r.id, { permissions: togglePerm(r.permissions, k) })
                      }
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => saveRole(r)}
                        className="bg-[var(--color-ink)] px-5 py-2 font-[var(--font-mono)] text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)]"
                      >
                        Salva ruolo
                      </button>
                    </div>
                  </div>
                )}

                {r.is_super && (
                  <div className="bg-[var(--color-cream-soft)] px-5 py-4 text-[12.5px] text-[var(--color-ink-mute)]">
                    Il ruolo Superadmin ha automaticamente tutti i permessi disponibili
                    (esistenti e futuri). Non è modificabile né eliminabile.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FormSection>

      <FormSection title="Crea nuovo ruolo">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nome" required>
            <Input
              value={adding.name}
              onChange={(e) => setAdding({ ...adding, name: e.target.value })}
              placeholder="es. Editor menu"
            />
          </Field>
          <Field label="Descrizione (opzionale)">
            <Input
              value={adding.description}
              onChange={(e) => setAdding({ ...adding, description: e.target.value })}
              placeholder="Cosa può fare questo ruolo"
            />
          </Field>
        </div>
        <PermissionsCheckboxes
          groups={groupedPerms}
          selected={adding.permissions}
          onToggle={(k) => setAdding({ ...adding, permissions: togglePerm(adding.permissions, k) })}
        />
        <div className="flex justify-end">
          <button
            type="button"
            onClick={addRole}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[var(--color-brass)] px-5 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60"
          >
            <Plus size={14} /> {submitting ? "Creazione…" : "Crea ruolo"}
          </button>
        </div>
      </FormSection>
    </div>
  );
}

function PermissionsCheckboxes({
  groups,
  selected,
  onToggle,
}: {
  groups: Record<string, PermissionDef[]>;
  selected: string[];
  onToggle: (key: string) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(groups).map(([group, perms]) => (
        <div key={group}>
          <h4 className="mb-2 font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
            {group}
          </h4>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            {perms.map((p) => {
              const checked = selected.includes(p.key);
              return (
                <label
                  key={p.key}
                  className={`flex items-start gap-3 cursor-pointer border p-3 transition-colors ${
                    checked
                      ? "border-[var(--color-brass)] bg-[var(--color-brass)]/5"
                      : "border-[var(--color-line)] bg-white hover:border-[var(--color-brass)]/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-0.5"
                    checked={checked}
                    onChange={() => onToggle(p.key)}
                  />
                  <span>
                    <span className="block text-[13.5px] font-medium text-[var(--color-ink)]">
                      {p.label}
                    </span>
                    <span className="block text-[12px] text-[var(--color-ink-mute)]">
                      {p.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
