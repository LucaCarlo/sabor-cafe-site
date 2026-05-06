"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Trash2, Plus, ChevronRight } from "lucide-react";
import type { MenuCategoryRow, MenuItemRow } from "@/lib/supabase/types";
import { Field, Input, Textarea, Toggle } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import type { CategoryInput, ItemInput } from "./actions";

type Cat = {
  id?: string;
  slug: string;
  label: string;
  sub: string;
  headline: string;
  image_media_id: string | null;
  image_url_fallback: string;
  show_on_homepage: boolean;
  show_on_menu: boolean;
  position: number;
  image_url?: string | null;
  items: Item[];
};

type Item = {
  id?: string;
  category_id: string;
  name: string;
  description: string;
  price: string;
  position: number;
  show_on_homepage: boolean;
  show_on_menu: boolean;
};

export function MenuEditor({
  initial,
  onSaveCategories,
  onAddCategory,
  onDeleteCategory,
  onSaveItems,
  onAddItem,
  onDeleteItem,
}: {
  initial: Array<MenuCategoryRow & { image_url: string | null; items: MenuItemRow[] }>;
  onSaveCategories: (items: CategoryInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddCategory: (slug: string, label: string) => Promise<{ ok: boolean; error?: string; category?: MenuCategoryRow }>;
  onDeleteCategory: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onSaveItems: (items: ItemInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddItem: (categoryId: string) => Promise<{ ok: boolean; error?: string; item?: MenuItemRow }>;
  onDeleteItem: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [cats, setCats] = useState<Cat[]>(
    initial.map((c) => ({
      ...c,
      items: c.items.map((it) => ({ ...it })),
    })),
  );
  const [open, setOpen] = useState<string>(initial[0]?.id ?? "");
  const [savingCats, setSavingCats] = useState(false);
  const [savingItems, setSavingItems] = useState<string>("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");

  const updateCat = (id: string | undefined, patch: Partial<Cat>) => {
    setCats((prev) =>
      prev.map((c) =>
        (c.id ?? "") === (id ?? "") ? { ...c, ...patch } : c,
      ),
    );
  };
  const moveCat = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= cats.length) return;
    const next = cats.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setCats(next);
  };
  const removeCat = async (c: Cat) => {
    if (!confirm(`Eliminare la categoria "${c.label}" e tutti i suoi piatti?`)) return;
    if (c.id) {
      const r = await onDeleteCategory(c.id);
      if (!r.ok) return toast.error(r.error ?? "Errore");
    }
    setCats((prev) => prev.filter((x) => x.id !== c.id));
    toast.success("Categoria eliminata");
  };
  const addCat = async () => {
    if (!newCatSlug.trim() || !newCatLabel.trim())
      return toast.error("Inserisci slug ed etichetta");
    const r = await onAddCategory(newCatSlug, newCatLabel);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.category) {
      setCats((prev) => [
        ...prev,
        { ...r.category!, image_url: null, items: [] },
      ]);
      setOpen(r.category.id);
      setNewCatSlug("");
      setNewCatLabel("");
      toast.success("Categoria aggiunta");
    }
  };
  const saveCats = async () => {
    setSavingCats(true);
    try {
      const payload: CategoryInput[] = cats.map((c, i) => ({
        id: c.id,
        slug: c.slug,
        label: c.label,
        sub: c.sub,
        headline: c.headline,
        image_media_id: c.image_media_id,
        image_url_fallback: c.image_url_fallback,
        show_on_homepage: c.show_on_homepage,
        show_on_menu: c.show_on_menu,
        position: i + 1,
      }));
      const r = await onSaveCategories(payload);
      if (!r.ok) toast.error(r.error ?? "Errore");
      else toast.success("Categorie salvate");
    } finally {
      setSavingCats(false);
    }
  };

  const updateItem = (catId: string, itemId: string | undefined, patch: Partial<Item>) => {
    setCats((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              items: c.items.map((it) =>
                (it.id ?? "") === (itemId ?? "") ? { ...it, ...patch } : it,
              ),
            }
          : c,
      ),
    );
  };
  const moveItem = (catId: string, i: number, dir: -1 | 1) => {
    setCats((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const j = i + dir;
        if (j < 0 || j >= c.items.length) return c;
        const next = c.items.slice();
        [next[i], next[j]] = [next[j], next[i]];
        return { ...c, items: next };
      }),
    );
  };
  const removeItem = async (catId: string, item: Item) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    if (item.id) {
      const r = await onDeleteItem(item.id);
      if (!r.ok) return toast.error(r.error ?? "Errore");
    }
    setCats((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((x) => x.id !== item.id) } : c,
      ),
    );
    toast.success("Voce eliminata");
  };
  const addItemTo = async (catId: string) => {
    const r = await onAddItem(catId);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.item) {
      setCats((prev) =>
        prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, { ...r.item! }] } : c)),
      );
      toast.success("Voce aggiunta");
    }
  };
  const saveItemsOf = async (catId: string) => {
    setSavingItems(catId);
    try {
      const cat = cats.find((c) => c.id === catId);
      if (!cat) return;
      const payload: ItemInput[] = cat.items.map((it, i) => ({
        id: it.id,
        category_id: cat.id!,
        name: it.name,
        description: it.description,
        price: it.price,
        position: i + 1,
        show_on_homepage: it.show_on_homepage,
        show_on_menu: it.show_on_menu,
      }));
      const r = await onSaveItems(payload);
      if (!r.ok) toast.error(r.error ?? "Errore");
      else toast.success("Voci salvate");
    } finally {
      setSavingItems("");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-[var(--font-display)] text-[22px]">Categorie</h2>
        <p className="text-[13px] text-[var(--color-ink-mute)]">
          Click su una categoria per aprire le sue voci.
        </p>
      </div>

      <div className="space-y-3">
        {cats.map((c, i) => {
          const isOpen = open === c.id;
          return (
            <div key={c.id ?? i} className="border border-[var(--color-line)] bg-white">
              <header
                className="flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? "" : c.id ?? "")}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="font-[var(--font-display)] text-[18px]">{c.label || c.slug}</span>
                  <span className="ml-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
                    {c.items.length} voci · {c.show_on_homepage ? "homepage ✓" : "no homepage"} · {c.show_on_menu ? "menu ✓" : "no menu"}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveCat(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-white disabled:opacity-30"><ChevronUp size={15} /></button>
                  <button type="button" onClick={() => moveCat(i, 1)} disabled={i === cats.length - 1} className="rounded p-1 hover:bg-white disabled:opacity-30"><ChevronDown size={15} /></button>
                  <button type="button" onClick={() => removeCat(c)} className="rounded p-1 text-[var(--color-terra)] hover:bg-white"><Trash2 size={15} /></button>
                </div>
              </header>

              {isOpen && (
                <div className="space-y-6 p-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Slug (univoco, no spazi)">
                      <Input value={c.slug} onChange={(e) => updateCat(c.id, { slug: e.target.value })} />
                    </Field>
                    <Field label="Etichetta">
                      <Input value={c.label} onChange={(e) => updateCat(c.id, { label: e.target.value })} />
                    </Field>
                    <Field label="Sottotitolo (per pagina /menu)" hint="Es. 'Espressi · miscele · specialità'">
                      <Input value={c.sub} onChange={(e) => updateCat(c.id, { sub: e.target.value })} />
                    </Field>
                    <Field label="Headline (per homepage tabs)" hint="Es. 'Una tazza che racconta una scelta.'">
                      <Input value={c.headline} onChange={(e) => updateCat(c.id, { headline: e.target.value })} />
                    </Field>
                  </div>
                  <div className="md:col-span-2">
                    <ImagePicker
                      label="Immagine categoria (per homepage)"
                      value={c.image_media_id}
                      onChange={(id) => updateCat(c.id, { image_media_id: id })}
                      fallbackUrl={c.image_url ?? c.image_url_fallback}
                    />
                  </div>
                  <Field label="URL fallback foto">
                    <Input value={c.image_url_fallback} onChange={(e) => updateCat(c.id, { image_url_fallback: e.target.value })} />
                  </Field>
                  <div className="flex flex-wrap items-center gap-6">
                    <Toggle
                      checked={c.show_on_homepage}
                      onChange={(v) => updateCat(c.id, { show_on_homepage: v })}
                      label="Mostra in homepage (sezione tabs)"
                    />
                    <Toggle
                      checked={c.show_on_menu}
                      onChange={(v) => updateCat(c.id, { show_on_menu: v })}
                      label="Mostra in pagina /menu"
                    />
                  </div>

                  <div className="border-t border-[var(--color-line)] pt-5">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-[var(--font-display)] text-[18px]">Voci della categoria</h3>
                      <button
                        type="button"
                        onClick={() => c.id && addItemTo(c.id)}
                        disabled={!c.id}
                        className="inline-flex items-center gap-2 border border-[var(--color-brass)] bg-white px-3 py-1.5 text-[12px] text-[var(--color-brass-deep)] hover:bg-[var(--color-brass)] hover:text-white disabled:opacity-50"
                        title={c.id ? "Aggiungi voce" : "Salva la categoria prima di aggiungere voci"}
                      >
                        <Plus size={13} /> Aggiungi voce
                      </button>
                    </div>
                    {c.items.length === 0 ? (
                      <p className="text-[12.5px] text-[var(--color-ink-mute)]">Nessuna voce. Aggiungi la prima.</p>
                    ) : (
                      <div className="space-y-2">
                        {c.items.map((it, idx) => (
                          <div key={it.id ?? idx} className="border border-[var(--color-line)] bg-[var(--color-cream-soft)] p-3">
                            {/* Top row: reorder + delete */}
                            <div className="mb-2 flex items-center justify-between">
                              <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-brass-deep)]">
                                Voce {idx + 1}
                              </span>
                              <div className="flex items-center gap-1">
                                <button type="button" onClick={() => c.id && moveItem(c.id, idx, -1)} disabled={idx === 0} className="rounded p-1 text-[var(--color-ink-mute)] hover:bg-white hover:text-[var(--color-ink)] disabled:opacity-30"><ChevronUp size={14} /></button>
                                <button type="button" onClick={() => c.id && moveItem(c.id, idx, 1)} disabled={idx === c.items.length - 1} className="rounded p-1 text-[var(--color-ink-mute)] hover:bg-white hover:text-[var(--color-ink)] disabled:opacity-30"><ChevronDown size={14} /></button>
                                <button type="button" onClick={() => c.id && removeItem(c.id, it)} className="rounded p-1 text-[var(--color-terra)] hover:bg-white"><Trash2 size={14} /></button>
                              </div>
                            </div>
                            {/* Inputs: stack on mobile, grid on sm+ */}
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_120px]">
                              <Input placeholder="Nome" value={it.name} onChange={(e) => c.id && updateItem(c.id, it.id, { name: e.target.value })} />
                              <Input placeholder="Descrizione" value={it.description} onChange={(e) => c.id && updateItem(c.id, it.id, { description: e.target.value })} />
                              <Input placeholder="Prezzo" value={it.price} onChange={(e) => c.id && updateItem(c.id, it.id, { price: e.target.value })} />
                            </div>
                            <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
                              <Toggle checked={it.show_on_homepage} onChange={(v) => c.id && updateItem(c.id, it.id, { show_on_homepage: v })} label="Homepage" />
                              <Toggle checked={it.show_on_menu} onChange={(v) => c.id && updateItem(c.id, it.id, { show_on_menu: v })} label="Pagina /menu" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => c.id && saveItemsOf(c.id)}
                        disabled={!c.id || savingItems === c.id}
                        className="bg-[var(--color-ink)] px-5 py-2 font-[var(--font-mono)] text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60"
                      >
                        {savingItems === c.id ? "Salvataggio…" : "Salva voci di questa categoria"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border border-[var(--color-line)] bg-white p-5">
        <h3 className="font-[var(--font-display)] text-[18px]">Aggiungi nuova categoria</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input placeholder="slug (es. brunch, smoothies)" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value)} />
          <Input placeholder="Etichetta visibile (es. Brunch)" value={newCatLabel} onChange={(e) => setNewCatLabel(e.target.value)} />
          <button type="button" onClick={addCat} className="inline-flex items-center justify-center gap-2 bg-[var(--color-brass)] px-5 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)]">
            <Plus size={14} /> Aggiungi
          </button>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex items-center justify-end border-t border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-4 sm:-mx-6 sm:px-6">
        <button type="button" onClick={saveCats} disabled={savingCats} className="bg-[var(--color-ink)] px-6 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60">
          {savingCats ? "Salvataggio…" : "Salva ordine + impostazioni categorie"}
        </button>
      </div>
    </section>
  );
}
