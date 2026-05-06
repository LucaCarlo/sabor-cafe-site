import { requirePermission } from "@/lib/admin/guard";
import { getGalleryCategories, getGalleryItems } from "@/lib/data/site";
import { GalleryEditor } from "./gallery-editor";
import {
  saveGalleryCategories,
  addGalleryCategory,
  deleteGalleryCategory,
  saveGalleryItems,
  addGalleryItem,
  deleteGalleryItem,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function GalleriaAdmin() {
  await requirePermission("galleria.edit");
  const [categories, items] = await Promise.all([
    getGalleryCategories(),
    getGalleryItems(),
  ]);

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Galleria
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Galleria foto
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Gestisci le foto della galleria pubblica e i filtri dinamici. Le foto si
          caricano dalla libreria media o si aggiunge un URL esterno (fallback).
        </p>
      </header>

      <GalleryEditor
        initialItems={items}
        initialCategories={categories}
        onSaveCategories={saveGalleryCategories}
        onAddCategory={addGalleryCategory}
        onDeleteCategory={deleteGalleryCategory}
        onSaveItems={saveGalleryItems}
        onAddItem={addGalleryItem}
        onDeleteItem={deleteGalleryItem}
      />
    </div>
  );
}
