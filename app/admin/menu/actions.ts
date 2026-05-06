"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);

export async function saveCartaSection(formData: FormData) {
  await requirePermission("menu.edit");
  const sb = supabaseAdmin();
  const { error } = await sb
    .from("carta_section")
    .update({
      kicker: str(formData, "kicker"),
      title_before: str(formData, "title_before"),
      title_accent: str(formData, "title_accent"),
      title_after: str(formData, "title_after"),
      cta_label: str(formData, "cta_label"),
      cta_href: str(formData, "cta_href"),
    })
    .eq("id", 1);
  if (error) redirect("/admin/menu?err=" + encodeURIComponent(error.message));
  revalidatePath("/");
  redirect("/admin/menu?ok=" + encodeURIComponent("Sezione aggiornata"));
}

export type CategoryInput = {
  id?: string;
  slug: string;
  label: string;
  sub: string;
  headline: string;
  image_media_id: string | null;
  image_url_fallback: string;
  show_on_homepage: boolean;
  show_on_menu: boolean;
  position: number;
};

export type ItemInput = {
  id?: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  position: number;
  show_on_homepage: boolean;
  show_on_menu: boolean;
};

export async function saveCategories(items: CategoryInput[]) {
  await requirePermission("menu.edit");
  const sb = supabaseAdmin();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const data = { ...it, position: i + 1 };
    if (it.id) {
      const { id, ...patch } = data;
      void id;
      const { error } = await sb.from("menu_categories").update(patch).eq("id", it.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { id: _id, ...insertData } = data;
      void _id;
      const { error } = await sb.from("menu_categories").insert(insertData);
      if (error) return { ok: false as const, error: error.message };
    }
  }
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true as const };
}

export async function addCategory(slug: string, label: string) {
  await requirePermission("menu.edit");
  if (!slug.trim() || !label.trim())
    return { ok: false as const, error: "Slug ed etichetta obbligatori" };
  const sb = supabaseAdmin();
  const { data: max } = await sb
    .from("menu_categories")
    .select("position")
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (max?.position ?? 0) + 1;
  const { data, error } = await sb
    .from("menu_categories")
    .insert({
      slug: slug.trim(),
      label: label.trim(),
      sub: "",
      headline: "",
      show_on_homepage: true,
      show_on_menu: true,
      position: next,
    })
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true as const, category: data };
}

export async function deleteCategory(id: string) {
  await requirePermission("menu.edit");
  const sb = supabaseAdmin();
  const { error } = await sb.from("menu_categories").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true as const };
}

export async function saveItems(items: ItemInput[]) {
  await requirePermission("menu.edit");
  const sb = supabaseAdmin();
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    const data = { ...it, position: i + 1 };
    if (it.id) {
      const { id, ...patch } = data;
      void id;
      const { error } = await sb.from("menu_items").update(patch).eq("id", it.id);
      if (error) return { ok: false as const, error: error.message };
    } else {
      const { id: _id, ...insertData } = data;
      void _id;
      const { error } = await sb.from("menu_items").insert(insertData);
      if (error) return { ok: false as const, error: error.message };
    }
  }
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true as const };
}

export async function addItem(categoryId: string) {
  await requirePermission("menu.edit");
  const sb = supabaseAdmin();
  const { data: max } = await sb
    .from("menu_items")
    .select("position")
    .eq("category_id", categoryId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (max?.position ?? 0) + 1;
  const { data, error } = await sb
    .from("menu_items")
    .insert({
      category_id: categoryId,
      name: "Nuova voce",
      description: "",
      price: "",
      position: next,
      show_on_homepage: true,
      show_on_menu: true,
    })
    .select("*")
    .single();
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true as const, item: data };
}

export async function deleteItem(id: string) {
  await requirePermission("menu.edit");
  const sb = supabaseAdmin();
  const { error } = await sb.from("menu_items").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };
  revalidatePath("/");
  revalidatePath("/menu");
  return { ok: true as const };
}
