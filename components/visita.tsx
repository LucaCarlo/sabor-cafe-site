"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, Instagram } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export type VisitaProps = {
  kicker?: string;
  title_before?: string;
  title_accent?: string;
  title_after?: string;
  lead?: string;
  cta_label?: string;
  cta_href?: string;
  panel_label?: string;
  phone_label?: string;
  phone_href?: string;
  instagram_url?: string;
  instagram_handle?: string;
  hours_weekday_label?: string;
  hours_weekday?: string;
  hours_weekend_label?: string;
  hours_weekend?: string;
  hours_kitchen_label?: string;
  hours_kitchen?: string;
  address?: string;
  coords_label?: string;
};

const D: Required<VisitaProps> = {
  kicker: ".05 — Visita",
  title_before: "Riserva un",
  title_accent: "tavolo",
  title_after: ", vienici a trovare.",
  lead: "Per la colazione, una pausa pranzo, un aperitivo o una cena privata: la porta è aperta e la sedia ti aspetta. Riserva online o in DM, ti rispondiamo entro la giornata.",
  cta_label: "Riservare adesso",
  cta_href: "/contatti",
  panel_label: "Prenotazioni",
  phone_label: "Chiama il bar",
  phone_href: "tel:+39",
  instagram_url: "https://www.instagram.com/sabor.cafe/",
  instagram_handle: "@sabor.cafe",
  hours_weekday_label: "Lunedì — Venerdì",
  hours_weekday: "07:00 — 23:00",
  hours_weekend_label: "Sabato — Domenica",
  hours_weekend: "08:00 — 24:00",
  hours_kitchen_label: "Cucina",
  hours_kitchen: "12:00 — 22:00",
  address: "Civitanova Marche · centro",
  coords_label: "43°18′N · 13°43′E",
};

export function Visita(props: VisitaProps = {}) {
  const p = {
    ...D,
    ...Object.fromEntries(Object.entries(props).filter(([, v]) => v != null && v !== "")),
  } as Required<VisitaProps>;
  return (
    <section className="relative bg-[var(--color-ink-deep)] py-[clamp(90px,11vw,150px)] text-[var(--color-cream)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(rgba(201,163,111,0.4) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container-x relative mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 items-stretch gap-x-[clamp(30px,5vw,72px)] gap-y-12 md:grid-cols-[1fr_auto]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.95, ease }}
            className="flex flex-col justify-center"
          >
            <div className="section-num-badge mb-6 brass-light">{p.kicker}</div>
            <h2 className="h-display max-w-[18ch] text-[clamp(2.4rem,5.5vw,4.4rem)] leading-[1.05] text-[var(--color-cream)]">
              {p.title_before} <span className="italic text-[var(--color-brass-light)]">{p.title_accent}</span>{p.title_after}
            </h2>
            <p className="mt-7 max-w-[52ch] text-[15px] leading-[1.75] text-[rgba(250,246,236,0.7)]">
              {p.lead}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={p.cta_href}
                className="group inline-flex items-center gap-3 bg-[var(--color-brass)] px-7 py-3.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-deep)] transition-all hover:bg-[var(--color-brass-light)]"
              >
                {p.cta_label}
                <span className="text-[14px] transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
              <a
                href={p.instagram_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border-b border-[rgba(201,163,111,0.5)] py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-light)] transition-all hover:border-[var(--color-cream)] hover:text-[var(--color-cream)]"
              >
                <Instagram size={13} strokeWidth={1.6} />
                {p.instagram_handle}
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.95, ease, delay: 0.15 }}
            className="w-full max-w-[460px] border border-[rgba(201,163,111,0.3)] bg-[rgba(201,163,111,0.04)] p-[clamp(24px,3vw,36px)]"
          >
            <div className="flex items-center justify-between border-b border-[rgba(201,163,111,0.2)] pb-4">
              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.28em] text-[var(--color-brass-light)]">
                {p.panel_label}
              </span>
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[var(--color-brass-light)]" />
            </div>

            <ul className="mt-6 space-y-5">
              <Row k={p.hours_weekday_label} v={p.hours_weekday} />
              <Row k={p.hours_weekend_label} v={p.hours_weekend} />
              <Row k={p.hours_kitchen_label} v={p.hours_kitchen} />
              <Row k="Indirizzo" v={p.address} />
            </ul>

            <div className="relative mt-6 aspect-[16/9] overflow-hidden border border-[rgba(201,163,111,0.2)]">
              <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full">
                <defs>
                  <pattern id="d" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.7" fill="rgba(201,163,111,0.3)" />
                  </pattern>
                </defs>
                <rect width="400" height="225" fill="url(#d)" />
                <g stroke="rgba(201,163,111,0.4)" strokeWidth="1" fill="none">
                  <path d="M0 110 L400 105" />
                  <path d="M120 0 L130 225" />
                  <path d="M260 0 L290 225" />
                  <path d="M0 175 L400 180" />
                </g>
                <path d="M0 195 Q120 190 220 200 T400 195 L400 225 L0 225 Z" fill="rgba(110,129,97,0.3)" />
                <g transform="translate(205, 110)">
                  <circle r="20" fill="rgba(201,163,111,0.25)" />
                  <circle r="11" fill="rgba(201,163,111,0.5)" />
                  <circle r="5" fill="#C9A36F" />
                </g>
              </svg>
              <span className="absolute bottom-3 right-3 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.22em] text-[var(--color-brass-light)]">
                {p.coords_label}
              </span>
            </div>

            <a
              href={p.phone_href}
              className="mt-6 flex w-full items-center justify-center gap-3 border border-[var(--color-brass-light)] py-3 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-light)] transition-colors hover:bg-[var(--color-brass-light)] hover:text-[var(--color-ink-deep)]"
            >
              <Phone size={13} strokeWidth={1.6} />
              {p.phone_label}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[rgba(250,246,236,0.5)]">
        {k}
      </span>
      <span className="font-[var(--font-display)] text-[clamp(0.95rem,1.2vw,1.05rem)] text-[var(--color-cream)]">
        {v}
      </span>
    </li>
  );
}
