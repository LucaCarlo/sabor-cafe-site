// Single source of truth per i permessi disponibili nella dashboard.
// Se aggiungi una nuova area admin, registra qui il permesso e poi
// proteggi la route con requirePermission(key).

export type PermissionKey =
  | "settings.edit"
  | "media.view"
  | "media.upload"
  | "media.delete"
  | "hero.edit"
  | "manifesto.edit"
  | "menu.edit"
  | "giornata.edit"
  | "eventi.edit"
  | "visita.edit"
  | "galleria.edit"
  | "pages.edit"
  | "users.manage"
  | "roles.manage";

export type PermissionDef = {
  key: PermissionKey;
  label: string;
  description: string;
  group: "Contenuti" | "Media" | "Configurazione" | "Sistema";
};

export const PERMISSIONS: PermissionDef[] = [
  { key: "hero.edit", label: "Modifica Hero", description: "Sezione principale della homepage.", group: "Contenuti" },
  { key: "manifesto.edit", label: "Modifica Manifesto", description: "Sezione editoriale + 3 pilastri.", group: "Contenuti" },
  { key: "menu.edit", label: "Gestione Menu / Carta", description: "Categorie e voci del menu.", group: "Contenuti" },
  { key: "giornata.edit", label: "Modifica Una giornata", description: "Momenti mattina/pomeriggio/sera.", group: "Contenuti" },
  { key: "eventi.edit", label: "Gestione Eventi privati", description: "Tipologie di eventi.", group: "Contenuti" },
  { key: "visita.edit", label: "Modifica sezione Visita", description: "Card prenotazioni homepage.", group: "Contenuti" },
  { key: "galleria.edit", label: "Gestione Galleria", description: "Foto e categorie filtro.", group: "Contenuti" },
  { key: "pages.edit", label: "SEO Pagine", description: "Titoli, meta description, header foto.", group: "Contenuti" },

  { key: "media.view", label: "Visualizza libreria media", description: "Vedere le foto caricate.", group: "Media" },
  { key: "media.upload", label: "Carica nuovi media", description: "Upload foto (auto-resize WebP).", group: "Media" },
  { key: "media.delete", label: "Elimina media", description: "Rimuovere foto dalla libreria.", group: "Media" },

  { key: "settings.edit", label: "Modifica Impostazioni globali", description: "Brand, contatti, social, orari, SEO.", group: "Configurazione" },

  { key: "users.manage", label: "Gestione Utenti admin", description: "Creare, modificare, eliminare utenti.", group: "Sistema" },
  { key: "roles.manage", label: "Gestione Ruoli e permessi", description: "Creare ruoli e definire permessi.", group: "Sistema" },
];

export const ALL_PERMISSION_KEYS = PERMISSIONS.map((p) => p.key) as PermissionKey[];

export function permissionLabel(key: string): string {
  return PERMISSIONS.find((p) => p.key === key)?.label ?? key;
}
