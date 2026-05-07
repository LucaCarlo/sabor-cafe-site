import { Hero } from "@/components/hero";
import { LiveStrip } from "@/components/live-strip";
import { Manifesto } from "@/components/manifesto";
import { Carta } from "@/components/carta";
import { Giornata } from "@/components/giornata";
import { Eventi } from "@/components/eventi";
import { Visita } from "@/components/visita";
import {
  getCartaSection,
  getGiornataMoments,
  getGiornataSection,
  getMenuCategories,
} from "@/lib/data/site";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [cartaSection, cartaCategories, giornataSection, giornataMoments] =
    await Promise.all([
      getCartaSection(),
      getMenuCategories({ onHomepageOnly: true }),
      getGiornataSection(),
      getGiornataMoments(),
    ]);

  const cartaTabs = cartaCategories.map((c) => ({
    key: c.slug,
    label: c.label,
    headline: c.headline,
    img: c.image_url || c.image_url_fallback || "",
    items: c.items.map((it) => ({ name: it.name, desc: it.description })),
  }));

  const giornataMomentsProp = giornataMoments.map((m) => ({
    id: m.slug,
    time: m.time_label,
    label: m.label,
    title: m.title,
    body: m.body,
    note: m.note,
    img: m.image_url || m.image_url_fallback || "",
  }));

  return (
    <>
      <a
        href="#main"
        className="absolute -left-96 top-2 z-50 rounded bg-[var(--color-ink)] px-4 py-3 text-[var(--color-cream)] focus:left-2"
      >
        Vai al contenuto
      </a>
      <Hero />
      <LiveStrip />
      <main id="main">
        <Manifesto />
        <Carta
          kicker={cartaSection?.kicker}
          title_before={cartaSection?.title_before}
          title_accent={cartaSection?.title_accent}
          title_after={cartaSection?.title_after}
          cta_label={cartaSection?.cta_label}
          cta_href={cartaSection?.cta_href}
          tabs={cartaTabs.length ? cartaTabs : undefined}
        />
        <Giornata
          kicker={giornataSection?.kicker}
          title_before={giornataSection?.title_before}
          title_accent={giornataSection?.title_accent}
          title_after={giornataSection?.title_after}
          moments={giornataMomentsProp.length ? giornataMomentsProp : undefined}
        />
        <Eventi />
        <Visita />
      </main>
    </>
  );
}
