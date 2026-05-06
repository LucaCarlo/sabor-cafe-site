"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import type { GalleryCategoryRow, GalleryItemRow } from "@/lib/supabase/types";
import { Field, FormSection, Input, Select } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import type { GalleryCategoryInput, GalleryItemInput } from "./actions";

type Cat = { id?: string; name: string; position: number };
type Item = {
  id?: string;
  image_media_id: string | null;
  image_url_fallback: string;
  alt: string;
  category_id: string | null;
  size: "sq" | "tall" | "wide";
  position: number;
  image_url?: string | null;
  category_name?: string | null;
};

export function GalleryEditor({
  initialCategories,
  initialItems,
  onSaveCategories,
  onAddCategory,
  onDeleteCategory,
  onSaveItems,
  onAddItem,
  onDeleteItem,
}: {
  initialCategories: GalleryCategoryRow[];
  initialItems: Array<GalleryItemRow & { image_url: string | null; category_name: string | null }>;
  onSaveCategories: (items: GalleryCategoryInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddCategory: (name: string) => Promise<{ ok: boolean; error?: string; category?: GalleryCategoryRow }>;
  onDeleteCategory: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onSaveItems: (items: GalleryItemInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddItem: () => Promise<{ ok: boolean; error?: string; item?: GalleryItemRow }>;
  onDeleteItem: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [cats, setCats] = useState<Cat[]>(initialCategories);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [newCat, setNewCat] = useState("");
  const [savingCats, setSavingCats] = useState(false);
  const [savingItems, setSavingItems] = useState(false);

  const updateCat = (i: number, patch: Partial<Cat>) =>
    setCats((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  const moveCat = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setCats(next);
  };
  const removeCat = async (c: Cat) => {
    if (!confirm(`Eliminare la categoria "${c.name}"?`)) return;
    if (c.id) {
      const r = await onDeleteCategory(c.id);
      if (!r.ok) return toast.error(r.error ?? "Errore");
    }
    setCats((prev) => prev.filter((x) => x.id !== c.id));
    toast.success("Categoria eliminata");
  };
  const addCat = async () => {
    if (!newCat.trim()) return;
    const r = await onAddCategory(newCat);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.category) {
      setCats((prev) => [...prev, r.category!]);
      setNewCat("");
      toast.success("Categoria aggiunta");
    }
  };
  const saveCats = async () => {
    setSavingCats(true);
    try {
      const payload: GalleryCategoryInput[] = cats.map((c, i) => ({
        id: c.id,
        name: c.name,
        position: i + 1,
      }));
      const r = await onSaveCategories(payload);
      if (!r.ok) toast.error(r.error ?? "Errore");
      else toast.success("Categorie galleria salvate");
    } finally {
      setSavingCats(false);
    }
  };

  const updateItem = (i: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };
  const removeItem = async (i: number) => {
    const it = items[i];
    if (!confirm("Eliminare questa foto dalla galleria?")) return;
    if (it.id) {
      const r = await onDeleteItem(it.id);
      if (!r.ok) return toast.error(r.error ?? "Errore");
    }
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    toast.success("Foto rimossa");
  };
  const addItem = async () => {
    const r = await onAddItem();
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.item) {
      setItems((prev) => [...prev, { ...r.item!, image_url: null, category_name: null }]);
      toast.success("Foto aggiunta. Scegli un'immagine.");
    }
  };
  const saveItems = async () => {
    setSavingItems(true);
    try {
      const payload: GalleryItemInput[] = items.map((it, i) => ({
        id: it.id,
        image_media_id: it.image_media_id,
        image_url_fallback: it.image_url_fallback,
        alt: it.alt,
        category_id: it.category_id,
        size: it.size,
        position: i + 1,
      }));
      const r = await onSaveItems(payload);
      if (!r.ok) toast.error(r.error ?? "Errore");
      else toast.success("Foto galleria salvate");
    } finally {
      setSavingItems(false);
    }
  };

  return (
    <div className="space-y-8">
      <FormSection title="Categorie filtro" description="Le categorie appaiono come pill di filtro sopra la galleria pubblica.">
        <div className="space-y-2">
          {cats.map((c, i) => (
            <div key={c.id ?? i} className="flex items-center gap-2">
              <Input value={c.name} onChange={(e) => updateCat(i, { name: e.target.value })} />
              <button type="button" onClick={() => moveCat(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-[var(--color-cream-deep)] disabled:opacity-30"><ChevronUp size={15} /></button>
              <button type="button" onClick={() => moveCat(i, 1)} disabled={i === cats.length - 1} className="rounded p-1 hover:bg-[var(--color-cream-deep)] disabled:opacity-30"><ChevronDown size={15} /></button>
              <button type="button" onClick={() => removeCat(c)} className="rounded p-1 text-[var(--color-terra)] hover:bg-[var(--color-cream-deep)]"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Nuova categoria (es. Cocktail)" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
          <button type="button" onClick={addCat} className="inline-flex items-center justify-center gap-2 border border-[var(--color-brass)] bg-white px-4 py-2 text-[12px] text-[var(--color-brass-deep)] hover:bg-[var(--color-brass)] hover:text-white">
            <Plus size={13} /> Aggiungi
          </button>
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={saveCats} disabled={savingCats} className="bg-[var(--color-ink)] px-5 py-2 font-[var(--font-mono)] text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60">
            {savingCats ? "Salvataggio…" : "Salva categorie"}
          </button>
        </div>
      </FormSection>

      <FormSection title="Foto della galleria">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((it, i) => (
            <div key={it.id ?? i} className="flex flex-col gap-3 border border-[var(--color-line)] bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
                  Foto {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-[var(--color-cream-deep)] disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1} className="rounded p-1 hover:bg-[var(--color-cream-deep)] disabled:opacity-30"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => removeItem(i)} className="rounded p-1 text-[var(--color-terra)] hover:bg-[var(--color-cream-deep)]"><Trash2 size={14} /></button>
                </div>
              </div>
              <ImagePicker
                value={it.image_media_id}
                onChange={(id) => updateItem(i, { image_media_id: id })}
                fallbackUrl={it.image_url ?? it.image_url_fallback}
              />
              <Field label="Testo alternativo (alt)">
                <Input value={it.alt} onChange={(e) => updateItem(i, { alt: e.target.value })} />
              </Field>
              <Field label="URL fallback (se nessun media selezionato)">
                <Input value={it.image_url_fallback} onChange={(e) => updateItem(i, { image_url_fallback: e.target.value })} />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Categoria">
                  <Select
                    value={it.category_id ?? ""}
                    onChange={(e) => updateItem(i, { category_id: e.target.value || null })}
                  >
                    <option value="">— nessuna —</option>
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </Field>
                <Field label="Formato">
                  <Select
                    value={it.size}
                    onChange={(e) => updateItem(i, { size: e.target.value as Item["size"] })}
                  >
                    <option value="sq">Quadrato</option>
                    <option value="tall">Verticale</option>
                    <option value="wide">Orizzontale</option>
                  </Select>
                </Field>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={addItem} className="inline-flex items-center gap-2 border border-[var(--color-brass)] bg-white px-4 py-2 text-[12px] text-[var(--color-brass-deep)] hover:bg-[var(--color-brass)] hover:text-white">
            <Plus size={13} /> Aggiungi foto
          </button>
          <button type="button" onClick={saveItems} disabled={savingItems} className="bg-[var(--color-ink)] px-6 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60">
            {savingItems ? "Salvataggio…" : "Salva foto galleria"}
          </button>
        </div>
      </FormSection>
    </div>
  );
}
