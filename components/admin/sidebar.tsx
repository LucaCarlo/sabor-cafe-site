"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  Users,
  Shield,
  Menu as MenuIcon,
  X,
  type LucideIcon,
} from "lucide-react";
import type { PermissionKey } from "@/lib/admin/permissions";

type Item = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  permission?: PermissionKey;
};

const ITEMS: Item[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/settings", label: "Impostazioni", icon: Settings, permission: "settings.edit" },
  { href: "/admin/media", label: "Media", icon: ImageIcon, permission: "media.view" },
  { href: "/admin/hero", label: "Hero", icon: Sun, permission: "hero.edit" },
  { href: "/admin/manifesto", label: "Manifesto", icon: Newspaper, permission: "manifesto.edit" },
  { href: "/admin/menu", label: "Menu / Carta", icon: Coffee, permission: "menu.edit" },
  { href: "/admin/giornata", label: "Una giornata", icon: Sun, permission: "giornata.edit" },
  { href: "/admin/eventi", label: "Eventi", icon: CalendarHeart, permission: "eventi.edit" },
  { href: "/admin/visita", label: "Visita", icon: MapPin, permission: "visita.edit" },
  { href: "/admin/galleria", label: "Galleria", icon: Library, permission: "galleria.edit" },
  { href: "/admin/pages", label: "Pagine (SEO)", icon: Newspaper, permission: "pages.edit" },
  { href: "/admin/users", label: "Utenti admin", icon: Users, permission: "users.manage" },
  { href: "/admin/roles", label: "Ruoli e permessi", icon: Shield, permission: "roles.manage" },
];

export function AdminSidebar({
  email,
  displayName,
  roleName,
  isSuper,
  permissions,
}: {
  email: string;
  displayName: string;
  roleName: string;
  isSuper: boolean;
  permissions: PermissionKey[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const can = (k?: PermissionKey) => !k || isSuper || permissions.includes(k);
  const visible = ITEMS.filter((it) => can(it.permission));

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer open
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const currentLabel =
    visible.find((it) => (it.exact ? pathname === it.href : pathname.startsWith(it.href)))
      ?.label ?? "Admin";

  return (
    <>
      {/* Mobile topbar */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Apri menu"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-cream-deep)]"
        >
          <MenuIcon size={18} strokeWidth={1.7} />
        </button>
        <Link href="/admin" className="flex flex-1 items-baseline gap-2 truncate">
          <span className="font-[var(--font-display)] text-[20px] leading-none brass-deep">
            Sabor
          </span>
          <span className="font-[var(--font-display)] text-[16px] italic leading-none">
            Cafè
          </span>
          <span className="ml-auto truncate font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
            {currentLabel}
          </span>
        </Link>
      </header>

      {/* Backdrop (mobile only) */}
      {open && (
        <button
          type="button"
          aria-label="Chiudi menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/45 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-[100dvh] w-[280px] shrink-0 flex-col border-r border-[var(--color-line)] bg-[var(--color-cream-soft)] transition-transform duration-300 ease-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-5">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="font-[var(--font-display)] text-[22px] leading-none brass-deep">
              Sabor
            </span>
            <span className="font-[var(--font-display)] text-[18px] italic leading-none">
              Cafè
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Chiudi menu"
            className="lg:hidden flex h-9 w-9 items-center justify-center rounded-md text-[var(--color-ink-mute)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-ink)]"
          >
            <X size={18} />
          </button>
        </div>
        <span className="px-5 py-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
          Admin Dashboard
        </span>

        <nav className="flex-1 overflow-y-auto px-3 pb-3 pt-2">
          <ul className="space-y-1">
            {visible.map((it) => {
              const active = it.exact ? pathname === it.href : pathname.startsWith(it.href);
              const Icon = it.icon;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] transition-colors",
                      active
                        ? "bg-[var(--color-brass)] text-[var(--color-cream)]"
                        : "text-[var(--color-ink-soft)] hover:bg-[var(--color-cream-deep)] hover:text-[var(--color-ink)]",
                    )}
                  >
                    <Icon size={17} strokeWidth={1.7} />
                    {it.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[var(--color-line)] px-3 py-4">
          <div className="mb-3 px-2 text-[12px] text-[var(--color-ink-mute)]">
            <div className="font-medium text-[var(--color-ink)]">
              {displayName || email.split("@")[0]}
            </div>
            <div className="truncate">{email}</div>
            {roleName && (
              <div className="mt-1 inline-flex items-center gap-1 rounded bg-[var(--color-brass)]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[var(--color-brass-deep)]">
                {roleName}
              </div>
            )}
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
    </>
  );
}
