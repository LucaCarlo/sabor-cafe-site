"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, Utensils, Wine, Leaf, Star, Heart, type LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const ICONS: Record<string, LucideIcon> = { Coffee, Utensils, Wine, Leaf, Star, Heart };

export type ManifestoPillar = { icon: string; title: string; body: string };

export type ManifestoProps = {
  kicker?: string;
  title_before?: string;
  title_accent?: string;
  title_after?: string;
  lead?: string;
  secondary?: string;
  image_url?: string;
  image_alt?: string;
  image_caption?: string;
  pillars?: ManifestoPillar[];
};

const D: Required<ManifestoProps> = {
  kicker: ".01 — Il manifesto",
  title_before: "Una",
  title_accent: "maison",
  title_after: ", non un bar qualsiasi.",
  lead: "Sabor nasce con un'idea che a Civitanova mancava: un posto in cui caffè, cucina e aperitivo siano trattati con la stessa cura, dall'apertura alla chiusura. Spazio contemporaneo, materiali caldi, attenzione al dettaglio.",
  secondary: "Niente trucchi. Niente proclami. Solo le cose fatte come si deve, ogni giorno — perché il bar che servirebbe a noi è anche quello che vorremmo offrire a te.",
  image_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=85",
  image_alt: "Sala interna del bar",
  image_caption: "Il salone — luce di mattina",
  pillars: [
    { icon: "Coffee", title: "Selezione", body: "Caffè single-origin in rotazione mensile, latte fresco da fornitori locali, materie prime stagionali." },
    { icon: "Utensils", title: "Cucina", body: "Piatti del giorno fatti al momento, ricette semplici, ingredienti riconoscibili. Niente surgelati." },
    { icon: "Wine", title: "Carta", body: "Una selezione ragionata di vini marchigiani al calice, cocktail classici, distillati artigianali." },
  ],
};

export function Manifesto(props: ManifestoProps = {}) {
  const p = {
    ...D,
    ...Object.fromEntries(Object.entries(props).filter(([, v]) => v != null && v !== "")),
  } as Required<ManifestoProps>;
  const pillars = p.pillars && p.pillars.length ? p.pillars : D.pillars;
  return (
    <section className="container-x mx-auto max-w-[1500px] py-[clamp(90px,11vw,150px)]">
      <div className="grid grid-cols-1 gap-x-[clamp(40px,6vw,90px)] gap-y-12 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.95, ease }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src={p.image_url}
              alt={p.image_alt}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="img-zoom object-cover hover:scale-[1.04]"
              unoptimized={p.image_url.startsWith("http")}
            />
          </div>
          <div className="mt-4 flex items-baseline justify-between font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
            <span>{p.image_caption}</span>
            <span>Fig. 01</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.95, ease, delay: 0.15 }}
          className="md:col-span-7"
        >
          <div className="section-num-badge mb-5">{p.kicker}</div>
          <h2 className="h-display h-hero">
            {p.title_before} <span className="italic brass-deep">{p.title_accent}</span>{p.title_after}
          </h2>
          <p className="lead mt-7 max-w-[60ch]">{p.lead}</p>
          <p className="mt-4 max-w-[60ch] text-[14.5px] leading-[1.75] text-[var(--color-ink-mute)]">
            {p.secondary}
          </p>

          <ul className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-3">
            {pillars.map((pl) => {
              const Icon = ICONS[pl.icon] ?? Coffee;
              return (
                <li key={pl.title} className="border-t border-[var(--color-line)] pt-5">
                  <Icon size={18} strokeWidth={1.5} className="text-[var(--color-brass)]" />
                  <h3 className="mt-3 font-[var(--font-display)] text-[clamp(1.2rem,1.6vw,1.4rem)] italic font-normal text-[var(--color-ink)]">
                    {pl.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.7] text-[var(--color-ink-mute)]">
                    {pl.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
