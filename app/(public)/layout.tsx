import type { Metadata } from "next";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { getSettings } from "@/lib/data/site";

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const brand = s?.brand_full ?? "Sabor Cafè";
  const description =
    s?.description ??
    "Sabor Cafè — bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato, eventi privati.";
  const siteUrl = s?.site_url ?? "https://saborcafe.it";
  const ogImage =
    s?.og_image_url ??
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1600&q=80";

  return {
    metadataBase: new URL(siteUrl),
    applicationName: brand,
    authors: [{ name: brand }],
    title: {
      default: `${brand} — ${s?.city ?? "Civitanova"}`,
      template: `%s · ${brand}`,
    },
    description,
    openGraph: {
      type: "website",
      locale: "it_IT",
      siteName: brand,
      title: `${brand} — ${s?.city ?? "Civitanova"}`,
      description: "Caffè, cucina, aperitivo. Per ogni occasione, ogni giorno.",
      images: [{ url: ogImage, width: 1600, height: 1067, alt: brand }],
    },
    twitter: {
      card: "summary_large_image",
      title: brand,
      description: `Caffè, cucina, aperitivo a ${s?.city ?? "Civitanova"}.`,
      images: [ogImage],
    },
    alternates: { canonical: siteUrl + "/" },
    icons: {
      icon: [
        s?.logo_url
          ? { url: s.logo_url }
          : {
              url:
                "data:image/svg+xml," +
                encodeURIComponent(
                  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='14' fill='#1A1410'/><text x='50' y='70' text-anchor='middle' font-family='DM Serif Display,Georgia,serif' font-size='62' font-weight='400' fill='#9C7A4B'>S</text></svg>`,
                ),
              type: "image/svg+xml",
            },
      ],
    },
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  const brand = s?.brand_full ?? "Sabor Cafè";
  const siteUrl = s?.site_url ?? "https://saborcafe.it";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    name: brand,
    description:
      s?.description ??
      "Bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato.",
    url: siteUrl + "/",
    image:
      s?.og_image_url ??
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1600&q=80",
    address: {
      "@type": "PostalAddress",
      addressLocality: s?.city ?? "Civitanova Marche",
      addressCountry: s?.country ?? "IT",
    },
    sameAs: [s?.instagram_url ?? "https://www.instagram.com/sabor.cafe/"],
    servesCuisine: (s?.serves_cuisine ?? "Caffè, Colazione, Pranzo, Aperitivo")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean),
    priceRange: s?.price_range ?? "€€",
    openingHours: [
      `Mo-Su ${(s?.hours_weekday ?? "07:00 — 23:00").replace(/\s—\s|\s-\s/g, "-")}`,
    ],
  };

  const navSettings = s
    ? {
        brand_primary: s.brand_primary,
        brand_secondary: s.brand_secondary,
        instagram_url: s.instagram_url,
        instagram_handle: s.instagram_handle,
        reservation_label: s.reservation_label,
        reservation_href: s.reservation_href,
      }
    : undefined;

  const footerSettings = s
    ? {
        brand_primary: s.brand_primary,
        brand_secondary: s.brand_secondary,
        brand_full: s.brand_full,
        description: s.description,
        instagram_url: s.instagram_url,
        instagram_handle: s.instagram_handle,
        city: s.city,
        hours_weekday_label: s.hours_weekday_label,
        hours_weekday: s.hours_weekday,
        hours_weekend_label: s.hours_weekend_label,
        hours_weekend: s.hours_weekend,
      }
    : undefined;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SmoothScroll>
        <Nav settings={navSettings} />
        {children}
        <Footer settings={footerSettings} editionLabel={s?.edition_label ?? "Édition 2026"} />
      </SmoothScroll>
    </>
  );
}
