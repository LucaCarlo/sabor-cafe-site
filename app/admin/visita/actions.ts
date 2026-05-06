"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);

export async function saveVisita(formData: FormData) {
  await requireAdmin();
  const sb = supabaseAdmin();
  const payload = {
    kicker: str(formData, "kicker"),
    title_before: str(formData, "title_before"),
    title_accent: str(formData, "title_accent"),
    title_after: str(formData, "title_after"),
    lead: str(formData, "lead"),
    cta_label: str(formData, "cta_label"),
    cta_href: str(formData, "cta_href"),
    panel_label: str(formData, "panel_label"),
    phone_label: str(formData, "phone_label"),
    phone_href: str(formData, "phone_href"),
  };
  const { error } = await sb.from("visita").update(payload).eq("id", 1);
  if (error) redirect("/admin/visita?err=" + encodeURIComponent(error.message));
  revalidatePath("/");
  redirect("/admin/visita?ok=" + encodeURIComponent("Salvato"));
}
