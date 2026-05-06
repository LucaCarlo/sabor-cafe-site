import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { MenuFull } from "@/components/menu-full";
import { getMenuCategories, getPageMeta } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("menu");
  return {
    title: meta?.title || "Carta",
    description:
      meta?.description ||
      "La carta completa di Sabor Cafè: caffè, cucina, aperitivo, pasticceria. Civitanova Marche.",
  };
}

export default async function MenuPage() {
  const [categories, meta] = await Promise.all([
    getMenuCategories({ onMenuOnly: true }),
    getPageMeta("menu"),
  ]);

  const sections =
    categories.map((c) => ({
      cat: c.label,
      sub: c.sub,
      items: c.items.map((it) => ({ n: it.name, d: it.description, p: it.price })),
    }));

  return (
    <>
      <PageHeader
        n={meta?.header_number || ".02"}
        kicker={meta?.header_kicker || "La carta"}
        title={[
          meta?.header_title_before || "Quattro capitoli,",
          meta?.header_title_accent || "una",
          meta?.header_title_after || "sola idea.",
        ]}
        accent={meta?.header_title_accent || "una"}
        sub={
          meta?.header_sub ||
          "La nostra carta cambia con la stagione. Quello che trovi qui è la selezione attuale."
        }
        photos={
          meta?.header_photos && meta.header_photos.length
            ? meta.header_photos
            : [
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85",
              ]
        }
      />
      <main id="main">
        <MenuFull sections={sections.length ? sections : undefined} />
      </main>
    </>
  );
}
