"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Coffee, Utensils, Wine } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const pillars = [
  {
    icon: Coffee,
    title: "Selezione",
    body: "Caffè single-origin in rotazione mensile, latte fresco da fornitori locali, materie prime stagionali.",
  },
  {
    icon: Utensils,
    title: "Cucina",
    body: "Piatti del giorno fatti al momento, ricette semplici, ingredienti riconoscibili. Niente surgelati.",
  },
  {
    icon: Wine,
    title: "Carta",
    body: "Una selezione ragionata di vini marchigiani al calice, cocktail classici, distillati artigianali.",
  },
];

export function Manifesto() {
  return (
    <section className="container-x mx-auto max-w-[1500px] py-[clamp(90px,11vw,150px)]">
      <div className="grid grid-cols-1 gap-x-[clamp(40px,6vw,90px)] gap-y-12 md:grid-cols-12">
        {/* Left: image stacked */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.95, ease }}
          className="md:col-span-5"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=85"
              alt="Sala interna del bar"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="img-zoom object-cover hover:scale-[1.04]"
            />
          </div>
          {/* small caption */}
          <div className="mt-4 flex items-baseline justify-between font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
            <span>Il salone — luce di mattina</span>
            <span>Fig. 01</span>
          </div>
        </motion.div>

        {/* Right: editorial */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.95, ease, delay: 0.15 }}
          className="md:col-span-7"
        >
          <div className="section-num-badge mb-5">.01 — Il manifesto</div>
          <h2 className="h-display h-hero">
            Una <span className="italic brass-deep">maison</span>, non un bar
            qualsiasi.
          </h2>
          <p className="lead mt-7 max-w-[60ch]">
            Sabor nasce con un'idea che a Civitanova mancava: un posto in cui
            caffè, cucina e aperitivo siano trattati con la stessa cura,
            dall'apertura alla chiusura. Spazio contemporaneo, materiali caldi,
            attenzione al dettaglio.
          </p>
          <p className="mt-4 max-w-[60ch] text-[14.5px] leading-[1.75] text-[var(--color-ink-mute)]">
            Niente trucchi. Niente proclami. Solo le cose fatte come si deve,
            ogni giorno — perché il bar che servirebbe a noi è anche quello
            che vorremmo offrire a te.
          </p>

          {/* 3 pillars in compact horizontal row */}
          <ul className="mt-12 grid grid-cols-1 gap-7 sm:grid-cols-3">
            {pillars.map((p) => {
              const Icon = p.icon;
              return (
                <li
                  key={p.title}
                  className="border-t border-[var(--color-line)] pt-5"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[var(--color-brass)]"
                  />
                  <h3 className="mt-3 font-[var(--font-display)] text-[clamp(1.2rem,1.6vw,1.4rem)] italic font-normal text-[var(--color-ink)]">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13.5px] leading-[1.7] text-[var(--color-ink-mute)]">
                    {p.body}
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
