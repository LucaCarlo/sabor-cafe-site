import Link from "next/link";
import { requireAdmin } from "@/lib/admin/guard";
import {
  Settings,
  Image as ImageIcon,
  Coffee,
  Newspaper,
  Sun,
  Sunrise,
  CalendarHeart,
  MapPin,
  Library,
  Users,
  Shield,
  FileText,
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

type CardGroup = {
  title: string;
  description?: string;
  cards: Card[];
};

const GROUPS: CardGroup[] = [
  {
    title: "Generali",
    description: "Configurazione del sito, accessi e permessi.",
    cards: [
      { href: "/admin/settings", icon: Settings, title: "Impostazioni", description: "Brand, contatti, orari, social, SEO globale.", permission: "settings.edit" },
      { href: "/admin/users", icon: Users, title: "Utenti admin", description: "Crea altri admin, assegna ruoli, cambia password.", permission: "users.manage" },
      { href: "/admin/roles", icon: Shield, title: "Ruoli e permessi", description: "Definisci cosa può fare ogni utente.", permission: "roles.manage" },
    ],
  },
  {
    title: "Gestione homepage",
    description: "Le sezioni della homepage, in ordine di apparizione.",
    cards: [
      { href: "/admin/hero", icon: Sun, title: "Hero", description: "Titolo, sottotitolo, foto principale, pulsanti.", permission: "hero.edit" },
      { href: "/admin/manifesto", icon: Newspaper, title: "Manifesto", description: "Sezione editoriale con i tre pilastri.", permission: "manifesto.edit" },
      { href: "/admin/carta", icon: Coffee, title: "Carta", description: "Paragrafo della sezione 'Carta' in homepage (kicker, titolo, CTA).", permission: "menu.edit" },
      { href: "/admin/giornata", icon: Sunrise, title: "Una giornata", description: "Mattina · Pomeriggio · Sera (modificabili).", permission: "giornata.edit" },
      { href: "/admin/eventi", icon: CalendarHeart, title: "Eventi privati", description: "Aperitivi aziendali, compleanni, presentazioni.", permission: "eventi.edit" },
      { href: "/admin/visita", icon: MapPin, title: "Visita", description: "Sezione contatti homepage e card prenotazioni.", permission: "visita.edit" },
    ],
  },
  {
    title: "Gestione contenuti",
    description: "I contenuti che appaiono sulle pagine interne.",
    cards: [
      { href: "/admin/menu", icon: Coffee, title: "Menu", description: "Categorie, sottocategorie e voci del menu.", permission: "menu.edit" },
      { href: "/admin/galleria", icon: Library, title: "Galleria", description: "Foto, categorie, ordine. Filtri dinamici.", permission: "galleria.edit" },
    ],
  },
  {
    title: "Configurazione",
    cards: [
      { href: "/admin/pages", icon: FileText, title: "Pagine (SEO)", description: "Header e meta delle pagine /menu, /galleria, /contatti.", permission: "pages.edit" },
      { href: "/admin/media", icon: ImageIcon, title: "Media", description: "Carica foto. Vengono ridimensionate e convertite in WebP.", permission: "media.view" },
    ],
  },
];

export default async function AdminHome() {
  const me = await requireAdmin();
  const visibleGroups = GROUPS
    .map((g) => ({
      ...g,
      cards: g.cards.filter((c) => me.is_super || me.permissions.includes(c.permission)),
    }))
    .filter((g) => g.cards.length > 0);
  const totalVisible = visibleGroups.reduce((s, g) => s + g.cards.length, 0);

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

      {totalVisible === 0 ? (
        <p className="border border-[var(--color-line)] bg-white p-8 text-center text-[14px] text-[var(--color-ink-mute)]">
          Il tuo ruolo non ha permessi attivi. Chiedi al Superadmin di assegnartene almeno uno.
        </p>
      ) : (
        <div className="space-y-10">
          {visibleGroups.map((g) => (
            <section key={g.title}>
              <header className="mb-4 border-b border-[var(--color-line)] pb-2">
                <h2 className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.28em] text-[var(--color-brass-deep)]">
                  {g.title}
                </h2>
                {g.description && (
                  <p className="mt-1 text-[12.5px] text-[var(--color-ink-mute)]">{g.description}</p>
                )}
              </header>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {g.cards.map((c) => {
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
                      <h3 className="font-[var(--font-display)] text-[20px]">{c.title}</h3>
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
