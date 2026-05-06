"use server";

import { revalidatePath } from "next/cache";
import { requirePermission, currentAdmin } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AddUserInput = {
  email: string;
  password: string;
  display_name: string;
  role_id: string;
};

export async function addUser(input: AddUserInput) {
  await requirePermission("users.manage");
  const sb = supabaseAdmin();

  if (!input.email || !input.password) {
    return { ok: false as const, error: "Email e password obbligatorie" };
  }
  if (input.password.length < 8) {
    return { ok: false as const, error: "La password deve avere almeno 8 caratteri" };
  }
  if (!input.role_id) {
    return { ok: false as const, error: "Scegli un ruolo" };
  }

  // Verify role exists
  const { data: role } = await sb.from("roles").select("id").eq("id", input.role_id).maybeSingle();
  if (!role) return { ok: false as const, error: "Ruolo non trovato" };

  // Create auth user
  const { data: created, error: authErr } = await sb.auth.admin.createUser({
    email: input.email.trim().toLowerCase(),
    password: input.password,
    email_confirm: true,
    user_metadata: { display_name: input.display_name },
  });
  if (authErr || !created.user) {
    return { ok: false as const, error: authErr?.message ?? "Errore creazione utente auth" };
  }

  // Insert app_users row
  const { error: insErr } = await sb.from("app_users").insert({
    user_id: created.user.id,
    role_id: input.role_id,
    display_name: input.display_name || "",
  });
  if (insErr) {
    // Best-effort cleanup
    await sb.auth.admin.deleteUser(created.user.id);
    return { ok: false as const, error: insErr.message };
  }

  revalidatePath("/admin/users");
  return { ok: true as const };
}

export type UpdateUserInput = {
  user_id: string;
  display_name: string;
  role_id: string;
  new_password?: string;
};

export async function updateUser(input: UpdateUserInput) {
  await requirePermission("users.manage");
  const sb = supabaseAdmin();

  // Update app_users row
  const { error: upErr } = await sb
    .from("app_users")
    .update({ role_id: input.role_id, display_name: input.display_name || "" })
    .eq("user_id", input.user_id);
  if (upErr) return { ok: false as const, error: upErr.message };

  // Optional password reset
  if (input.new_password) {
    if (input.new_password.length < 8) {
      return { ok: false as const, error: "Nuova password troppo corta (min 8)" };
    }
    const { error: pwErr } = await sb.auth.admin.updateUserById(input.user_id, {
      password: input.new_password,
    });
    if (pwErr) return { ok: false as const, error: pwErr.message };
  }

  revalidatePath("/admin/users");
  return { ok: true as const };
}

export async function deleteUser(userId: string) {
  await requirePermission("users.manage");
  const me = await currentAdmin();
  if (me?.id === userId) {
    return { ok: false as const, error: "Non puoi eliminare il tuo stesso account" };
  }
  const sb = supabaseAdmin();

  // Make sure we don't delete the last superadmin
  const { data: target } = await sb
    .from("app_users")
    .select("role_id, roles:role_id(is_super)")
    .eq("user_id", userId)
    .maybeSingle();
  type R = { role_id: string; roles: { is_super: boolean } | null };
  const t = target as unknown as R | null;
  if (t?.roles?.is_super) {
    const { count } = await sb
      .from("app_users")
      .select("*", { count: "exact", head: true })
      .eq("role_id", t.role_id);
    if ((count ?? 0) <= 1) {
      return { ok: false as const, error: "Non puoi eliminare l'unico Superadmin" };
    }
  }

  // Cascade: app_users row deleted via FK on auth.users delete
  const { error } = await sb.auth.admin.deleteUser(userId);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/admin/users");
  return { ok: true as const };
}
