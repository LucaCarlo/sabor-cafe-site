import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return adminEmails().includes(email.toLowerCase());
}

/**
 * Server-side guard for /admin routes.
 * Redirects to /admin/login if not authenticated or not whitelisted.
 */
export async function requireAdmin() {
  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user || !isAdminEmail(data.user.email)) {
    redirect("/admin/login");
  }
  return data.user;
}

/** Returns the current admin user or null (no redirect). */
export async function currentAdmin() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user || !isAdminEmail(data.user.email)) return null;
  return data.user;
}
