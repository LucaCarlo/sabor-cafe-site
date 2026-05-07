"use server";

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirect") ?? "/admin") || "/admin";

  if (!email || !password) {
    redirect("/admin/login?err=" + encodeURIComponent("Email e password obbligatorie."));
  }

  const supabase = await supabaseServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(
      "/admin/login?err=" +
        encodeURIComponent("Credenziali non valide. " + error.message),
    );
  }

  redirect(redirectTo);
}
