import type { SettingsView } from "@/lib/supabase/types";

const SITE_URL = "https://saborcafe.it";

function dayHours(weekday: string) {
  const m = weekday.match(/(\d{1,2})[:\.](\d{2})\s*[-–]\s*(\d{1,2})[:\.](\d{2})/);
  if (!m) return null;
  const [, oh, om, ch, cm] = m;
  return `${oh.padStart(2, "0")}:${om}-${ch.padStart(2, "0")}:${cm}`;
}

export function StructuredData({ settings }: { settings: SettingsView | null }) {
  const brand = settings?.brand_full || "Sabor Cafè";
  const description =
    settings?.description ||
    "Bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato.";
  const phone = settings?.phone;
  const email = settings?.email;
  const address = settings?.address;
  const city = settings?.city || "Civitanova Marche";
  const country = settings?.country || "IT";
  const lat = settings?.coords_lat;
  const lng = settings?.coords_lng;
  const ig = settings?.instagram_url;
  const priceRange = settings?.price_range || "€€";
  const cuisine = settings?.serves_cuisine || "Italiana";
  const logo = settings?.logo_url || `${SITE_URL}/icon`;
  const ogImage = settings?.og_image_url || `${SITE_URL}/opengraph-image`;

  const weekdayHours = settings?.hours_weekday ? dayHours(settings.hours_weekday) : null;
  const weekendHours = settings?.hours_weekend ? dayHours(settings.hours_weekend) : null;

  const openingHoursSpec: Array<Record<string, unknown>> = [];
  if (weekdayHours) {
    const [opens, closes] = weekdayHours.split("-");
    openingHoursSpec.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens,
      closes,
    });
  }
  if (weekendHours) {
    const [opens, closes] = weekendHours.split("-");
    openingHoursSpec.push({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens,
      closes,
    });
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "CafeOrCoffeeShop",
    "@id": `${SITE_URL}/#business`,
    name: brand,
    description,
    url: SITE_URL,
    image: ogImage,
    logo,
    priceRange,
    servesCuisine: cuisine,
    ...(phone && { telephone: phone }),
    ...(email && { email }),
    address: {
      "@type": "PostalAddress",
      ...(address && { streetAddress: address }),
      addressLocality: city,
      addressCountry: country,
    },
    ...(lat && lng && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: lat,
        longitude: lng,
      },
    }),
    ...(openingHoursSpec.length && { openingHoursSpecification: openingHoursSpec }),
    ...(ig && { sameAs: [ig] }),
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: brand,
    inLanguage: "it-IT",
    publisher: { "@id": `${SITE_URL}/#business` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
