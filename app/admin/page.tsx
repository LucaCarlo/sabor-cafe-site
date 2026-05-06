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
  Users,
  Shield,
  type LucideIcon,
} from "lucide-react";
import type { PermissionKey } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

type Card = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  permission: PermissionKey;
};

const ALL_CARDS: Card[] = [
  { href: "/admin/settings", icon: Settings, title: "Impostazioni", description: "Brand, contatti, orari, social, SEO globale.", permission: "settings.edit" },
  { href: "/admin/media", icon: ImageIcon, title: "Libreria media", description: "Carica foto. Vengono ridimensionate e convertite in WebP.", permission: "media.view" },
  { href: "/admin/hero", icon: Sun, title: "Hero homepage", description: "Titolo, sottotitolo, foto principale, pulsanti.", permission: "hero.edit" },
  { href: "/admin/manifesto", icon: Newspaper, title: "Manifesto", description: "Sezione editoriale con i tre pilastri.", permission: "manifesto.edit" },
  { href: "/admin/menu", icon: Coffee, title: "Menu / Carta", description: "Categorie e voci del menu (caffè, cucina, aperitivo…).", permission: "menu.edit" },
  { href: "/admin/giornata", icon: Sun, title: "Una giornata", description: "Mattina · Pomeriggio · Sera (modificabili).", permission: "giornata.edit" },
  { href: "/admin/eventi", icon: CalendarHeart, title: "Eventi privati", description: "Aperitivi aziendali, compleanni, presentazioni.", permission: "eventi.edit" },
  { href: "/admin/visita", icon: MapPin, title: "Visita", description: "Sezione contatti homepage e card prenotazioni.", permission: "visita.edit" },
  { href: "/admin/galleria", icon: Library, title: "Galleria", description: "Foto, categorie, ordine. Filtri dinamici.", permission: "galleria.edit" },
  { href: "/admin/pages", icon: Newspaper, title: "Pagine (SEO)", description: "Header e meta delle pagine /menu, /galleria, /contatti.", permission: "pages.edit" },
  { href: "/admin/users", icon: Users, title: "Utenti admin", description: "Crea altri admin, assegna ruoli, cambia password.", permission: "users.manage" },
  { href: "/admin/roles", icon: Shield, title: "Ruoli e permessi", description: "Definisci cosa può fare ogni utente.", permission: "roles.manage" },
];

export default async function AdminHome() {
  const me = await requireAdmin();
  const visible = ALL_CARDS.filter((c) => me.is_super || me.permissions.includes(c.permission));

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Benvenuto
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[34px] leading-tight">
          Ciao,{" "}
          <span className="italic brass-deep">
            {me.display_name || me.email.split("@")[0]}
          </span>
          .
        </h1>
        <p className="mt-2 max-w-[60ch] text-[14.5px] text-[var(--color-ink-mute)]">
          {me.is_super
            ? "Sei Superadmin: hai accesso a tutto. Da qui puoi modificare ogni contenuto del sito."
            : `Stai usando il ruolo "${me.role_name}". Vedi solo le sezioni a cui hai accesso.`}
        </p>
      </header>

      {visible.length === 0 ? (
        <p className="border border-[var(--color-line)] bg-white p-8 text-center text-[14px] text-[var(--color-ink-mute)]">
          Il tuo ruolo non ha permessi attivi. Chiedi al Superadmin di assegnartene almeno uno.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((c) => {
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
      )}
    </div>
  );
}
