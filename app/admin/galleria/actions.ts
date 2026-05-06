"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type GalleryCategoryInput = {
  id?: string;
  name: string;
  position: number;
};

export type GalleryItemInput = {
  id?: string;
  image_media_id: string | null;
  image_url_fallback: string;
  alt: string;
  category_id: string | null;
  size: "sq" | "tall" | "wide";
  position: number;
};

export async function saveGalleryCategories(items: GalleryCategoryInput[]) {
  await requireAdmin();
  const sb = supabaseAdmin();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const data = { ...it, position: i + 1 };
    if (it.id) {
      const { id, ...patch } = data;
      void id;
      const { error } = await sb.from("gallery_categories").update(patch).eq("id", it.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { id: _id, ...insertData } = data;
      void _id;
      const { error } = await sb.from("gallery_categories").insert(insertData);
      if (error) return { ok: false as const, error: error.message };
    }
  }
  revalidatePath("/galleria");
  return { ok: true as const };
}

export async function addGalleryCategory(name: string) {
  await requireAdmin();
  if (!name.trim()) return { ok: false as const, error: "Nome obbligatorio" };
  const sb = supabaseAdmin();
  const { data: max } = await sb
    .from("gallery_categories")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (max?.position ?? 0) + 1;
  const { data, error } = await sb
    .from("gallery_categories")
    .insert({ name: name.trim(), position: next })
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/galleria");
  return { ok: true as const, category: data };
}

export async function deleteGalleryCategory(id: string) {
  await requireAdmin();
  const sb = supabaseAdmin();
  const { error } = await sb.from("gallery_categories").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/galleria");
  return { ok: true as const };
}

export async function saveGalleryItems(items: GalleryItemInput[]) {
  await requireAdmin();
  const sb = supabaseAdmin();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const data = { ...it, position: i + 1 };
    if (it.id) {
      const { id, ...patch } = data;
      void id;
      const { error } = await sb.from("gallery_items").update(patch).eq("id", it.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { id: _id, ...insertData } = data;
      void _id;
      const { error } = await sb.from("gallery_items").insert(insertData);
      if (error) return { ok: false as const, error: error.message };
    }
  }
  revalidatePath("/galleria");
  return { ok: true as const };
}

export async function addGalleryItem() {
  await requireAdmin();
  const sb = supabaseAdmin();
  const { data: max } = await sb
    .from("gallery_items")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (max?.position ?? 0) + 1;
  const { data, error } = await sb
    .from("gallery_items")
    .insert({
      alt: "",
      size: "sq",
      position: next,
    })
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/galleria");
  return { ok: true as const, item: data };
}

export async function deleteGalleryItem(id: string) {
  await requireAdmin();
  const sb = supabaseAdmin();
  const { error } = await sb.from("gallery_items").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/galleria");
  return { ok: true as const };
}
