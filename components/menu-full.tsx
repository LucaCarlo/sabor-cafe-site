"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export type MenuSection = {
  cat: string;
  sub: string;
  items: { n: string; d: string; p: string }[];
};

export type MenuFullProps = {
  sections?: MenuSection[];
};

const D: Required<MenuFullProps> = {
  sections: [
    {
      cat: "Caffè",
      sub: "Espressi · miscele · specialità",
      items: [{ n: "Espresso", d: "Selezione del giorno", p: "1,40 €" }],
    },
  ],
};

export function MenuFull({ sections }: MenuFullProps = {}) {
  const list = sections && sections.length ? sections : D.sections;
  const [active, setActive] = useState(0);

  return (
    <section className="container-x mx-auto max-w-[1300px] py-[clamp(80px,10vw,140px)]">
      <div className="sticky top-[64px] z-20 -mx-[clamp(20px,5vw,56px)] border-b border-[var(--color-line-soft)] bg-[rgba(250,246,236,0.92)] px-[clamp(20px,5vw,56px)] py-3 backdrop-blur-md">
        <div className="flex flex-wrap gap-1">
          {list.map((s, i) => (
            <button
              key={s.cat}
              onClick={() => {
                setActive(i);
                document
                  .getElementById(`menu-section-${i}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`relative px-4 py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors ${
                active === i ? "text-[var(--color-ink)]" : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
              }`}
            >
              <span className="mr-2 text-[10px] tracking-normal text-[var(--color-brass)]">
                0{i + 1}
              </span>
              {s.cat}
              {active === i && (
                <motion.span
                  layoutId="menufull-tab-underline"
                  className="absolute -bottom-3 left-0 right-0 h-[2px] bg-[var(--color-brass)]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-16 space-y-24">
        {list.map((sec, si) => (
          <motion.div
            key={sec.cat}
            id={`menu-section-${si}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8%" }}
            transition={{ duration: 0.95, ease }}
          >
            <header className="mb-10 flex flex-wrap items-end justify-between gap-3 border-b-2 border-[var(--color-brass)] pb-5">
              <div>
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)]">
                  Sezione 0{si + 1} / 0{list.length}
                </span>
                <h2 className="mt-2 font-[var(--font-display)] text-[clamp(1.9rem,3.4vw,2.8rem)] text-[var(--color-ink)]">
                  {sec.cat}
                </h2>
              </div>
              <p className="font-[var(--font-display)] italic text-[clamp(1rem,1.3vw,1.15rem)] text-[var(--color-ink-mute)]">
                {sec.sub}
              </p>
            </header>

            <ul className="grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2">
              {sec.items.map((it, i) => (
                <li key={`${sec.cat}-${i}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-[var(--font-display)] text-[clamp(1.18rem,1.6vw,1.4rem)] text-[var(--color-ink)]">
                      {it.n}
                    </span>
                    <span className="flex-1 -translate-y-1 border-b border-dotted border-[var(--color-ink-mute)]/40" />
                    <span className="font-[var(--font-mono)] text-[12px] tracking-[0.05em] text-[var(--color-brass-deep)]">
                      {it.p}
                    </span>
                  </div>
                  <p className="mt-1 text-[13.5px] leading-[1.6] text-[var(--color-ink-mute)]">
                    {it.d}
                  </p>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <p className="mt-20 max-w-[60ch] font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
        ★ Allergeni e intolleranze: chiedi al banco. La cucina segue le norme HACCP.
        Prezzi indicativi e variabili con la stagione.
      </p>
    </section>
  );
}
