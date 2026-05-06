import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { GalleryFull } from "@/components/gallery-full";
import { getGalleryCategories, getGalleryItems, getPageMeta } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("galleria");
  return {
    title: meta?.title || "Galleria",
    description:
      meta?.description ||
      "Foto di Maison Sabor: lo spazio, le persone, i dettagli. Civitanova Marche.",
  };
}

export default async function GalleriaPage() {
  const [items, categories, meta] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
    getPageMeta("galleria"),
  ]);

  const photos = items
    .filter((it) => it.image_url || it.image_url_fallback)
    .map((it) => ({
      src: (it.image_url || it.image_url_fallback) as string,
      alt: it.alt,
      cat: it.category_name ?? "Tutto",
      size: it.size,
    }));

  return (
    <>
      <PageHeader
        n={meta?.header_number || ".03"}
        kicker={meta?.header_kicker || "Galleria"}
        title={[
          meta?.header_title_before || "Lo spazio,",
          meta?.header_title_accent || "i",
          meta?.header_title_after || "dettagli, le persone.",
        ]}
        accent={meta?.header_title_accent || "i"}
        sub={
          meta?.header_sub ||
          "Una raccolta di scatti che raccontano la vita quotidiana di Maison Sabor."
        }
        photos={
          meta?.header_photos && meta.header_photos.length
            ? meta.header_photos
            : [
                "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85",
              ]
        }
      />
      <main id="main">
        <GalleryFull
          photos={photos.length ? photos : undefined}
          categories={categories.map((c) => c.name)}
        />
      </main>
    </>
  );
}
