"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);
const idOrNull = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v ? v : null;
};

export async function saveHero(formData: FormData) {
  await requireAdmin();
  const sb = supabaseAdmin();
  const payload = {
    kicker_left: str(formData, "kicker_left"),
    kicker_right: str(formData, "kicker_right"),
    title_line1_before: str(formData, "title_line1_before"),
    title_accent: str(formData, "title_accent"),
    title_line1_after: str(formData, "title_line1_after"),
    title_line2: str(formData, "title_line2"),
    lead: str(formData, "lead"),
    image_media_id: idOrNull(formData, "image_media_id"),
    image_url_fallback: str(formData, "image_url_fallback"),
    image_alt: str(formData, "image_alt"),
    cta_primary_label: str(formData, "cta_primary_label"),
    cta_primary_href: str(formData, "cta_primary_href"),
    cta_secondary_label: str(formData, "cta_secondary_label"),
    cta_secondary_href: str(formData, "cta_secondary_href"),
    badge_label: str(formData, "badge_label"),
  };
  const { error } = await sb.from("hero").update(payload).eq("id", 1);
  if (error) redirect("/admin/hero?err=" + encodeURIComponent(error.message));
  revalidatePath("/");
  redirect("/admin/hero?ok=" + encodeURIComponent("Hero aggiornato"));
}
