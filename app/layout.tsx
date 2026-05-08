import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/data/site";

const SITE_URL = "https://saborcafe.it";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const brand = s?.brand_full || "Sabor Cafè";
  const city = s?.city || "Civitanova Marche";
  const description =
    s?.description ||
    "Sabor Cafè — bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato, eventi privati.";
  const ogImage = s?.og_image_url || `${SITE_URL}/opengraph-image`;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${brand} — ${city}`,
      template: `%s · ${brand}`,
    },
    description,
    applicationName: brand,
    keywords: [
      "Sabor Cafè",
      "Sabor Cafe",
      "bar Civitanova",
      "caffè Civitanova Marche",
      "aperitivo Civitanova",
      "colazione Civitanova",
      "pranzo Civitanova",
      "cocktail bar Civitanova",
      "caffetteria Civitanova",
    ],
    authors: [{ name: brand }],
    creator: brand,
    publisher: brand,
    formatDetection: { telephone: true, address: true, email: true },
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: SITE_URL,
      siteName: brand,
      title: `${brand} — ${city}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: brand }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${brand} — ${city}`,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    category: "Food & Drink",
  };
}

export const viewport: Viewport = {
  themeColor: "#FAF6EC",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="it"
      className={`${dmSerif.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
