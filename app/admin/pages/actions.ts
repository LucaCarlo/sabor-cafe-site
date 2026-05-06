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

export async function savePageMeta(formData: FormData) {
  await requirePermission("pages.edit");
  const slug = str(formData, "slug");
  if (!slug) redirect("/admin/pages?err=" + encodeURIComponent("slug mancante"));

  const photos: string[] = [];
  for (let i = 0; i < 4; i++) {
    const u = str(formData, `photo_${i}`).trim();
    if (u) photos.push(u);
  }

  const sb = supabaseAdmin();
  const payload = {
    slug,
    title: str(formData, "title"),
    description: str(formData, "description"),
    og_image_media_id: idOrNull(formData, "og_image_media_id"),
    header_kicker: str(formData, "header_kicker"),
    header_number: str(formData, "header_number", ".01"),
    header_title_before: str(formData, "header_title_before"),
    header_title_accent: str(formData, "header_title_accent"),
    header_title_after: str(formData, "header_title_after"),
    header_sub: str(formData, "header_sub"),
    header_photos: photos,
  };

  const { error } = await sb.from("page_meta").upsert(payload, { onConflict: "slug" });
  if (error) redirect(`/admin/pages?slug=${slug}&err=` + encodeURIComponent(error.message));
  revalidatePath(`/${slug}`);
  redirect(`/admin/pages?slug=${slug}&ok=` + encodeURIComponent("Pagina aggiornata"));
}
