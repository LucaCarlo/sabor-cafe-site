"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ALL_PERMISSION_KEYS } from "@/lib/admin/permissions";

export type AddRoleInput = {
  name: string;
  description: string;
  permissions: string[];
};

export type UpdateRoleInput = {
  id: string;
  name: string;
  description: string;
  permissions: string[];
};

const validKeys = (keys: string[]) =>
  keys.filter((k) => (ALL_PERMISSION_KEYS as readonly string[]).includes(k));

export async function addRole(input: AddRoleInput) {
  await requirePermission("roles.manage");
  if (!input.name.trim()) return { ok: false as const, error: "Nome obbligatorio" };

  const sb = supabaseAdmin();
  const { data: created, error } = await sb
    .from("roles")
    .insert({ name: input.name.trim(), description: input.description, is_super: false })
    .select("id")
    .single();
  if (error || !created) return { ok: false as const, error: error?.message ?? "Errore" };

  const perms = validKeys(input.permissions);
  if (perms.length) {
    const rows = perms.map((permission_key) => ({ role_id: created.id, permission_key }));
    const { error: pErr } = await sb.from("role_permissions").insert(rows);
    if (pErr) return { ok: false as const, error: pErr.message };
  }

  revalidatePath("/admin/roles");
  return { ok: true as const, role_id: created.id };
}

export async function updateRole(input: UpdateRoleInput) {
  await requirePermission("roles.manage");
  const sb = supabaseAdmin();

  // Verify it's not a Superadmin role (can't modify)
  const { data: role } = await sb
    .from("roles")
    .select("is_super")
    .eq("id", input.id)
    .maybeSingle();
  if (!role) return { ok: false as const, error: "Ruolo non trovato" };
  if ((role as { is_super: boolean }).is_super) {
    return { ok: false as const, error: "Il Superadmin ha sempre tutti i permessi e non si modifica" };
  }

  const { error: upErr } = await sb
    .from("roles")
    .update({ name: input.name.trim(), description: input.description })
    .eq("id", input.id);
  if (upErr) return { ok: false as const, error: upErr.message };

  // Replace permissions atomically (delete all + insert new)
  await sb.from("role_permissions").delete().eq("role_id", input.id);
  const perms = validKeys(input.permissions);
  if (perms.length) {
    const rows = perms.map((permission_key) => ({ role_id: input.id, permission_key }));
    const { error: pErr } = await sb.from("role_permissions").insert(rows);
    if (pErr) return { ok: false as const, error: pErr.message };
  }

  revalidatePath("/admin/roles");
  return { ok: true as const };
}

export async function deleteRole(id: string) {
  await requirePermission("roles.manage");
  const sb = supabaseAdmin();

  const { data: role } = await sb
    .from("roles")
    .select("is_super, name")
    .eq("id", id)
    .maybeSingle();
  if (!role) return { ok: false as const, error: "Ruolo non trovato" };
  if ((role as { is_super: boolean }).is_super) {
    return { ok: false as const, error: "Il Superadmin non può essere eliminato" };
  }

  // Block delete if any user has this role
  const { count } = await sb
    .from("app_users")
    .select("*", { count: "exact", head: true })
    .eq("role_id", id);
  if ((count ?? 0) > 0) {
    return {
      ok: false as const,
      error: `Ci sono ${count} utenti con questo ruolo. Riassegnali prima di eliminare.`,
    };
  }

  const { error } = await sb.from("roles").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/roles");
  return { ok: true as const };
}
