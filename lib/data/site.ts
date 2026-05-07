import { supabaseServer } from "@/lib/supabase/server";
import type {
  SettingsView,
  HeroRow,
  ManifestoRow,
  CartaSectionRow,
  MenuCategoryRow,
  MenuItemRow,
  MenuSubcategoryRow,
  GiornataSectionRow,
  GiornataMomentRow,
  EventiSectionRow,
  EventoRow,
  VisitaRow,
  GalleryCategoryRow,
  GalleryItemRow,
  PageMetaRow,
  MediaRow,
} from "@/lib/supabase/types";

// All fetchers are server-only and resilient: if Supabase isn't configured
// or returns no data, they return null and the public components show their
// hardcoded fallback values. The site is never broken.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function safe<T>(p: any): Promise<T | null> {
  try {
    const { data, error } = await p;
    if (error) return null;
    return (data ?? null) as T | null;
  } catch {
    return null;
  }
}

function hasSupabaseEnv(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getSettings(): Promise<SettingsView | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  return safe(sb.from("settings_view").select("*").eq("id", 1).single());
}

export async function getHero(): Promise<(HeroRow & { image_url: string | null }) | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  const row = await safe<HeroRow & { media: { public_url: string } | null }>(
    sb.from("hero").select("*, media:image_media_id(public_url)").eq("id", 1).single() as unknown as Promise<{ data: (HeroRow & { media: { public_url: string } | null }) | null; error: unknown }>,
  );
  if (!row) return null;
  return { ...row, image_url: row.media?.public_url ?? null };
}

export async function getManifesto(): Promise<(ManifestoRow & { image_url: string | null }) | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  const row = await safe<ManifestoRow & { media: { public_url: string } | null }>(
    sb.from("manifesto").select("*, media:image_media_id(public_url)").eq("id", 1).single() as unknown as Promise<{ data: (ManifestoRow & { media: { public_url: string } | null }) | null; error: unknown }>,
  );
  if (!row) return null;
  return { ...row, image_url: row.media?.public_url ?? null };
}

export async function getCartaSection(): Promise<CartaSectionRow | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  return safe(sb.from("carta_section").select("*").eq("id", 1).single());
}

export type MenuCategoryWithItems = MenuCategoryRow & {
  image_url: string | null;
  subcategories: MenuSubcategoryRow[];
  items: MenuItemRow[];
};

export async function getMenuCategories(opts?: { onHomepageOnly?: boolean; onMenuOnly?: boolean }): Promise<MenuCategoryWithItems[]> {
  if (!hasSupabaseEnv()) return [];
  const sb = await supabaseServer();
  let q = sb
    .from("menu_categories")
    .select(
      "*, media:image_media_id(public_url), menu_subcategories(*), menu_items(*)",
    )
    .order("position", { ascending: true });
  if (opts?.onHomepageOnly) q = q.eq("show_on_homepage", true);
  if (opts?.onMenuOnly) q = q.eq("show_on_menu", true);
  const { data, error } = await q;
  if (error || !data) return [];
  return (
    data as Array<
      MenuCategoryRow & {
        media: { public_url: string } | null;
        menu_subcategories: MenuSubcategoryRow[];
        menu_items: MenuItemRow[];
      }
    >
  ).map((c) => {
    const items = (c.menu_items ?? []).slice().sort((a, b) => a.position - b.position);
    const subcategories = (c.menu_subcategories ?? [])
      .slice()
      .sort((a, b) => a.position - b.position);
    return {
      ...c,
      image_url: c.media?.public_url ?? null,
      subcategories,
      items: opts?.onHomepageOnly
        ? items.filter((i) => i.show_on_homepage)
        : opts?.onMenuOnly
          ? items.filter((i) => i.show_on_menu)
          : items,
    };
  });
}

export async function getGiornataSection(): Promise<GiornataSectionRow | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  return safe(sb.from("giornata_section").select("*").eq("id", 1).single());
}

export async function getGiornataMoments(): Promise<Array<GiornataMomentRow & { image_url: string | null }>> {
  if (!hasSupabaseEnv()) return [];
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("giornata_moments")
    .select("*, media:image_media_id(public_url)")
    .order("position", { ascending: true });
  if (error || !data) return [];
  return (data as Array<GiornataMomentRow & { media: { public_url: string } | null }>).map((m) => ({
    ...m,
    image_url: m.media?.public_url ?? null,
  }));
}

export async function getEventiSection(): Promise<EventiSectionRow | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  return safe(sb.from("eventi_section").select("*").eq("id", 1).single());
}

export async function getEventi(): Promise<Array<EventoRow & { image_url: string | null }>> {
  if (!hasSupabaseEnv()) return [];
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("eventi")
    .select("*, media:image_media_id(public_url)")
    .order("position", { ascending: true });
  if (error || !data) return [];
  return (data as Array<EventoRow & { media: { public_url: string } | null }>).map((e) => ({
    ...e,
    image_url: e.media?.public_url ?? null,
  }));
}

export async function getVisita(): Promise<VisitaRow | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  return safe(sb.from("visita").select("*").eq("id", 1).single());
}

export async function getGalleryCategories(): Promise<GalleryCategoryRow[]> {
  if (!hasSupabaseEnv()) return [];
  const sb = await supabaseServer();
  const { data } = await sb
    .from("gallery_categories")
    .select("*")
    .order("position", { ascending: true });
  return data ?? [];
}

export async function getGalleryItems(): Promise<Array<GalleryItemRow & { image_url: string | null; category_name: string | null }>> {
  if (!hasSupabaseEnv()) return [];
  const sb = await supabaseServer();
  const { data, error } = await sb
    .from("gallery_items")
    .select("*, media:image_media_id(public_url), category:category_id(name)")
    .order("position", { ascending: true });
  if (error || !data) return [];
  return (data as Array<GalleryItemRow & { media: { public_url: string } | null; category: { name: string } | null }>).map((g) => ({
    ...g,
    image_url: g.media?.public_url ?? null,
    category_name: g.category?.name ?? null,
  }));
}

export async function getPageMeta(slug: string): Promise<PageMetaRow | null> {
  if (!hasSupabaseEnv()) return null;
  const sb = await supabaseServer();
  return safe(sb.from("page_meta").select("*").eq("slug", slug).single());
}

export async function getAllMedia(): Promise<MediaRow[]> {
  if (!hasSupabaseEnv()) return [];
  const sb = await supabaseServer();
  const { data } = await sb.from("media").select("*").order("created_at", { ascending: false });
  return data ?? [];
}
