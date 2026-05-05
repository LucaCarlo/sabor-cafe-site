"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const tabs = [
  {
    key: "caffe",
    label: "Caffè",
    headline: "Una tazza che racconta una scelta.",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85",
    items: [
      { name: "Espresso single-origin", desc: "Rotazione mensile" },
      { name: "Cappuccino vellutato", desc: "Latte fresco, schiuma sottile" },
      { name: "Filter coffee", desc: "V60 o Chemex, alla giornata" },
      { name: "Affogato", desc: "Espresso e gelato di nostra fornitura" },
    ],
  },
  {
    key: "cucina",
    label: "Cucina",
    headline: "Piatti del giorno, ingredienti riconoscibili.",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85",
    items: [
      { name: "Insalata del giorno", desc: "Cambia spesso, mai banale" },
      { name: "Toast di farina semi-integrale", desc: "Cotto e fontina d'alpeggio" },
      { name: "Bowl di stagione", desc: "Cereali, verdure, proteina" },
      { name: "Tortino di verdure", desc: "Servito con pane caldo" },
    ],
  },
  {
    key: "aperitivo",
    label: "Aperitivo",
    headline: "Calici, taglieri, conversazioni.",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85",
    items: [
      { name: "Spritz Sabor", desc: "Aperol, prosecco, soda — proporzioni serie" },
      { name: "Calice di vino marchigiano", desc: "Verdicchio, rosso piceno" },
      { name: "Tagliere della casa", desc: "Salumi e formaggi locali" },
      { name: "Olive ascolane", desc: "Fritte al momento, calde" },
    ],
  },
  {
    key: "pasticceria",
    label: "Pasticceria",
    headline: "Fresca, fragrante, fatta come si deve.",
    img: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1400&q=85",
    items: [
      { name: "Cornetto vuoto", desc: "Sfoglia croccante, burro vero" },
      { name: "Cornetto crema o amarena", desc: "Crema fatta in casa" },
      { name: "Maritozzo con la panna", desc: "Soffice, generoso" },
      { name: "Cookie cioccolato 70%", desc: "Fondente, croccante fuori" },
    ],
  },
];

export function Carta() {
  const [active, setActive] = useState(tabs[0].key);
  const cur = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <section className="bg-[var(--color-cream-soft)] py-[clamp(90px,11vw,150px)]">
      <div className="container-x mx-auto max-w-[1500px]">
        {/* Header */}
        <div className="mb-12 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="section-num-badge mb-5">.02 — La carta</div>
            <h2 className="h-display h-hero">
              Quattro <span className="italic brass-deep">capitoli</span>,
              <br />
              quattro modi di stare bene.
            </h2>
          </div>
          <Link
            href="/menu"
            className="group inline-flex items-center gap-3 self-end font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)] transition-all hover:gap-5 hover:text-[var(--color-ink)] md:col-span-5 md:justify-end"
          >
            Vedi la carta completa
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        {/* Tabs */}
        <div role="tablist" className="mb-12 flex flex-wrap gap-1 border-b border-[var(--color-line)]">
          {tabs.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className={`relative px-5 py-4 font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] transition-colors ${
                  isActive
                    ? "text-[var(--color-ink)]"
                    : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
                }`}
              >
                <span className="mr-2.5 text-[10px] tracking-normal text-[var(--color-brass)]">
                  0{tabs.findIndex((x) => x.key === t.key) + 1}
                </span>
                {t.label}
                {isActive && (
                  <motion.span
                    layoutId="carta-tab-underline"
                    className="absolute -bottom-px left-0 right-0 h-[2px] bg-[var(--color-brass)]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Big photo + items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease }}
            className="grid grid-cols-1 gap-x-[clamp(30px,5vw,72px)] gap-y-10 md:grid-cols-12"
          >
            {/* Photo big */}
            <div className="md:col-span-7">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={cur.img}
                  alt={cur.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[rgba(15,11,8,0.55)] px-4 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass-light)] backdrop-blur-md">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brass-light)]" />
                  {cur.label}
                </span>
              </div>
            </div>

            {/* Items list */}
            <div className="md:col-span-5">
              <h3 className="font-[var(--font-display)] text-[clamp(1.6rem,2.4vw,2.1rem)] italic leading-[1.2] text-[var(--color-ink)]">
                {cur.headline}
              </h3>
              <ul className="mt-8 space-y-6">
                {cur.items.map((it, i) => (
                  <li
                    key={it.name}
                    className="grid grid-cols-[28px_1fr] items-baseline gap-3 border-b border-[var(--color-line-soft)] pb-5 last:border-b-0"
                  >
                    <span className="font-[var(--font-mono)] text-[10px] tracking-[0.16em] text-[var(--color-brass)]">
                      0{i + 1}
                    </span>
                    <div>
                      <span className="block font-[var(--font-display)] text-[clamp(1.18rem,1.55vw,1.32rem)] text-[var(--color-ink)]">
                        {it.name}
                      </span>
                      <p className="mt-1 text-[13.5px] leading-[1.6] text-[var(--color-ink-mute)]">
                        {it.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/menu"
                className="mt-8 inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)] transition-colors hover:text-[var(--color-ink)]"
              >
                Vedi tutto in carta →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
