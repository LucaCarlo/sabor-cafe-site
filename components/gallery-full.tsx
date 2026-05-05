"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

type Photo = {
  src: string;
  alt: string;
  cat: "Spazio" | "Caffè" | "Cucina" | "Persone" | "Atmosfera";
  size: "sq" | "tall" | "wide";
};

const photos: Photo[] = [
  { src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=85", alt: "Bancone in legno", cat: "Spazio", size: "wide" },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85", alt: "Sala interna", cat: "Spazio", size: "tall" },
  { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85", alt: "Cappuccino", cat: "Caffè", size: "sq" },
  { src: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1400&q=85", alt: "Espresso scuro", cat: "Caffè", size: "sq" },
  { src: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85", alt: "Latte art", cat: "Caffè", size: "tall" },
  { src: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1400&q=85", alt: "Chicchi tostati", cat: "Caffè", size: "sq" },
  { src: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1400&q=85", alt: "Mani al lavoro", cat: "Persone", size: "tall" },
  { src: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1400&q=85", alt: "Sorrisi al banco", cat: "Persone", size: "wide" },
  { src: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1400&q=85", alt: "Pasticceria fresca", cat: "Cucina", size: "sq" },
  { src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85", alt: "Bowl di stagione", cat: "Cucina", size: "sq" },
  { src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1400&q=85", alt: "Dolci del mattino", cat: "Cucina", size: "sq" },
  { src: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1400&q=85", alt: "Atmosfera serale", cat: "Atmosfera", size: "tall" },
];

const cats = ["Tutto", "Spazio", "Caffè", "Cucina", "Persone", "Atmosfera"] as const;

const sizeClass: Record<Photo["size"], string> = {
  sq: "aspect-square md:aspect-[4/5]",
  tall: "aspect-[4/5] md:aspect-[3/5]",
  wide: "aspect-[16/10] md:aspect-[3/2]",
};

export function GalleryFull() {
  const [filter, setFilter] = useState<(typeof cats)[number]>("Tutto");
  const list = filter === "Tutto" ? photos : photos.filter((p) => p.cat === filter);

  return (
    <section className="container-x mx-auto max-w-[1500px] py-[clamp(80px,10vw,140px)]">
      {/* Filter pills */}
      <div className="mb-12 flex flex-wrap items-center gap-2 border-b border-[var(--color-line-soft)] pb-5">
        <span className="kicker mr-3">Filtra</span>
        {cats.map((c) => {
          const a = c === filter;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-4 py-1.5 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] transition-all ${
                a
                  ? "border-[var(--color-brass-deep)] bg-[var(--color-brass-deep)] text-[var(--color-cream)]"
                  : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-brass)] hover:text-[var(--color-brass-deep)]"
              }`}
            >
              {c}
            </button>
          );
        })}
        <span className="ml-auto font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
          {list.length} {list.length === 1 ? "foto" : "foto"}
        </span>
      </div>

      {/* Masonry grid via columns */}
      <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
        <AnimatePresence>
          {list.map((p, i) => (
            <motion.figure
              key={p.src}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.7, ease, delay: (i % 8) * 0.04 }}
              layout
              className={`mb-4 break-inside-avoid bg-[var(--color-cream-deep)] ${sizeClass[p.size]} relative w-full overflow-hidden`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="img-zoom object-cover hover:scale-[1.03]"
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[rgba(250,246,236,0.92)] px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)] opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100 focus-within:opacity-100">
                {p.cat}
              </span>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>

      <p className="mt-16 text-center font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
        Nuove foto ogni settimana ·{" "}
        <a
          href="https://www.instagram.com/sabor.cafe/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-brass-deep)] hover:text-[var(--color-ink)]"
        >
          @sabor.cafe ↗
        </a>
      </p>
    </section>
  );
}
