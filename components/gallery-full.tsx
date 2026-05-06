"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export type GalleryPhoto = {
  src: string;
  alt: string;
  cat: string;
  size: "sq" | "tall" | "wide";
};

export type GalleryFullProps = {
  photos?: GalleryPhoto[];
  categories?: string[];
};

const sizeClass: Record<GalleryPhoto["size"], string> = {
  sq: "aspect-square md:aspect-[4/5]",
  tall: "aspect-[4/5] md:aspect-[3/5]",
  wide: "aspect-[16/10] md:aspect-[3/2]",
};

export function GalleryFull({ photos, categories }: GalleryFullProps = {}) {
  const ph = photos && photos.length ? photos : [];
  const cats = ["Tutto", ...(categories ?? [])] as const;
  const [filter, setFilter] = useState<string>("Tutto");
  const list = filter === "Tutto" ? ph : ph.filter((p) => p.cat === filter);

  return (
    <section className="container-x mx-auto max-w-[1500px] py-[clamp(80px,10vw,140px)]">
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
                unoptimized={p.src.startsWith("http")}
              />
              <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-[rgba(250,246,236,0.92)] px-3 py-1 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink)] opacity-0 backdrop-blur-sm transition-opacity hover:opacity-100 focus-within:opacity-100">
                {p.cat}
              </span>
            </motion.figure>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
