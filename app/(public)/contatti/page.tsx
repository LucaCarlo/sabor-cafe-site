import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ContactBlock } from "@/components/contact-block";
import { getPageMeta, getSettings } from "@/lib/data/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await getPageMeta("contatti");
  return {
    title: meta?.title || "Visita",
    description:
      meta?.description ||
      "Vieni a trovarci a Maison Sabor, Civitanova Marche. Orari, indirizzo, prenotazioni.",
  };
}

export default async function ContattiPage() {
  const [meta, s] = await Promise.all([getPageMeta("contatti"), getSettings()]);

  const blockProps = s
    ? {
        city: s.city,
        hours_weekday: s.hours_weekday,
        hours_weekend_label: s.hours_weekend_label,
        hours_weekend: s.hours_weekend,
        instagram_url: s.instagram_url,
        instagram_handle: s.instagram_handle,
        coords_label: s.coords_label,
      }
    : undefined;

  return (
    <>
      <PageHeader
        n={meta?.header_number || ".04"}
        kicker={meta?.header_kicker || "Visita"}
        title={[
          meta?.header_title_before || "Riserva, scrivici,",
          meta?.header_title_accent || "vienici",
          meta?.header_title_after || "a trovare.",
        ]}
        accent={meta?.header_title_accent || "vienici"}
        sub={
          meta?.header_sub ||
          "Per una prenotazione, un evento privato, una collaborazione o anche solo per dirci qualcosa — la porta è sempre aperta."
        }
        photos={
          meta?.header_photos && meta.header_photos.length
            ? meta.header_photos
            : [
                "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85",
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85",
              ]
        }
      />
      <main id="main">
        <ContactBlock {...blockProps} />
      </main>
    </>
  );
}
