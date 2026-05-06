"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export type CartaTab = {
  key: string;
  label: string;
  headline: string;
  img: string;
  items: { name: string; desc: string }[];
};

export type CartaProps = {
  kicker?: string;
  title_before?: string;
  title_accent?: string;
  title_after?: string;
  cta_label?: string;
  cta_href?: string;
  tabs?: CartaTab[];
};

const D: Required<CartaProps> = {
  kicker: ".02 — La carta",
  title_before: "Quattro",
  title_accent: "capitoli",
  title_after: ", quattro modi di stare bene.",
  cta_label: "Vedi la carta completa",
  cta_href: "/menu",
  tabs: [
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
  ],
};

export function Carta(props: CartaProps = {}) {
  const p = {
    ...D,
    ...Object.fromEntries(Object.entries(props).filter(([, v]) => v != null && v !== "" && (Array.isArray(v) ? v.length : true))),
  } as Required<CartaProps>;
  const tabs = p.tabs && p.tabs.length ? p.tabs : D.tabs;
  const [active, setActive] = useState(tabs[0].key);
  const cur = tabs.find((t) => t.key === active) ?? tabs[0];

  return (
    <section className="bg-[var(--color-cream-soft)] py-[clamp(90px,11vw,150px)]">
      <div className="container-x mx-auto max-w-[1500px]">
        <div className="mb-12 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="section-num-badge mb-5">{p.kicker}</div>
            <h2 className="h-display h-hero">
              {p.title_before} <span className="italic brass-deep">{p.title_accent}</span>{p.title_after}
            </h2>
          </div>
          <Link
            href={p.cta_href}
            className="group inline-flex items-center gap-3 self-end font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)] transition-all hover:gap-5 hover:text-[var(--color-ink)] md:col-span-5 md:justify-end"
          >
            {p.cta_label}
            <ArrowRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <div role="tablist" className="mb-12 flex flex-wrap gap-1 border-b border-[var(--color-line)]">
          {tabs.map((t, i) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(t.key)}
                className={`relative px-5 py-4 font-[var(--font-mono)] text-[12px] uppercase tracking-[0.22em] transition-colors ${
                  isActive ? "text-[var(--color-ink)]" : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
                }`}
              >
                <span className="mr-2.5 text-[10px] tracking-normal text-[var(--color-brass)]">
                  0{i + 1}
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

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease }}
            className="grid grid-cols-1 gap-x-[clamp(30px,5vw,72px)] gap-y-10 md:grid-cols-12"
          >
            <div className="md:col-span-7">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={cur.img}
                  alt={cur.label}
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                  unoptimized={cur.img.startsWith("http")}
                />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-[rgba(15,11,8,0.55)] px-4 py-1.5 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass-light)] backdrop-blur-md">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-[var(--color-brass-light)]" />
                  {cur.label}
                </span>
              </div>
            </div>

            <div className="md:col-span-5">
              <h3 className="font-[var(--font-display)] text-[clamp(1.6rem,2.4vw,2.1rem)] italic leading-[1.2] text-[var(--color-ink)]">
                {cur.headline}
              </h3>
              <ul className="mt-8 space-y-6">
                {cur.items.map((it, i) => (
                  <li
                    key={`${cur.key}-${i}`}
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
                href={p.cta_href}
                className="mt-8 inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)] transition-colors hover:text-[var(--color-ink)]"
              >
                {p.cta_label} →
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
