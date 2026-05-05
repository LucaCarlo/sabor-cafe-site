"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageHeader({
  n,
  kicker,
  title,
  accent,
  sub,
  photos,
}: {
  n: string;
  kicker: string;
  title: [string, string, string]; // before, accent-word, after
  accent: string;
  sub: string;
  photos: string[];
}) {
  return (
    <section className="bg-[var(--color-cream)] pt-[clamp(120px,15vw,180px)]">
      <div className="container-x mx-auto max-w-[1500px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease, delay: 0.2 }}
          className="section-num-badge mb-7"
        >
          {n} — {kicker}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          className="h-display max-w-[24ch] text-[clamp(2.4rem,5vw,4.4rem)] leading-[1.05]"
        >
          {title[0]}{" "}
          <span className="italic brass-deep">{accent}</span>{" "}
          {title[2]}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.45 }}
          className="lead mt-7 max-w-[58ch]"
        >
          {sub}
        </motion.p>

        {/* photo strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.6 }}
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4"
        >
          {photos.map((src, i) => (
            <div
              key={src}
              className="relative aspect-[4/5] overflow-hidden bg-[var(--color-cream-deep)]"
            >
              <Image
                src={src}
                alt={`${kicker} ${i + 1}`}
                fill
                priority={i < 2}
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(250,246,236,0.85)] font-[var(--font-mono)] text-[10px] font-semibold text-[var(--color-brass-deep)] backdrop-blur-sm">
                0{i + 1}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
