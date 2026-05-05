import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Geist, Geist_Mono } from "next/font/google";
import { SmoothScroll } from "@/components/smooth-scroll";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://saborcafe.it"),
  title: {
    default: "Maison Sabor — Civitanova",
    template: "%s · Maison Sabor",
  },
  description:
    "Maison Sabor — bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato, eventi privati.",
  applicationName: "Maison Sabor",
  authors: [{ name: "Maison Sabor" }],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: "Maison Sabor",
    title: "Maison Sabor — Civitanova",
    description: "Caffè, cucina, aperitivo. Per ogni occasione, ogni giorno.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1600&q=80",
        width: 1600,
        height: 1067,
        alt: "Maison Sabor",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Maison Sabor",
    description: "Caffè, cucina, aperitivo a Civitanova.",
    images: [
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1600&q=80",
    ],
  },
  alternates: { canonical: "https://saborcafe.it/" },
  icons: {
    icon: [
      {
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

export const viewport: Viewport = {
  themeColor: "#FAF6EC",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CafeOrCoffeeShop",
  name: "Maison Sabor",
  description:
    "Bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato.",
  url: "https://saborcafe.it/",
  image:
    "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1600&q=80",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Civitanova Marche",
    addressCountry: "IT",
  },
  sameAs: ["https://www.instagram.com/sabor.cafe/"],
  servesCuisine: ["Caffè", "Colazione", "Pranzo", "Aperitivo"],
  priceRange: "€€",
  openingHours: ["Mo-Su 07:00-23:00"],
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SmoothScroll>
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
