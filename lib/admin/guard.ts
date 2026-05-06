import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PermissionKey } from "@/lib/admin/permissions";
import { ALL_PERMISSION_KEYS } from "@/lib/admin/permissions";

export type AdminUser = {
  id: string;
  email: string;
  display_name: string;
  is_super: boolean;
  role_id: string | null;
  role_name: string;
  permissions: PermissionKey[];
};

/** Bootstrap superadmin via env (per evitare lock-out): ADMIN_EMAILS=a@b.com,c@d.com */
function bootstrapSuperEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

function isBootstrapEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return bootstrapSuperEmails().includes(email.toLowerCase());
}

/** Used by the login form to pre-validate the email, no DB call. */
export function isAdminEmail(email: string | null | undefined): boolean {
  // We allow login if email is bootstrap superadmin OR if it has a row in app_users.
  // Pre-login we can only check bootstrap; login itself succeeds via Supabase Auth,
  // and post-login the app_users check happens on the first authenticated request.
  return isBootstrapEmail(email);
}

/**
 * Returns the current admin user (with role + permissions) or null.
 * - Bootstrap emails are treated as Superadmin even if no app_users row exists.
 * - Otherwise must have an app_users row joined to roles.
 */
export async function currentAdmin(): Promise<AdminUser | null> {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const u = data.user;
  const email = (u.email ?? "").toLowerCase();
  const isBootstrap = isBootstrapEmail(email);

  // Look up app_users + role + permissions via service role (RLS off only there)
  const sbAdmin = supabaseAdmin();
  const { data: row } = await sbAdmin
    .from("app_users")
    .select(
      "user_id, display_name, role_id, roles:role_id ( id, name, is_super )",
    )
    .eq("user_id", u.id)
    .maybeSingle();

  type RoleRow = { id: string; name: string; is_super: boolean };
  type AppUserRow = {
    user_id: string;
    display_name: string;
    role_id: string;
    roles: RoleRow | RoleRow[] | null;
  };
  const r = row as AppUserRow | null;
  const roleObj = Array.isArray(r?.roles) ? r?.roles[0] ?? null : r?.roles ?? null;

  if (!r && !isBootstrap) return null; // user is authenticated but not authorized for /admin

  let permissions: PermissionKey[] = [];
  const isSuper = isBootstrap || !!roleObj?.is_super;
  if (isSuper) {
    permissions = [...ALL_PERMISSION_KEYS];
  } else if (roleObj) {
    const { data: perms } = await sbAdmin
      .from("role_permissions")
      .select("permission_key")
      .eq("role_id", roleObj.id);
    permissions = (perms ?? [])
      .map((p) => p.permission_key as PermissionKey)
      .filter((k) => (ALL_PERMISSION_KEYS as readonly string[]).includes(k));
  }

  return {
    id: u.id,
    email,
    display_name: r?.display_name || (u.user_metadata?.display_name as string) || "",
    is_super: isSuper,
    role_id: roleObj?.id ?? null,
    role_name: roleObj?.name ?? (isBootstrap ? "Superadmin (bootstrap)" : ""),
    permissions,
  };
}

/** Redirect to /admin/login if not an admin. */
export async function requireAdmin(): Promise<AdminUser> {
  const me = await currentAdmin();
  if (!me) redirect("/admin/login");
  return me;
}

/** Redirect to /admin if missing required permission. */
export async function requirePermission(key: PermissionKey): Promise<AdminUser> {
  const me = await requireAdmin();
  if (!me.is_super && !me.permissions.includes(key)) {
    redirect("/admin?err=" + encodeURIComponent("Non hai il permesso per questa pagina"));
  }
  return me;
}

export function hasPermission(user: AdminUser | null, key: PermissionKey): boolean {
  if (!user) return false;
  if (user.is_super) return true;
  return user.permissions.includes(key);
}
