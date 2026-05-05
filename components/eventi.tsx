"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const events = [
  {
    n: "01",
    title: "Aperitivo aziendale",
    sub: "Per il tuo team, da 8 a 40 persone",
    body:
      "Tagliere, calici, finger food. Una serata curata per ringraziare un team o festeggiare un risultato. Personalizziamo allestimento e selezione su richiesta.",
    img: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "02",
    title: "Compleanni & celebrazioni",
    sub: "Riservi lo spazio, noi pensiamo al resto",
    body:
      "Aperitivo o cena privata, tavolata grande, allestimento personalizzato. Possibilità di torta su misura della pasticceria di nostra fornitura.",
    img: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85",
  },
  {
    n: "03",
    title: "Presentazioni & cene private",
    sub: "Lanci, book launch, riunioni esclusive",
    body:
      "Spazio raccolto e contemporaneo per presentazioni, lanci di libri, cene di lavoro. Servizio dedicato, audio se richiesto, schermo a disposizione.",
    img: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=85",
  },
];

export function Eventi() {
  return (
    <section className="bg-[var(--color-cream-deep)] py-[clamp(90px,11vw,150px)]">
      <div className="container-x mx-auto max-w-[1500px]">
        <div className="mb-14 grid grid-cols-1 items-end gap-6 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="section-num-badge mb-5">.04 — Per le tue occasioni</div>
            <h2 className="h-display h-hero max-w-[20ch]">
              Maison Sabor è anche{" "}
              <span className="italic brass-deep">privata</span>.
            </h2>
            <p className="lead mt-6 max-w-[58ch]">
              Ti aiutiamo a organizzare l'occasione giusta — da un aperitivo
              aziendale a una presentazione esclusiva. Spazio, servizio,
              dettagli: tutto pensato.
            </p>
          </div>
          <Link
            href="/contatti"
            className="group inline-flex items-center gap-3 self-end font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)] transition-all hover:gap-5 hover:text-[var(--color-ink)] md:col-span-5 md:justify-end"
          >
            Richiedi disponibilità
            <ArrowUpRight size={14} strokeWidth={2} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {events.map((e, i) => (
            <motion.article
              key={e.n}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              className="card-hover group flex flex-col gap-5 bg-[var(--color-cream)] p-2 hover:shadow-[0_24px_60px_-32px_rgba(26,20,16,0.4)]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={e.img}
                  alt={e.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="img-zoom object-cover group-hover:scale-[1.04]"
                />
                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-brass-light)] bg-[rgba(250,246,236,0.85)] font-[var(--font-mono)] text-[10px] font-semibold text-[var(--color-brass-deep)] backdrop-blur-sm">
                  {e.n}
                </span>
              </div>
              <div className="flex flex-col gap-3 px-4 pb-5">
                <h3 className="font-[var(--font-display)] text-[clamp(1.4rem,1.9vw,1.65rem)] leading-tight text-[var(--color-ink)]">
                  {e.title}
                </h3>
                <p className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)]">
                  {e.sub}
                </p>
                <p className="text-[14px] leading-[1.65] text-[var(--color-ink-mute)]">
                  {e.body}
                </p>
                <Link
                  href="/contatti"
                  className="mt-2 inline-flex items-center gap-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-brass-deep)] transition-all hover:gap-3.5 hover:text-[var(--color-ink)]"
                >
                  Richiedi info
                  <span>→</span>
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
