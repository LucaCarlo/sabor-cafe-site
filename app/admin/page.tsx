import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import {
  Settings,
  Image as ImageIcon,
  Coffee,
  Newspaper,
  Sun,
  CalendarHeart,
  MapPin,
  Library,
} from "lucide-react";

export const dynamic = "force-dynamic";

const cards = [
  {
    href: "/admin/settings",
    icon: Settings,
    title: "Impostazioni",
    description: "Brand, contatti, orari, social, SEO globale.",
  },
  {
    href: "/admin/media",
    icon: ImageIcon,
    title: "Libreria media",
    description: "Carica foto. Vengono ridimensionate e convertite in WebP.",
  },
  {
    href: "/admin/hero",
    icon: Sun,
    title: "Hero homepage",
    description: "Titolo, sottotitolo, foto principale, pulsanti.",
  },
  {
    href: "/admin/manifesto",
    icon: Newspaper,
    title: "Manifesto",
    description: "Sezione editoriale con i tre pilastri.",
  },
  {
    href: "/admin/menu",
    icon: Coffee,
    title: "Menu / Carta",
    description: "Categorie e voci del menu (caffè, cucina, aperitivo…).",
  },
  {
    href: "/admin/giornata",
    icon: Sun,
    title: "Una giornata",
    description: "Mattina · Pomeriggio · Sera (modificabili).",
  },
  {
    href: "/admin/eventi",
    icon: CalendarHeart,
    title: "Eventi privati",
    description: "Aperitivi aziendali, compleanni, presentazioni.",
  },
  {
    href: "/admin/visita",
    icon: MapPin,
    title: "Visita",
    description: "Sezione contatti homepage e card prenotazioni.",
  },
  {
    href: "/admin/galleria",
    icon: Library,
    title: "Galleria",
    description: "Foto, categorie, ordine. Filtri dinamici.",
  },
];

export default async function AdminHome() {
  const me = await requireAdmin();
  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Benvenuto
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[34px] leading-tight">
          Ciao, <span className="italic brass-deep">{me.email?.split("@")[0]}</span>.
        </h1>
        <p className="mt-2 max-w-[60ch] text-[14.5px] text-[var(--color-ink-mute)]">
          Da qui puoi modificare ogni contenuto del sito: testi, immagini,
          categorie del menu, orari, social, SEO. Le modifiche sono live appena
          salvi.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col gap-3 border border-[var(--color-line)] bg-white p-5 transition-colors hover:border-[var(--color-brass)]"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-brass)]/40 text-[var(--color-brass-deep)] transition-colors group-hover:bg-[var(--color-brass)] group-hover:text-[var(--color-cream)]">
                <Icon size={18} strokeWidth={1.6} />
              </span>
              <h2 className="font-[var(--font-display)] text-[20px]">{c.title}</h2>
              <p className="text-[13.5px] leading-[1.6] text-[var(--color-ink-mute)]">
                {c.description}
              </p>
              <span className="mt-1 inline-flex items-center gap-1.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
                Apri →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
