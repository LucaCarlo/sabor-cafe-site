"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin } from "lucide-react";

const days = [
  "Domenica",
  "Lunedì",
  "Martedì",
  "Mercoledì",
  "Giovedì",
  "Venerdì",
  "Sabato",
];

const months = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];

export type LiveStripSettings = {
  hours_weekday: string;
  city: string;
  instagram_url: string;
  instagram_handle: string;
  open_hour: number;
  close_hour: number;
};

const DEFAULTS: LiveStripSettings = {
  hours_weekday: "07:00 — 23:00",
  city: "Civitanova Marche",
  instagram_url: "https://www.instagram.com/sabor.cafe/",
  instagram_handle: "@sabor.cafe",
  open_hour: 7,
  close_hour: 23,
};

export function LiveStrip({ settings = DEFAULTS }: { settings?: LiveStripSettings }) {
  const s = { ...DEFAULTS, ...settings };
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
    : "--:--";
  const date = now ? `${now.getDate()} ${months[now.getMonth()]}` : "—";
  const day = now ? days[now.getDay()] : "—";
  const isOpen = now ? now.getHours() >= s.open_hour && now.getHours() < s.close_hour : true;

  return (
    <div className="bg-[var(--color-brass-deep)] text-[var(--color-cream)]">
      <div className="container-x mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-y-3 py-4 font-[var(--font-mono)] text-[11px]">
        <div className="flex items-center gap-2.5 uppercase tracking-[0.2em]">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              isOpen ? "bg-[var(--color-brass-light)]" : "bg-[var(--color-terra)]"
            }`}
            aria-hidden="true"
          />
          <span>{isOpen ? "Aperti adesso" : "Chiusi"}</span>
          <span className="text-[var(--color-brass-pale)]/60">·</span>
          <span className="text-[var(--color-brass-pale)]">
            {day}, {date} · {time}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-2 uppercase tracking-[0.2em] text-[var(--color-brass-pale)]">
          <span className="inline-flex items-center gap-2">
            <Clock size={12} strokeWidth={1.6} />
            {s.hours_weekday}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin size={12} strokeWidth={1.6} />
            {s.city}
          </span>
        </div>

        <a
          href={s.instagram_url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-[var(--font-mono)] uppercase tracking-[0.2em] text-[var(--color-cream)] transition-colors hover:text-[var(--color-brass-light)]"
        >
          {s.instagram_handle} ↗
        </a>
      </div>
    </div>
  );
}
