"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const moments = [
  {
    id: "mattina",
    time: "07:00",
    label: "Mattina",
    title: "Il rito che inizia ogni giorno.",
    body:
      "Il primo caffè è un piccolo gesto di cura: dosatura precisa, latte vellutato, un cornetto fragrante per accompagnarlo. La giornata comincia bene quando comincia da qui.",
    note: "Caffè · Cornetto · Spremuta",
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "pomeriggio",
    time: "13:00",
    label: "Pomeriggio",
    title: "Una pausa che vale il suo tempo.",
    body:
      "Il pranzo veloce, ma fatto bene. Una bowl di stagione, un toast, un'insalata pensata. Si torna al lavoro con qualcosa di buono nel ricordo, non solo nella pancia.",
    note: "Bowl · Toast · Insalate",
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85",
  },
  {
    id: "sera",
    time: "18:30",
    label: "Sera",
    title: "L'ora di rallentare.",
    body:
      "Spritz e tagliere, calici e cose da sgranocchiare. Musica bassa, luce calda, conversazioni che si dilatano. La giornata finisce dolce, qui dentro.",
    note: "Spritz · Tagliere · Vino al calice",
    img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85",
  },
];

export function Giornata() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const els = refs.current.filter((e): e is HTMLElement => Boolean(e));
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = Number(
            (visible[0].target as HTMLElement).dataset.idx ?? 0,
          );
          setActive(idx);
        }
      },
      { threshold: [0.4, 0.6, 0.8], rootMargin: "-30% 0px -30% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative py-[clamp(80px,10vw,140px)]">
      {/* Section heading */}
      <div className="container-x mx-auto mb-16 max-w-[1500px]">
        <div className="section-num-badge mb-5">.03 — Una giornata da Sabor</div>
        <h2 className="h-display h-hero max-w-[18ch]">
          Lo stesso posto,{" "}
          <span className="italic brass-deep">tre ritmi</span> diversi.
        </h2>
      </div>

      {/* Sticky scroll layout */}
      <div className="container-x mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Sticky left column */}
          <aside className="hidden md:col-span-4 md:block">
            <div className="sticky top-32 space-y-6">
              <div className="border-l-2 border-[var(--color-brass)] pl-5">
                <span className="block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
                  Adesso
                </span>
                <motion.span
                  key={moments[active].time}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease }}
                  className="mt-1 block font-[var(--font-display)] text-[clamp(2.5rem,4.5vw,4rem)] leading-none italic text-[var(--color-brass-deep)]"
                >
                  {moments[active].time}
                </motion.span>
                <motion.span
                  key={moments[active].label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease, delay: 0.05 }}
                  className="mt-2 block font-[var(--font-display)] text-[clamp(1.4rem,2vw,1.8rem)] text-[var(--color-ink)]"
                >
                  {moments[active].label}
                </motion.span>
              </div>

              {/* Vertical step indicator */}
              <ol className="mt-12 space-y-4">
                {moments.map((m, i) => (
                  <li key={m.id} className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-2 w-2 rounded-full transition-all ${
                        active === i
                          ? "scale-125 bg-[var(--color-brass)]"
                          : "bg-[var(--color-line)]"
                      }`}
                    />
                    <span
                      className={`font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors ${
                        active === i
                          ? "text-[var(--color-ink)]"
                          : "text-[var(--color-ink-mute)]"
                      }`}
                    >
                      0{i + 1} — {m.label}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>

          {/* Right scrolling content */}
          <div className="md:col-span-8 md:space-y-32">
            {moments.map((m, i) => (
              <motion.section
                key={m.id}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                data-idx={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-15%" }}
                transition={{ duration: 0.95, ease }}
                className="grid grid-cols-1 gap-y-7"
              >
                {/* Mobile time label */}
                <div className="flex items-baseline gap-3 md:hidden">
                  <span className="font-[var(--font-display)] text-[2rem] leading-none italic brass-deep">
                    {m.time}
                  </span>
                  <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
                    {m.label}
                  </span>
                </div>

                {/* Photo */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={m.img}
                    alt={m.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Text */}
                <div>
                  <h3 className="font-[var(--font-display)] text-[clamp(1.5rem,2.4vw,2rem)] italic font-normal leading-[1.2] text-[var(--color-ink)]">
                    {m.title}
                  </h3>
                  <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.75] text-[var(--color-ink-soft)]">
                    {m.body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)]">
                    <span className="h-px w-6 bg-[var(--color-brass)]" />
                    {m.note}
                  </span>
                </div>
              </motion.section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
