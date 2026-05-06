"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  LayoutDashboard,
  Settings,
  Image as ImageIcon,
  Coffee,
  Newspaper,
  Sun,
  CalendarHeart,
  MapPin,
  Library,
  LogOut,
} from "lucide-react";

const items = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/settings", label: "Impostazioni", icon: Settings },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/hero", label: "Hero", icon: Sun },
  { href: "/admin/manifesto", label: "Manifesto", icon: Newspaper },
  { href: "/admin/menu", label: "Menu / Carta", icon: Coffee },
  { href: "/admin/giornata", label: "Una giornata", icon: Sun },
  { href: "/admin/eventi", label: "Eventi", icon: CalendarHeart },
  { href: "/admin/visita", label: "Visita", icon: MapPin },
  { href: "/admin/galleria", label: "Galleria", icon: Library },
  { href: "/admin/pages", label: "Pagine (SEO)", icon: Newspaper },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-[260px] shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-cream-soft)]">
      <div className="border-b border-[var(--color-line)] px-6 py-5">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-[var(--font-display)] text-[22px] leading-none brass-deep">
            Maison
          </span>
          <span className="font-[var(--font-display)] text-[18px] italic leading-none">
            Sabor
          </span>
        </Link>
        <span className="mt-1 block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
          Admin Dashboard
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {items.map((it) => {
            const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
            const Icon = it.icon;
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2.5 text-[13.5px] transition-colors",
                    active
                      ? "bg-[var(--color-brass)] text-[var(--color-cream)]"
                      : "text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-ink)]",
                  )}
                >
                  <Icon size={16} strokeWidth={1.7} />
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[var(--color-line)] px-3 py-4">
        <div className="mb-3 px-2 text-[12px] text-[var(--color-ink-mute)]">
          <div className="font-medium text-[var(--color-ink)]">Connesso come</div>
          <div className="truncate">{email}</div>
        </div>
        <div className="space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-[12.5px] text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-deep)]"
          >
            ↗ Apri sito
          </Link>
          <form action="/admin/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-[12.5px] text-[var(--color-terra)] hover:bg-[var(--color-cream-deep)]"
            >
              <LogOut size={14} /> Esci
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
