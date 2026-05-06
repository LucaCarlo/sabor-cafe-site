"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);
const idOrNull = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v ? v : null;
};

export async function saveManifesto(formData: FormData) {
  await requirePermission("manifesto.edit");
  const sb = supabaseAdmin();
  const pillars = [0, 1, 2].map((i) => ({
    icon: str(formData, `pillar_${i}_icon`, "Coffee"),
    title: str(formData, `pillar_${i}_title`),
    body: str(formData, `pillar_${i}_body`),
  }));

  const payload = {
    kicker: str(formData, "kicker"),
    title_before: str(formData, "title_before"),
    title_accent: str(formData, "title_accent"),
    title_after: str(formData, "title_after"),
    lead: str(formData, "lead"),
    secondary: str(formData, "secondary"),
    image_media_id: idOrNull(formData, "image_media_id"),
    image_url_fallback: str(formData, "image_url_fallback"),
    image_alt: str(formData, "image_alt"),
    image_caption: str(formData, "image_caption"),
    pillars,
  };
  const { error } = await sb.from("manifesto").update(payload).eq("id", 1);
  if (error) redirect("/admin/manifesto?err=" + encodeURIComponent(error.message));
  revalidatePath("/");
  redirect("/admin/manifesto?ok=" + encodeURIComponent("Manifesto aggiornato"));
}
