import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { GalleryFull } from "@/components/gallery-full";

export const metadata: Metadata = {
  title: "Galleria",
  description:
    "Foto di Maison Sabor: lo spazio, le persone, i dettagli. Civitanova Marche.",
};

export default function GalleriaPage() {
  return (
    <>
      <PageHeader
        n=".03"
        kicker="Galleria"
        title={["Lo spazio,", "i", "dettagli, le persone."]}
        accent="i"
        sub="Una raccolta di scatti che raccontano la vita quotidiana di Maison Sabor. Ogni foto è un momento, ogni momento è un piccolo racconto."
        photos={[
          "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
          "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85",
        ]}
      />
      <main id="main">
        <GalleryFull />
      </main>
    </>
  );
}
