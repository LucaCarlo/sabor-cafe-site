"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export type HeroProps = {
  kicker_left?: string;
  kicker_right?: string;
  title_line1_before?: string;
  title_accent?: string;
  title_line1_after?: string;
  title_line2?: string;
  lead?: string;
  image_url?: string;
  image_alt?: string;
  cta_primary_label?: string;
  cta_primary_href?: string;
  cta_secondary_label?: string;
  cta_secondary_href?: string;
  badge_label?: string;
  hours_weekday_label?: string;
  hours_weekday?: string;
  hours_weekend_label?: string;
  hours_weekend?: string;
  hours_kitchen_label?: string;
  hours_kitchen?: string;
};

const D: Required<HeroProps> = {
  kicker_left: "Maison Sabor",
  kicker_right: "Civitanova · MMXXVI",
  title_line1_before: "Caffè, cucina,",
  title_accent: "aperitivo",
  title_line1_after: ".",
  title_line2: "Per ogni occasione.",
  lead: "Un bar contemporaneo nel cuore di Civitanova: caffè selezionato, cucina del giorno, aperitivo curato e occasioni private. Apertura continua, dalla mattina alla sera.",
  image_url: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1800&q=85",
  image_alt: "Atmosfera del bar al tramonto",
  cta_primary_label: "Riserva un tavolo",
  cta_primary_href: "/contatti",
  cta_secondary_label: "Vedi la carta",
  cta_secondary_href: "/menu",
  badge_label: "Aperti adesso · Civitanova",
  hours_weekday_label: "Lun — Ven",
  hours_weekday: "07:00 — 23:00",
  hours_weekend_label: "Sab — Dom",
  hours_weekend: "08:00 — 24:00",
  hours_kitchen_label: "Cucina",
  hours_kitchen: "12:00 — 22:00",
};

export function Hero(props: HeroProps = {}) {
  const p = { ...D, ...Object.fromEntries(Object.entries(props).filter(([, v]) => v != null && v !== "")) } as Required<HeroProps>;
  const hours = [
    { k: p.hours_weekday_label, v: p.hours_weekday },
    { k: p.hours_weekend_label, v: p.hours_weekend },
    { k: p.hours_kitchen_label, v: p.hours_kitchen },
  ];
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-[42%_58%]">
        <div className="relative flex flex-col justify-between bg-[var(--color-ink-deep)] px-[clamp(24px,4vw,56px)] py-[clamp(80px,9vw,110px)] text-[var(--color-cream)]">
          <span aria-hidden="true" className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-[var(--color-brass)]/50" />
          <span aria-hidden="true" className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-[var(--color-brass)]/50" />

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.4 }}
            className="flex items-center gap-4 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-brass-light)]"
          >
            <span>{p.kicker_left}</span>
            <span className="h-px w-8 bg-[var(--color-brass)]" />
            <span>{p.kicker_right}</span>
          </motion.div>

          <div className="my-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
              className="h-display h-hero text-[var(--color-cream)]"
            >
              {p.title_line1_before}{" "}
              <span className="italic text-[var(--color-brass-light)]">{p.title_accent}</span>
              {p.title_line1_after}{" "}
              <span className="block text-[var(--color-cream-deep)]">{p.title_line2}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.65 }}
              className="mt-7 max-w-[44ch] text-[clamp(0.98rem,1.18vw,1.1rem)] leading-[1.7] text-[rgba(250,246,236,0.78)]"
            >
              {p.lead}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href={p.cta_primary_href}
                className="group inline-flex items-center gap-3 bg-[var(--color-brass)] px-7 py-3.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-deep)] transition-all hover:bg-[var(--color-brass-light)]"
              >
                {p.cta_primary_label}
                <ArrowUpRight size={14} strokeWidth={2.2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                href={p.cta_secondary_href}
                className="group inline-flex items-center gap-2 border-b border-[rgba(201,163,111,0.6)] py-2 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brass-light)] transition-all hover:gap-4 hover:border-[var(--color-cream)] hover:text-[var(--color-cream)]"
              >
                {p.cta_secondary_label}
                <span className="text-[14px]">→</span>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 1 }}
            className="grid grid-cols-3 gap-4 border-t border-[rgba(201,163,111,0.2)] pt-6 font-[var(--font-mono)]"
          >
            {hours.map((b) => (
              <div key={b.k}>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-[rgba(250,246,236,0.5)]">
                  {b.k}
                </span>
                <span className="mt-1 block text-[12px] tracking-[0.05em] text-[var(--color-brass-light)]">
                  {b.v}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          className="relative hidden md:block"
        >
          <div className="kenburns absolute inset-0">
            <Image
              src={p.image_url}
              alt={p.image_alt}
              fill
              priority
              sizes="60vw"
              className="object-cover"
              style={{ filter: "saturate(0.95) contrast(1.05) brightness(0.96)" }}
              unoptimized={p.image_url.startsWith("http")}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(15,11,8,0.18) 0%, transparent 30%)" }}
          />
          <div className="absolute bottom-6 right-6 inline-flex items-center gap-2.5 rounded-full bg-[rgba(15,11,8,0.65)] px-4 py-2 backdrop-blur-md">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-brass-light)]" />
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-cream)]">
              {p.badge_label}
            </span>
          </div>
        </motion.div>

        <div className="relative h-[55vh] md:hidden">
          <Image
            src={p.image_url}
            alt={p.image_alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "saturate(0.95) contrast(1.05)" }}
            unoptimized={p.image_url.startsWith("http")}
          />
        </div>
      </div>
    </section>
  );
}
