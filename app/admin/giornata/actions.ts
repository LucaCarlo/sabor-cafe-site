"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);

export async function saveGiornataSection(formData: FormData) {
  await requirePermission("giornata.edit");
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("giornata_section")
    .update({
      kicker: str(formData, "kicker"),
      title_before: str(formData, "title_before"),
      title_accent: str(formData, "title_accent"),
      title_after: str(formData, "title_after"),
    })
    .eq("id", 1);
  if (error) redirect("/admin/giornata?err=" + encodeURIComponent(error.message));
  revalidatePath("/");
  redirect("/admin/giornata?ok=" + encodeURIComponent("Sezione aggiornata"));
}

type MomentInput = {
  id?: string;
  slug: string;
  time_label: string;
  label: string;
  title: string;
  body: string;
  note: string;
  image_media_id: string | null;
  image_url_fallback: string;
  position: number;
};

export async function saveMoments(items: MomentInput[]) {
  await requirePermission("giornata.edit");
  const sb = supabaseAdmin();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const data = { ...it, position: i + 1 };
    if (it.id) {
      const { id, ...patch } = data;
      void id;
      const { error } = await sb.from("giornata_moments").update(patch).eq("id", it.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { id: _id, ...insertData } = data;
      void _id;
      const { error } = await sb.from("giornata_moments").insert(insertData);
      if (error) return { ok: false as const, error: error.message };
    }
  }
  revalidatePath("/");
  return { ok: true as const };
}

export async function addMoment(slug: string) {
  await requirePermission("giornata.edit");
  if (!slug.trim()) return { ok: false as const, error: "Slug obbligatorio" };
  const sb = supabaseAdmin();
  const { data: max } = await sb
    .from("giornata_moments")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (max?.position ?? 0) + 1;
  const { data, error } = await sb
    .from("giornata_moments")
    .insert({
      slug: slug.trim(),
      time_label: "00:00",
      label: "Nuovo momento",
      title: "Titolo",
      body: "Descrizione",
      note: "Voce 1 · Voce 2",
      position: next,
    })
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const, moment: data };
}

export async function deleteMoment(id: string) {
  await requirePermission("giornata.edit");
  const sb = supabaseAdmin();
  const { error } = await sb.from("giornata_moments").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}
