import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";

export type FooterSettings = {
  brand_primary: string;
  brand_secondary: string;
  brand_full: string;
  description: string;
  instagram_url: string;
  instagram_handle: string;
  city: string;
  hours_weekday_label: string;
  hours_weekday: string;
  hours_weekend_label: string;
  hours_weekend: string;
};

const DEFAULTS: FooterSettings = {
  brand_primary: "Maison",
  brand_secondary: "Sabor",
  brand_full: "Sabor Cafè",
  description: "Caffè, cucina, aperitivo. Per ogni occasione, ogni giorno — Civitanova Marche.",
  instagram_url: "https://www.instagram.com/sabor.cafe/",
  instagram_handle: "@sabor.cafe",
  city: "Civitanova Marche",
  hours_weekday_label: "Lun-Ven",
  hours_weekday: "07:00 — 23:00",
  hours_weekend_label: "Sab-Dom",
  hours_weekend: "08:00 — 24:00",
};

export function Footer({
  settings = DEFAULTS,
  editionLabel = "Édition 2026",
}: {
  settings?: FooterSettings;
  editionLabel?: string;
}) {
  const s = { ...DEFAULTS, ...settings };
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[var(--color-ink-deep)] pt-[clamp(70px,9vw,120px)] text-[var(--color-cream)]">
      <div className="container-x mx-auto max-w-[1500px]">
        <div className="grid grid-cols-2 gap-10 border-b border-[rgba(201,163,111,0.15)] pb-14 md:grid-cols-4">
          <div className="col-span-2">
            <Link href="/" className="flex items-baseline gap-2.5 text-[var(--color-cream)]">
              <span className="font-[var(--font-display)] text-[28px] leading-none brass-light">
                {s.brand_primary}
              </span>
              <span className="font-[var(--font-display)] text-[22px] italic leading-none">
                {s.brand_secondary}
              </span>
            </Link>
            <p className="mt-5 max-w-[44ch] font-[var(--font-display)] italic text-[clamp(1.05rem,1.3vw,1.18rem)] leading-[1.55] text-[rgba(250,246,236,0.7)]">
              {s.description}
            </p>
            <a
              href={s.instagram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2.5 border border-[var(--color-brass-light)] px-5 py-2.5 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brass-light)] transition-all hover:bg-[var(--color-brass-light)] hover:text-[var(--color-ink-deep)]"
            >
              <Instagram size={13} strokeWidth={1.6} />
              {s.instagram_handle}
            </a>
          </div>

          <div>
            <h4 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-light)]">
              Pagine
            </h4>
            <ul className="mt-5 space-y-3 font-[var(--font-display)] text-[clamp(1rem,1.3vw,1.12rem)]">
              {[
                { href: "/", label: "Home" },
                { href: "/menu", label: "Carta" },
                { href: "/galleria", label: "Galleria" },
                { href: "/contatti", label: "Visita" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[rgba(250,246,236,0.75)] transition-colors hover:text-[var(--color-brass-light)]"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-light)]">
              Vieni a trovarci
            </h4>
            <ul className="mt-5 space-y-3 text-[14px] leading-[1.65] text-[rgba(250,246,236,0.75)]">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} strokeWidth={1.6} className="brass-light mt-1 shrink-0" />
                {s.city} · Italia
              </li>
              <li className="flex items-start gap-2.5">
                <Mail size={14} strokeWidth={1.6} className="brass-light mt-1 shrink-0" />
                <span>
                  {s.hours_weekday_label} {s.hours_weekday}
                  <br />
                  {s.hours_weekend_label} {s.hours_weekend}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 py-6 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[rgba(250,246,236,0.5)] md:flex-row md:items-center">
          <span>© {year} {s.brand_full} · {s.city}</span>
          <span className="font-[var(--font-display)] not-italic text-[13px] tracking-tight text-[var(--color-brass-light)]">
            Caffè, cucina, aperitivo.
          </span>
          <span>{editionLabel}</span>
        </div>
      </div>
    </footer>
  );
}
