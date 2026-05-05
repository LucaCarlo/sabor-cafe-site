"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const sections = [
  {
    cat: "Caffè",
    sub: "Espressi · miscele · specialità",
    items: [
      { n: "Espresso", d: "Selezione del giorno", p: "1,40 €" },
      { n: "Espresso single-origin", d: "Rotazione mensile", p: "2,20 €" },
      { n: "Espresso macchiato", d: "Goccia di latte fresco", p: "1,50 €" },
      { n: "Caffè americano", d: "In tazza grande", p: "1,80 €" },
      { n: "Cappuccino", d: "Schiuma vellutata, cacao a richiesta", p: "1,80 €" },
      { n: "Latte macchiato", d: "Latte caldo, espresso", p: "2,00 €" },
      { n: "V60 / Chemex", d: "Filter coffee, alla giornata", p: "4,00 €" },
      { n: "Affogato", d: "Espresso e gelato di nostra fornitura", p: "4,50 €" },
    ],
  },
  {
    cat: "Pasticceria",
    sub: "Fresca, del giorno, fatta come si deve",
    items: [
      { n: "Cornetto vuoto", d: "Sfoglia croccante", p: "1,30 €" },
      { n: "Cornetto crema", d: "Crema fatta in casa", p: "1,50 €" },
      { n: "Cornetto cioccolato", d: "Cioccolato fondente 70%", p: "1,50 €" },
      { n: "Cornetto amarena", d: "Amarena Fabbri", p: "1,60 €" },
      { n: "Brioche vegana", d: "Senza burro né uova", p: "1,80 €" },
      { n: "Maritozzo con la panna", d: "Soffice, generoso", p: "2,80 €" },
      { n: "Crostatina", d: "Frutta di stagione", p: "2,20 €" },
      { n: "Cookie cioccolato", d: "Fondente 70%, croccante fuori", p: "2,00 €" },
    ],
  },
  {
    cat: "Cucina",
    sub: "Pranzo veloce ma fatto bene",
    items: [
      { n: "Toast classico", d: "Cotto e fontina d'alpeggio", p: "5,00 €" },
      { n: "Toast vegetariano", d: "Verdure grigliate, hummus", p: "5,50 €" },
      { n: "Tramezzino tonno", d: "Maionese leggera", p: "4,50 €" },
      { n: "Tramezzino salmone", d: "Burro e cetriolo", p: "5,50 €" },
      { n: "Insalata del giorno", d: "Cambia spesso, mai banale", p: "8,00 €" },
      { n: "Bowl di stagione", d: "Cereali, verdure, proteine", p: "9,50 €" },
      { n: "Tortino di verdure", d: "Servito con pane caldo", p: "7,50 €" },
      { n: "Piatto del giorno", d: "Chiedi al banco", p: "10,00 €" },
    ],
  },
  {
    cat: "Aperitivo & vini",
    sub: "Calici, taglieri, conversazioni",
    items: [
      { n: "Spritz Aperol", d: "Con olive ascolane", p: "6,00 €" },
      { n: "Spritz Campari", d: "Più amaro, deciso", p: "6,00 €" },
      { n: "Hugo", d: "Sambuco, prosecco, menta", p: "6,00 €" },
      { n: "Calice di vino bianco", d: "Verdicchio dei Castelli di Jesi", p: "5,00 €" },
      { n: "Calice di vino rosso", d: "Rosso piceno superiore", p: "5,00 €" },
      { n: "Birra alla spina", d: "Selezione marchigiana", p: "5,50 €" },
      { n: "Tagliere piccolo", d: "Salumi e formaggi locali", p: "10,00 €" },
      { n: "Tagliere grande", d: "Per due, da condividere", p: "18,00 €" },
      { n: "Olive ascolane", d: "Fritte al momento, calde", p: "6,00 €" },
    ],
  },
];

export function MenuFull() {
  const [active, setActive] = useState(0);

  return (
    <section className="container-x mx-auto max-w-[1300px] py-[clamp(80px,10vw,140px)]">
      {/* Sticky tabs */}
      <div className="sticky top-[64px] z-20 -mx-[clamp(20px,5vw,56px)] border-b border-[var(--color-line-soft)] bg-[rgba(250,246,236,0.92)] px-[clamp(20px,5vw,56px)] py-3 backdrop-blur-md">
        <div className="flex flex-wrap gap-1">
          {sections.map((s, i) => (
            <button
              key={s.cat}
              onClick={() => {
                setActive(i);
                document
                  .getElementById(`menu-section-${i}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`relative px-4 py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors ${
                active === i
                  ? "text-[var(--color-ink)]"
                  : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
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
        {sections.map((sec, si) => (
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
                  Sezione 0{si + 1} / 0{sections.length}
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
              {sec.items.map((it) => (
                <li key={it.n}>
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
