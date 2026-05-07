import { Hero } from "@/components/hero";
import { LiveStrip } from "@/components/live-strip";
import { Manifesto } from "@/components/manifesto";
import { Carta } from "@/components/carta";
import { Giornata } from "@/components/giornata";
import { Eventi } from "@/components/eventi";
import { Visita } from "@/components/visita";
import {
  getCartaSection,
  getEventi,
  getEventiSection,
  getGiornataMoments,
  getGiornataSection,
  getHero,
  getManifesto,
  getMenuCategories,
  getSettings,
  getVisita,
} from "@/lib/data/site";
import type { ManifestoPillar } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [
    settings,
    hero,
    manifesto,
    cartaSection,
    cartaCategories,
    giornataSection,
    giornataMoments,
    eventiSection,
    eventi,
    visita,
  ] = await Promise.all([
    getSettings(),
    getHero(),
    getManifesto(),
    getCartaSection(),
    getMenuCategories({ onHomepageOnly: true }),
    getGiornataSection(),
    getGiornataMoments(),
    getEventiSection(),
    getEventi(),
    getVisita(),
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

  const eventiProp = eventi.map((e) => ({
    n: e.number_label,
    title: e.title,
    sub: e.sub,
    body: e.body,
    img: e.image_url || e.image_url_fallback || "",
    cta_label: e.cta_label,
    cta_href: e.cta_href,
  }));

  const liveStripSettings = settings
    ? {
        hours_weekday: settings.hours_weekday,
        city: settings.city,
        instagram_url: settings.instagram_url,
        instagram_handle: settings.instagram_handle,
        open_hour: settings.open_hour,
        close_hour: settings.close_hour,
      }
    : undefined;

  return (
    <>
      <a
        href="#main"
        className="absolute -left-96 top-2 z-50 rounded bg-[var(--color-ink)] px-4 py-3 text-[var(--color-cream)] focus:left-2"
      >
        Vai al contenuto
      </a>
      <Hero
        kicker_left={hero?.kicker_left || settings?.brand_full}
        kicker_right={hero?.kicker_right}
        title_line1_before={hero?.title_line1_before}
        title_accent={hero?.title_accent}
        title_line1_after={hero?.title_line1_after}
        title_line2={hero?.title_line2}
        lead={hero?.lead}
        image_url={hero?.image_url || hero?.image_url_fallback}
        image_alt={hero?.image_alt}
        cta_primary_label={hero?.cta_primary_label}
        cta_primary_href={hero?.cta_primary_href}
        cta_secondary_label={hero?.cta_secondary_label}
        cta_secondary_href={hero?.cta_secondary_href}
        badge_label={hero?.badge_label}
        hours_weekday_label={settings?.hours_weekday_label}
        hours_weekday={settings?.hours_weekday}
        hours_weekend_label={settings?.hours_weekend_label}
        hours_weekend={settings?.hours_weekend}
        hours_kitchen_label={settings?.hours_kitchen_label}
        hours_kitchen={settings?.hours_kitchen}
      />
      <LiveStrip settings={liveStripSettings} />
      <main id="main">
        <Manifesto
          kicker={manifesto?.kicker}
          title_before={manifesto?.title_before}
          title_accent={manifesto?.title_accent}
          title_after={manifesto?.title_after}
          lead={manifesto?.lead}
          secondary={manifesto?.secondary}
          image_url={manifesto?.image_url || manifesto?.image_url_fallback}
          image_alt={manifesto?.image_alt}
          image_caption={manifesto?.image_caption}
          pillars={manifesto?.pillars as ManifestoPillar[] | undefined}
        />
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
        <Eventi
          kicker={eventiSection?.kicker}
          title_before={eventiSection?.title_before}
          title_accent={eventiSection?.title_accent}
          title_after={eventiSection?.title_after}
          lead={eventiSection?.lead}
          cta_label={eventiSection?.cta_label}
          cta_href={eventiSection?.cta_href}
          eventi={eventiProp.length ? eventiProp : undefined}
        />
        <Visita
          kicker={visita?.kicker}
          title_before={visita?.title_before}
          title_accent={visita?.title_accent}
          title_after={visita?.title_after}
          lead={visita?.lead}
          cta_label={visita?.cta_label}
          cta_href={visita?.cta_href}
          panel_label={visita?.panel_label}
          phone_label={visita?.phone_label}
          phone_href={visita?.phone_href || (settings?.phone ? `tel:${settings.phone.replace(/\s/g, "")}` : undefined)}
          instagram_url={settings?.instagram_url}
          instagram_handle={settings?.instagram_handle}
          hours_weekday_label={settings?.hours_weekday_label}
          hours_weekday={settings?.hours_weekday}
          hours_weekend_label={settings?.hours_weekend_label}
          hours_weekend={settings?.hours_weekend}
          hours_kitchen_label={settings?.hours_kitchen_label}
          hours_kitchen={settings?.hours_kitchen}
          address={settings?.address}
          coords_label={settings?.coords_label}
        />
      </main>
    </>
  );
}
