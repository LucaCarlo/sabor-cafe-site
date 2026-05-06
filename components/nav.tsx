"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Carta" },
  { href: "/galleria", label: "Galleria" },
  { href: "/contatti", label: "Visita" },
];

export type NavSettings = {
  brand_primary: string;
  brand_secondary: string;
  instagram_url: string;
  instagram_handle: string;
  reservation_label: string;
  reservation_href: string;
};

const DEFAULTS: NavSettings = {
  brand_primary: "Maison",
  brand_secondary: "Sabor",
  instagram_url: "https://www.instagram.com/sabor.cafe/",
  instagram_handle: "@sabor.cafe",
  reservation_label: "Riserva",
  reservation_href: "/contatti",
};

export function Nav({ settings = DEFAULTS }: { settings?: NavSettings }) {
  const s = { ...DEFAULTS, ...settings };
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const overDark = !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-[var(--color-line-soft)] bg-[rgba(250,246,236,0.92)] backdrop-blur-md"
            : "border-b border-transparent",
        )}
      >
        <div className="container-x mx-auto flex max-w-[1500px] items-center justify-between py-4">
          <Link
            href="/"
            className={cn(
              "flex items-baseline gap-2.5 transition-colors duration-500",
              overDark ? "text-[var(--color-cream)]" : "text-[var(--color-ink)]",
            )}
          >
            <span
              className={cn(
                "font-[var(--font-display)] text-[26px] leading-none transition-colors duration-500",
                overDark ? "text-[var(--color-brass-light)]" : "text-[var(--color-brass-deep)]",
              )}
            >
              {s.brand_primary}
            </span>
            <span className="font-[var(--font-display)] text-[20px] italic leading-none">
              {s.brand_secondary}
            </span>
          </Link>

          <nav aria-label="Navigazione" className="hidden items-center gap-9 lg:flex">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "group relative py-1 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] transition-colors duration-500",
                    overDark
                      ? "text-[rgba(250,246,236,0.92)] hover:text-[var(--color-brass-light)]"
                      : "text-[var(--color-ink-soft)] hover:text-[var(--color-brass-deep)]",
                    active && (overDark ? "text-[var(--color-brass-light)]" : "text-[var(--color-brass-deep)]"),
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-0.5 left-0 right-0 h-px origin-right transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100",
                      active ? "scale-x-100" : "scale-x-0",
                      overDark ? "bg-[var(--color-brass-light)]" : "bg-[var(--color-brass)]",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href={s.reservation_href}
              className={cn(
                "hidden items-center gap-2 rounded-sm border px-5 py-2.5 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-500 md:inline-flex",
                isHome
                  ? "border-white bg-white text-[var(--color-brass-deep)] hover:bg-[var(--color-cream)] hover:border-[var(--color-cream)] hover:text-[var(--color-brass)]"
                  : overDark
                  ? "border-[var(--color-cream)] bg-transparent text-[var(--color-cream)] hover:bg-[var(--color-brass)] hover:border-[var(--color-brass)] hover:text-[var(--color-cream)]"
                  : "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] hover:border-[var(--color-brass-deep)]",
              )}
            >
              {s.reservation_label}
              <span className="text-[14px]">→</span>
            </Link>
            <button
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center border transition-colors duration-500 lg:hidden",
                overDark
                  ? "border-[rgba(250,246,236,0.4)] text-[var(--color-cream)]"
                  : "border-[var(--color-line)] text-[var(--color-ink)]",
              )}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex items-center bg-[var(--color-ink)] lg:hidden"
          >
            <ul className="w-full px-[clamp(28px,7vw,56px)]">
              {links.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.08 + i * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-[rgba(201,163,111,0.2)] py-5 font-[var(--font-display)] text-[clamp(2rem,9vw,3.6rem)] leading-tight text-[var(--color-cream)] transition-colors hover:text-[var(--color-brass-light)]"
                  >
                    <span>{l.label}</span>
                    <span className="font-[var(--font-mono)] text-sm tracking-normal text-[var(--color-brass-light)]">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.li>
              ))}
              <li className="mt-8 flex flex-col gap-3 text-center">
                <Link
                  href={s.reservation_href}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center justify-center gap-2 border border-[var(--color-brass-light)] px-7 py-3.5 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-brass-light)]"
                >
                  {s.reservation_label} →
                </Link>
                <a
                  href={s.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-center font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[rgba(201,163,111,0.7)]"
                >
                  {s.instagram_handle} ↗
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
