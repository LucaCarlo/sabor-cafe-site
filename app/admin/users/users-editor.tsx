"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Field, FormSection, Input, Select } from "@/components/admin/field";
import type { AddUserInput, UpdateUserInput } from "./actions";

type UserRow = {
  user_id: string;
  email: string;
  display_name: string;
  role_id: string | null;
  role_name: string;
  created_at: string;
};

type RoleRow = { id: string; name: string; is_super: boolean };

export function UsersEditor({
  users,
  roles,
  currentUserId,
  onAdd,
  onUpdate,
  onDelete,
}: {
  users: UserRow[];
  roles: RoleRow[];
  currentUserId: string;
  onAdd: (input: AddUserInput) => Promise<{ ok: boolean; error?: string }>;
  onUpdate: (input: UpdateUserInput) => Promise<{ ok: boolean; error?: string }>;
  onDelete: (userId: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [list, setList] = useState<UserRow[]>(users);
  const [adding, setAdding] = useState({
    email: "",
    password: "",
    display_name: "",
    role_id: roles[0]?.id ?? "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [edit, setEdit] = useState<Record<string, { display_name: string; role_id: string; new_password: string }>>(
    Object.fromEntries(
      users.map((u) => [
        u.user_id,
        { display_name: u.display_name, role_id: u.role_id ?? "", new_password: "" },
      ]),
    ),
  );

  const setField = (id: string, k: "display_name" | "role_id" | "new_password", v: string) =>
    setEdit((prev) => ({ ...prev, [id]: { ...prev[id], [k]: v } }));

  const add = async () => {
    setSubmitting(true);
    try {
      const r = await onAdd(adding);
      if (!r.ok) {
        toast.error(r.error ?? "Errore");
        return;
      }
      toast.success("Utente creato. Ricarica la pagina per vederlo in lista.");
      setAdding({ email: "", password: "", display_name: "", role_id: roles[0]?.id ?? "" });
      // We'd need re-fetch — simplest: hard reload
      window.location.reload();
    } finally {
      setSubmitting(false);
    }
  };

  const save = async (u: UserRow) => {
    const e = edit[u.user_id];
    const r = await onUpdate({
      user_id: u.user_id,
      display_name: e.display_name,
      role_id: e.role_id,
      new_password: e.new_password || undefined,
    });
    if (!r.ok) return toast.error(r.error ?? "Errore");
    toast.success("Utente aggiornato");
    if (e.new_password) setField(u.user_id, "new_password", "");
    setList((prev) =>
      prev.map((x) =>
        x.user_id === u.user_id
          ? { ...x, display_name: e.display_name, role_id: e.role_id, role_name: roles.find((r) => r.id === e.role_id)?.name ?? x.role_name }
          : x,
      ),
    );
  };

  const remove = async (u: UserRow) => {
    if (u.user_id === currentUserId) return toast.error("Non puoi eliminare te stesso");
    if (!confirm(`Eliminare l'utente ${u.email}? L'azione è irreversibile.`)) return;
    const r = await onDelete(u.user_id);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    setList((prev) => prev.filter((x) => x.user_id !== u.user_id));
    toast.success("Utente eliminato");
  };

  return (
    <div className="space-y-8">
      <FormSection title="Aggiungi nuovo utente">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Email" required>
            <Input
              type="email"
              value={adding.email}
              onChange={(e) => setAdding({ ...adding, email: e.target.value })}
              placeholder="nuovo@email.com"
            />
          </Field>
          <Field label="Nome visualizzato">
            <Input
              value={adding.display_name}
              onChange={(e) => setAdding({ ...adding, display_name: e.target.value })}
              placeholder="Mario Rossi"
            />
          </Field>
          <Field label="Password (min 8)" required>
            <Input
              type="password"
              value={adding.password}
              onChange={(e) => setAdding({ ...adding, password: e.target.value })}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </Field>
          <Field label="Ruolo" required>
            <Select
              value={adding.role_id}
              onChange={(e) => setAdding({ ...adding, role_id: e.target.value })}
            >
              <option value="">— scegli un ruolo —</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}{r.is_super ? " (super)" : ""}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={add}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[var(--color-brass)] px-5 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60"
          >
            <Plus size={14} /> {submitting ? "Creazione…" : "Crea utente"}
          </button>
        </div>
      </FormSection>

      <FormSection title={`Utenti esistenti (${list.length})`}>
        <div className="space-y-3">
          {list.map((u) => {
            const me = u.user_id === currentUserId;
            const e = edit[u.user_id] ?? { display_name: u.display_name, role_id: u.role_id ?? "", new_password: "" };
            return (
              <div
                key={u.user_id}
                className="grid grid-cols-1 items-end gap-3 border border-[var(--color-line)] bg-white p-4 md:grid-cols-[2fr_1.5fr_1.5fr_1.5fr_auto]"
              >
                <div>
                  <span className="block text-[14px] font-medium text-[var(--color-ink)]">
                    {u.email} {me && <span className="ml-1 text-[11px] text-[var(--color-brass-deep)]">(tu)</span>}
                  </span>
                  <span className="block text-[11px] text-[var(--color-ink-mute)]">
                    Creato il {new Date(u.created_at).toLocaleDateString("it-IT")}
                  </span>
                </div>
                <Field label="Nome visualizzato">
                  <Input
                    value={e.display_name}
                    onChange={(ev) => setField(u.user_id, "display_name", ev.target.value)}
                  />
                </Field>
                <Field label="Ruolo">
                  <Select
                    value={e.role_id}
                    onChange={(ev) => setField(u.user_id, "role_id", ev.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Nuova password (opzionale)">
                  <Input
                    type="password"
                    value={e.new_password}
                    onChange={(ev) => setField(u.user_id, "new_password", ev.target.value)}
                    placeholder="lascia vuoto per non cambiare"
                    autoComplete="new-password"
                  />
                </Field>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => save(u)}
                    className="bg-[var(--color-ink)] px-4 py-2 font-[var(--font-mono)] text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)]"
                  >
                    Salva
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(u)}
                    disabled={me}
                    className="inline-flex items-center gap-1 text-[11px] text-[var(--color-terra)] hover:underline disabled:opacity-40 disabled:no-underline"
                    title={me ? "Non puoi eliminare te stesso" : "Elimina"}
                  >
                    <Trash2 size={12} /> Elimina
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </FormSection>
    </div>
  );
}
