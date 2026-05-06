"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/admin/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";

const str = (fd: FormData, k: string, def = "") => String(fd.get(k) ?? def);
const num = (fd: FormData, k: string, def = 0) => {
  const v = fd.get(k);
  if (v === null || v === "") return def;
  const n = Number(v);
  return Number.isFinite(n) ? n : def;
};
const idOrNull = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").trim();
  return v ? v : null;
};

export async function saveSettings(formData: FormData) {
  await requirePermission("settings.edit");
  const sb = supabaseAdmin();

  const payload = {
    brand_primary: str(formData, "brand_primary", "Maison"),
    brand_secondary: str(formData, "brand_secondary", "Sabor"),
    brand_full: str(formData, "brand_full", "Sabor Cafè"),
    meta_year: str(formData, "meta_year", "MMXXVI"),
    edition_label: str(formData, "edition_label", "Édition 2026"),
    description: str(formData, "description"),
    instagram_url: str(formData, "instagram_url"),
    instagram_handle: str(formData, "instagram_handle"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    address: str(formData, "address"),
    city: str(formData, "city"),
    country: str(formData, "country", "IT"),
    site_url: str(formData, "site_url"),
    hours_weekday: str(formData, "hours_weekday"),
    hours_weekend: str(formData, "hours_weekend"),
    hours_kitchen: str(formData, "hours_kitchen"),
    hours_weekday_label: str(formData, "hours_weekday_label"),
    hours_weekend_label: str(formData, "hours_weekend_label"),
    hours_kitchen_label: str(formData, "hours_kitchen_label"),
    open_hour: num(formData, "open_hour", 7),
    close_hour: num(formData, "close_hour", 23),
    price_range: str(formData, "price_range", "€€"),
    serves_cuisine: str(formData, "serves_cuisine"),
    coords_lat: num(formData, "coords_lat", 43.3),
    coords_lng: num(formData, "coords_lng", 13.72),
    coords_label: str(formData, "coords_label"),
    logo_media_id: idOrNull(formData, "logo_media_id"),
    og_image_media_id: idOrNull(formData, "og_image_media_id"),
    reservation_label: str(formData, "reservation_label", "Riserva un tavolo"),
    reservation_href: str(formData, "reservation_href", "/contatti"),
  };

  const { error } = await sb.from("settings").update(payload).eq("id", 1);
  if (error) {
    redirect("/admin/settings?err=" + encodeURIComponent(error.message));
  }
  revalidatePath("/", "layout");
  redirect("/admin/settings?ok=" + encodeURIComponent("Impostazioni salvate"));
}
