"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);

export async function saveEventiSection(formData: FormData) {
  await requirePermission("eventi.edit");
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("eventi_section")
    .update({
      kicker: str(formData, "kicker"),
      title_before: str(formData, "title_before"),
      title_accent: str(formData, "title_accent"),
      title_after: str(formData, "title_after"),
      lead: str(formData, "lead"),
      cta_label: str(formData, "cta_label"),
      cta_href: str(formData, "cta_href"),
    })
    .eq("id", 1);
  if (error) redirect("/admin/eventi?err=" + encodeURIComponent(error.message));
  revalidatePath("/");
  redirect("/admin/eventi?ok=" + encodeURIComponent("Sezione aggiornata"));
}

export type EventoInput = {
  id?: string;
  number_label: string;
  title: string;
  sub: string;
  body: string;
  image_media_id: string | null;
  image_url_fallback: string;
  cta_label: string;
  cta_href: string;
  position: number;
};

export async function saveEventi(items: EventoInput[]) {
  await requirePermission("eventi.edit");
  const sb = supabaseAdmin();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const data = { ...it, position: i + 1 };
    if (it.id) {
      const { id, ...patch } = data;
      void id;
      const { error } = await sb.from("eventi").update(patch).eq("id", it.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { id: _id, ...insertData } = data;
      void _id;
      const { error } = await sb.from("eventi").insert(insertData);
      if (error) return { ok: false as const, error: error.message };
    }
  }
  revalidatePath("/");
  return { ok: true as const };
}

export async function addEvento() {
  await requirePermission("eventi.edit");
  const sb = supabaseAdmin();
  const { data: max } = await sb
    .from("eventi")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (max?.position ?? 0) + 1;
  const num = String(next).padStart(2, "0");
  const { data, error } = await sb
    .from("eventi")
    .insert({
      number_label: num,
      title: "Nuovo evento",
      sub: "Sottotitolo",
      body: "Descrizione…",
      cta_label: "Richiedi info",
      cta_href: "/contatti",
      position: next,
    })
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const, evento: data };
}

export async function deleteEvento(id: string) {
  await requirePermission("eventi.edit");
  const sb = supabaseAdmin();
  const { error } = await sb.from("eventi").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  return { ok: true as const };
}
