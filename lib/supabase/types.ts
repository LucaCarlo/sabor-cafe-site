export type MediaRow = {
  id: string;
  file_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  width: number | null;
  height: number | null;
  size_bytes: number | null;
  alt: string;
  created_at: string;
};

export type SettingsRow = {
  id: number;
  brand_primary: string;
  brand_secondary: string;
  brand_full: string;
  meta_year: string;
  edition_label: string;
  description: string;
  instagram_url: string;
  instagram_handle: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hours_weekday: string;
  hours_weekend: string;
  hours_kitchen: string;
  hours_weekday_label: string;
  hours_weekend_label: string;
  hours_kitchen_label: string;
  open_hour: number;
  close_hour: number;
  price_range: string;
  serves_cuisine: string;
  coords_lat: number;
  coords_lng: number;
  coords_label: string;
  site_url: string;
  logo_media_id: string | null;
  og_image_media_id: string | null;
  reservation_label: string;
  reservation_href: string;
};

export type SettingsView = SettingsRow & {
  logo_url: string | null;
  og_image_url: string | null;
};

export type HeroRow = {
  id: number;
  kicker_left: string;
  kicker_right: string;
  title_line1_before: string;
  title_accent: string;
  title_line1_after: string;
  title_line2: string;
  lead: string;
  image_media_id: string | null;
  image_url_fallback: string;
  image_alt: string;
  cta_primary_label: string;
  cta_primary_href: string;
  cta_secondary_label: string;
  cta_secondary_href: string;
  badge_label: string;
};

export type ManifestoPillar = {
  icon: "Coffee" | "Utensils" | "Wine" | "Leaf" | "Star" | "Heart";
  title: string;
  body: string;
};

export type ManifestoRow = {
  id: number;
  kicker: string;
  title_before: string;
  title_accent: string;
  title_after: string;
  lead: string;
  secondary: string;
  image_media_id: string | null;
  image_url_fallback: string;
  image_alt: string;
  image_caption: string;
  pillars: ManifestoPillar[];
};

export type CartaSectionRow = {
  id: number;
  kicker: string;
  title_before: string;
  title_accent: string;
  title_after: string;
  cta_label: string;
  cta_href: string;
};

export type MenuCategoryRow = {
  id: string;
  slug: string;
  label: string;
  sub: string;
  headline: string;
  image_media_id: string | null;
  image_url_fallback: string;
  show_on_homepage: boolean;
  show_on_menu: boolean;
  position: number;
  created_at: string;
};

export type MenuItemRow = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  position: number;
  show_on_homepage: boolean;
  show_on_menu: boolean;
  created_at: string;
};

export type GiornataSectionRow = {
  id: number;
  kicker: string;
  title_before: string;
  title_accent: string;
  title_after: string;
};

export type GiornataMomentRow = {
  id: string;
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

export type EventiSectionRow = {
  id: number;
  kicker: string;
  title_before: string;
  title_accent: string;
  title_after: string;
  lead: string;
  cta_label: string;
  cta_href: string;
};

export type EventoRow = {
  id: string;
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

export type VisitaRow = {
  id: number;
  kicker: string;
  title_before: string;
  title_accent: string;
  title_after: string;
  lead: string;
  cta_label: string;
  cta_href: string;
  panel_label: string;
  phone_label: string;
  phone_href: string;
};

export type GalleryCategoryRow = {
  id: string;
  name: string;
  position: number;
};

export type GalleryItemRow = {
  id: string;
  image_media_id: string | null;
  image_url_fallback: string;
  alt: string;
  category_id: string | null;
  size: "sq" | "tall" | "wide";
  position: number;
};

export type PageMetaRow = {
  slug: string;
  title: string;
  description: string;
  og_image_media_id: string | null;
  header_kicker: string;
  header_number: string;
  header_title_before: string;
  header_title_accent: string;
  header_title_after: string;
  header_sub: string;
  header_photos: string[];
};

// Helper: combine media URL or fallback URL
export function imgUrlOf<T extends { image_media_id?: string | null; image_url_fallback?: string | null }>(
  row: T,
  mediaUrl?: string | null,
): string {
  return mediaUrl || row.image_url_fallback || "";
}
