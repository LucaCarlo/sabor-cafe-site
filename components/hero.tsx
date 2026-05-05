"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      <div className="grid h-full grid-cols-1 md:grid-cols-[42%_58%]">
        {/* Left: Dark content panel */}
        <div className="relative flex flex-col justify-between bg-[var(--color-ink-deep)] px-[clamp(24px,4vw,56px)] py-[clamp(80px,9vw,110px)] text-[var(--color-cream)]">
          {/* decorative diagonal corner brace */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-6 top-6 h-10 w-10 border-r border-t border-[var(--color-brass)]/50"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-6 left-6 h-10 w-10 border-b border-l border-[var(--color-brass)]/50"
          />

          {/* Top: kicker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease, delay: 0.4 }}
            className="flex items-center gap-4 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.28em] text-[var(--color-brass-light)]"
          >
            <span>Maison Sabor</span>
            <span className="h-px w-8 bg-[var(--color-brass)]" />
            <span>Civitanova · MMXXVI</span>
          </motion.div>

          {/* Center: title block */}
          <div className="my-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.5 }}
              className="h-display h-hero text-[var(--color-cream)]"
            >
              Caffè, cucina,{" "}
              <span className="italic text-[var(--color-brass-light)]">
                aperitivo
              </span>
              .{" "}
              <span className="block text-[var(--color-cream-deep)]">
                Per ogni occasione.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.65 }}
              className="mt-7 max-w-[44ch] text-[clamp(0.98rem,1.18vw,1.1rem)] leading-[1.7] text-[rgba(250,246,236,0.78)]"
            >
              Un bar contemporaneo nel cuore di Civitanova: caffè selezionato,
              cucina del giorno, aperitivo curato e occasioni private. Apertura
              continua, dalla mattina alla sera.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.8 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/contatti"
                className="group inline-flex items-center gap-3 bg-[var(--color-brass)] px-7 py-3.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-ink-deep)] transition-all hover:bg-[var(--color-brass-light)]"
              >
                Riserva un tavolo
                <ArrowUpRight
                  size={14}
                  strokeWidth={2.2}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 border-b border-[rgba(201,163,111,0.6)] py-2 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--color-brass-light)] transition-all hover:gap-4 hover:border-[var(--color-cream)] hover:text-[var(--color-cream)]"
              >
                Vedi la carta
                <span className="text-[14px]">→</span>
              </Link>
            </motion.div>
          </div>

          {/* Bottom: hours */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease, delay: 1 }}
            className="grid grid-cols-3 gap-4 border-t border-[rgba(201,163,111,0.2)] pt-6 font-[var(--font-mono)]"
          >
            {[
              { k: "Lun — Ven", v: "07:00 — 23:00" },
              { k: "Sab — Dom", v: "08:00 — 24:00" },
              { k: "Cucina", v: "12:00 — 22:00" },
            ].map((b) => (
              <div key={b.k}>
                <span className="block text-[10px] uppercase tracking-[0.22em] text-[rgba(250,246,236,0.5)]">
                  {b.k}
                </span>
                <span className="mt-1 block text-[12px] tracking-[0.05em] text-[var(--color-brass-light)]">
                  {b.v}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: photo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 0.3 }}
          className="relative hidden md:block"
        >
          <div className="kenburns absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1800&q=85"
              alt="Atmosfera del bar al tramonto"
              fill
              priority
              sizes="60vw"
              className="object-cover"
              style={{ filter: "saturate(0.95) contrast(1.05) brightness(0.96)" }}
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(15,11,8,0.18) 0%, transparent 30%)",
            }}
          />
          {/* Photo caption corner */}
          <div className="absolute bottom-6 right-6 inline-flex items-center gap-2.5 rounded-full bg-[rgba(15,11,8,0.65)] px-4 py-2 backdrop-blur-md">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-brass-light)]" />
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.24em] text-[var(--color-cream)]">
              Aperti adesso · Civitanova
            </span>
          </div>
        </motion.div>

        {/* Mobile photo (below content panel) */}
        <div className="relative h-[55vh] md:hidden">
          <Image
            src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1400&q=85"
            alt="Atmosfera del bar"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "saturate(0.95) contrast(1.05)" }}
          />
        </div>
      </div>
    </section>
  );
}
