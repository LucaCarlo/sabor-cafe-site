"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  ChevronRight,
  FolderTree,
} from "lucide-react";
import type {
  MenuCategoryRow,
  MenuItemRow,
  MenuSubcategoryRow,
} from "@/lib/supabase/types";
import { Field, Input, Select, Toggle } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import type {
  CategoryInput,
  ItemInput,
  SubcategoryInput,
} from "./actions";

type Item = {
  id?: string;
  category_id: string;
  subcategory_id: string | null;
  name: string;
  description: string;
  price: string;
  position: number;
  show_on_homepage: boolean;
  show_on_menu: boolean;
};

type Sub = {
  id: string;
  category_id: string;
  label: string;
  position: number;
};

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
  subcategories: Sub[];
  items: Item[];
};

const NO_SUB = "__none__";

export function MenuEditor({
  initial,
  onSaveCategories,
  onAddCategory,
  onDeleteCategory,
  onSaveSubcategories,
  onAddSubcategory,
  onDeleteSubcategory,
  onSaveItems,
  onAddItem,
  onDeleteItem,
}: {
  initial: Array<
    MenuCategoryRow & {
      image_url: string | null;
      subcategories: MenuSubcategoryRow[];
      items: MenuItemRow[];
    }
  >;
  onSaveCategories: (items: CategoryInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddCategory: (slug: string, label: string) => Promise<{ ok: boolean; error?: string; category?: MenuCategoryRow }>;
  onDeleteCategory: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onSaveSubcategories: (items: SubcategoryInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddSubcategory: (categoryId: string, label?: string) => Promise<{ ok: boolean; error?: string; subcategory?: MenuSubcategoryRow }>;
  onDeleteSubcategory: (id: string) => Promise<{ ok: boolean; error?: string }>;
  onSaveItems: (items: ItemInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAddItem: (categoryId: string, subcategoryId: string | null) => Promise<{ ok: boolean; error?: string; item?: MenuItemRow }>;
  onDeleteItem: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [cats, setCats] = useState<Cat[]>(
    initial.map((c) => ({
      ...c,
      subcategories: (c.subcategories ?? []).map((s) => ({ ...s })),
      items: (c.items ?? []).map((it) => ({ ...it })),
    })),
  );
  const [open, setOpen] = useState<string>(initial[0]?.id ?? "");
  const [savingCats, setSavingCats] = useState(false);
  const [savingContent, setSavingContent] = useState<string>("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatLabel, setNewCatLabel] = useState("");

  // ---- helpers categoria ----
  const updateCat = (id: string | undefined, patch: Partial<Cat>) => {
    setCats((prev) =>
      prev.map((c) => ((c.id ?? "") === (id ?? "") ? { ...c, ...patch } : c)),
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
    if (
      !confirm(
        `Eliminare la categoria "${c.label}" e tutte le sue sottocategorie e voci?`,
      )
    )
      return;
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
        { ...r.category!, image_url: null, subcategories: [], items: [] },
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

  // ---- helpers sottocategoria ----
  const addSub = async (cat: Cat) => {
    if (!cat.id) return;
    const r = await onAddSubcategory(cat.id);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.subcategory) {
      setCats((prev) =>
        prev.map((c) =>
          c.id === cat.id
            ? { ...c, subcategories: [...c.subcategories, { ...r.subcategory! }] }
            : c,
        ),
      );
      toast.success("Sottocategoria aggiunta");
    }
  };
  const removeSub = async (cat: Cat, sub: Sub) => {
    if (
      !confirm(
        `Eliminare la sottocategoria "${sub.label}"? Le voci collegate non verranno cancellate, torneranno sotto la categoria.`,
      )
    )
      return;
    const r = await onDeleteSubcategory(sub.id);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    setCats((prev) =>
      prev.map((c) =>
        c.id === cat.id
          ? {
              ...c,
              subcategories: c.subcategories.filter((s) => s.id !== sub.id),
              items: c.items.map((it) =>
                it.subcategory_id === sub.id ? { ...it, subcategory_id: null } : it,
              ),
            }
          : c,
      ),
    );
    toast.success("Sottocategoria eliminata");
  };
  const updateSub = (catId: string, subId: string, patch: Partial<Sub>) => {
    setCats((prev) =>
      prev.map((c) =>
        c.id === catId
          ? {
              ...c,
              subcategories: c.subcategories.map((s) =>
                s.id === subId ? { ...s, ...patch } : s,
              ),
            }
          : c,
      ),
    );
  };
  const moveSub = (catId: string, i: number, dir: -1 | 1) => {
    setCats((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const j = i + dir;
        if (j < 0 || j >= c.subcategories.length) return c;
        const next = c.subcategories.slice();
        [next[i], next[j]] = [next[j], next[i]];
        return { ...c, subcategories: next };
      }),
    );
  };

  // ---- helpers voci ----
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
  // Sposta una voce su/giù tra le voci dello stesso gruppo (stesso subcategory_id).
  const moveItem = (catId: string, itemId: string, dir: -1 | 1) => {
    setCats((prev) =>
      prev.map((c) => {
        if (c.id !== catId) return c;
        const items = c.items.slice().sort((a, b) => a.position - b.position);
        const idx = items.findIndex((x) => x.id === itemId);
        if (idx < 0) return c;
        const cur = items[idx];
        const groupIds = items
          .map((x, i) => ({ x, i }))
          .filter(({ x }) => (x.subcategory_id ?? null) === (cur.subcategory_id ?? null))
          .map(({ i }) => i);
        const k = groupIds.indexOf(idx);
        const target = groupIds[k + dir];
        if (target == null) return c;
        const a = items[idx];
        const b = items[target];
        const newItems = items.slice();
        newItems[idx] = { ...a, position: b.position };
        newItems[target] = { ...b, position: a.position };
        return { ...c, items: newItems };
      }),
    );
  };
  const removeItem = async (cat: Cat, item: Item) => {
    if (!confirm(`Eliminare "${item.name}"?`)) return;
    if (item.id) {
      const r = await onDeleteItem(item.id);
      if (!r.ok) return toast.error(r.error ?? "Errore");
    }
    setCats((prev) =>
      prev.map((c) =>
        c.id === cat.id ? { ...c, items: c.items.filter((x) => x.id !== item.id) } : c,
      ),
    );
    toast.success("Voce eliminata");
  };
  const addItemTo = async (cat: Cat, subcategoryId: string | null) => {
    if (!cat.id) return;
    const r = await onAddItem(cat.id, subcategoryId);
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.item) {
      setCats((prev) =>
        prev.map((c) =>
          c.id === cat.id ? { ...c, items: [...c.items, { ...r.item! }] } : c,
        ),
      );
      toast.success("Voce aggiunta");
    }
  };

  // ---- save di tutto il contenuto della categoria (sottocategorie + voci) ----
  const saveContent = async (cat: Cat) => {
    if (!cat.id) return;
    setSavingContent(cat.id);
    try {
      // 1) Sottocategorie (label + ordine)
      const subPayload: SubcategoryInput[] = cat.subcategories.map((s, i) => ({
        id: s.id,
        label: s.label.trim() || "Senza nome",
        position: i + 1,
      }));
      const r1 = await onSaveSubcategories(subPayload);
      if (!r1.ok) return toast.error(r1.error ?? "Errore (sottocategorie)");
      // 2) Voci (con subcategory_id e ordine basato su position)
      const sortedItems = cat.items.slice().sort((a, b) => a.position - b.position);
      const itemPayload: ItemInput[] = sortedItems.map((it, i) => ({
        id: it.id,
        category_id: cat.id!,
        subcategory_id: it.subcategory_id,
        name: it.name,
        description: it.description,
        price: it.price,
        position: i + 1,
        show_on_homepage: it.show_on_homepage,
        show_on_menu: it.show_on_menu,
      }));
      const r2 = await onSaveItems(itemPayload);
      if (!r2.ok) return toast.error(r2.error ?? "Errore (voci)");
      toast.success("Salvato");
    } finally {
      setSavingContent("");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-[var(--font-display)] text-[22px]">Categorie</h2>
        <p className="text-[13px] text-[var(--color-ink-mute)]">
          Click su una categoria per aprire il suo contenuto. Dentro puoi creare
          sottocategorie e voci, riordinarle con le freccette, spostare una voce in
          un&apos;altra sottocategoria con il menu a tendina.
        </p>
      </div>

      <div className="space-y-3">
        {cats.map((c, i) => {
          const isOpen = open === c.id;
          return (
            <div key={c.id ?? i} className="border border-[var(--color-line)] bg-white">
              <header className="flex items-center gap-3 border-b border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? "" : c.id ?? "")}
                  className="flex flex-1 items-center gap-2 text-left"
                >
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <span className="font-[var(--font-display)] text-[18px]">
                    {c.label || c.slug}
                  </span>
                  <span className="ml-3 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
                    {c.subcategories.length} sottocat · {c.items.length} voci ·{" "}
                    {c.show_on_homepage ? "homepage ✓" : "no homepage"} ·{" "}
                    {c.show_on_menu ? "menu ✓" : "no menu"}
                  </span>
                </button>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => moveCat(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-white disabled:opacity-30"><ChevronUp size={15} /></button>
                  <button type="button" onClick={() => moveCat(i, 1)} disabled={i === cats.length - 1} className="rounded p-1 hover:bg-white disabled:opacity-30"><ChevronDown size={15} /></button>
                  <button type="button" onClick={() => removeCat(c)} className="rounded p-1 text-[var(--color-terra)] hover:bg-white"><Trash2 size={15} /></button>
                </div>
              </header>

              {isOpen && (
                <div className="space-y-7 p-5">
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

                  {/* Albero: sottocategorie + voci dirette */}
                  <CategoryTree
                    cat={c}
                    onAddSubcategory={() => addSub(c)}
                    onRemoveSubcategory={(s) => removeSub(c, s)}
                    onMoveSubcategory={(idx, dir) => c.id && moveSub(c.id, idx, dir)}
                    onUpdateSubcategory={(sid, patch) => c.id && updateSub(c.id, sid, patch)}
                    onAddItem={(subId) => addItemTo(c, subId)}
                    onRemoveItem={(it) => removeItem(c, it)}
                    onMoveItem={(itId, dir) => c.id && moveItem(c.id, itId, dir)}
                    onUpdateItem={(itId, patch) => c.id && updateItem(c.id, itId, patch)}
                  />

                  <div className="flex justify-end border-t border-[var(--color-line)] pt-4">
                    <button
                      type="button"
                      onClick={() => saveContent(c)}
                      disabled={!c.id || savingContent === c.id}
                      className="bg-[var(--color-ink)] px-5 py-2 font-[var(--font-mono)] text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60"
                    >
                      {savingContent === c.id ? "Salvataggio…" : "Salva sottocategorie + voci"}
                    </button>
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

// ---------- Sotto-componente: albero di una categoria ----------

function CategoryTree({
  cat,
  onAddSubcategory,
  onRemoveSubcategory,
  onMoveSubcategory,
  onUpdateSubcategory,
  onAddItem,
  onRemoveItem,
  onMoveItem,
  onUpdateItem,
}: {
  cat: Cat;
  onAddSubcategory: () => void;
  onRemoveSubcategory: (s: Sub) => void;
  onMoveSubcategory: (idx: number, dir: -1 | 1) => void;
  onUpdateSubcategory: (subId: string, patch: Partial<Sub>) => void;
  onAddItem: (subcategoryId: string | null) => void;
  onRemoveItem: (it: Item) => void;
  onMoveItem: (itId: string, dir: -1 | 1) => void;
  onUpdateItem: (itId: string, patch: Partial<Item>) => void;
}) {
  // Voci raggruppate per subcategory_id
  const groups = useMemo(() => {
    const sorted = cat.items.slice().sort((a, b) => a.position - b.position);
    const direct = sorted.filter((it) => !it.subcategory_id);
    const bySub = new Map<string, Item[]>();
    for (const s of cat.subcategories) bySub.set(s.id, []);
    for (const it of sorted) {
      if (it.subcategory_id && bySub.has(it.subcategory_id)) {
        bySub.get(it.subcategory_id)!.push(it);
      }
    }
    return { direct, bySub };
  }, [cat.items, cat.subcategories]);

  const subOptions = [
    { value: NO_SUB, label: "— senza sottocategoria —" },
    ...cat.subcategories.map((s) => ({ value: s.id, label: s.label || "(senza nome)" })),
  ];

  return (
    <div className="border-t border-[var(--color-line)] pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-[var(--font-display)] text-[18px]">
          <FolderTree size={16} className="text-[var(--color-brass-deep)]" />
          Sottocategorie e voci
        </h3>
      </div>

      {/* Voci dirette (senza sottocategoria) */}
      <SubcategoryBlock
        title="Voci dirette"
        subtitle="Voci senza sottocategoria. Nella pagina /menu compaiono in cima alla categoria, senza sotto-titolo."
        items={groups.direct}
        subOptions={subOptions}
        onAddItem={() => onAddItem(null)}
        onRemoveItem={onRemoveItem}
        onMoveItem={onMoveItem}
        onUpdateItem={onUpdateItem}
      />

      {/* Sottocategorie */}
      <div className="mt-6 space-y-4">
        {cat.subcategories.map((s, idx) => (
          <SubcategoryBlock
            key={s.id}
            sub={s}
            isFirst={idx === 0}
            isLast={idx === cat.subcategories.length - 1}
            items={groups.bySub.get(s.id) ?? []}
            subOptions={subOptions}
            onRenameSub={(label) => onUpdateSubcategory(s.id, { label })}
            onMoveSub={(dir) => onMoveSubcategory(idx, dir)}
            onDeleteSub={() => onRemoveSubcategory(s)}
            onAddItem={() => onAddItem(s.id)}
            onRemoveItem={onRemoveItem}
            onMoveItem={onMoveItem}
            onUpdateItem={onUpdateItem}
          />
        ))}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onAddSubcategory}
          disabled={!cat.id}
          className="inline-flex items-center gap-2 border border-dashed border-[var(--color-brass)] bg-white px-4 py-2 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)] hover:bg-[var(--color-brass)] hover:text-white disabled:opacity-50"
          title={cat.id ? "Aggiungi sottocategoria" : "Salva la categoria prima di aggiungere sottocategorie"}
        >
          <Plus size={13} /> Aggiungi sottocategoria
        </button>
      </div>
    </div>
  );
}

// ---------- Sotto-componente: blocco di una sottocategoria (o "voci dirette") ----------

function SubcategoryBlock({
  sub,
  isFirst,
  isLast,
  title,
  subtitle,
  items,
  subOptions,
  onRenameSub,
  onMoveSub,
  onDeleteSub,
  onAddItem,
  onRemoveItem,
  onMoveItem,
  onUpdateItem,
}: {
  sub?: Sub;
  isFirst?: boolean;
  isLast?: boolean;
  title?: string;
  subtitle?: string;
  items: Item[];
  subOptions: { value: string; label: string }[];
  onRenameSub?: (label: string) => void;
  onMoveSub?: (dir: -1 | 1) => void;
  onDeleteSub?: () => void;
  onAddItem: () => void;
  onRemoveItem: (it: Item) => void;
  onMoveItem: (itId: string, dir: -1 | 1) => void;
  onUpdateItem: (itId: string, patch: Partial<Item>) => void;
}) {
  const isDirect = !sub;
  // Nascondi del tutto il blocco "voci dirette" se vuoto: non aggiunge nulla.
  if (isDirect && items.length === 0) return null;

  return (
    <div className={`border ${isDirect ? "border-dashed border-[var(--color-line)]" : "border-[var(--color-brass)]/40"} bg-[var(--color-cream-soft)]`}>
      <header className="flex items-center gap-3 border-b border-[var(--color-line)] bg-white px-3 py-2">
        {isDirect ? (
          <div className="flex flex-1 flex-col">
            <span className="font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
              {title}
            </span>
            {subtitle && (
              <span className="text-[11.5px] text-[var(--color-ink-mute)]">{subtitle}</span>
            )}
          </div>
        ) : (
          <>
            <Input
              value={sub!.label}
              onChange={(e) => onRenameSub?.(e.target.value)}
              placeholder="Nome sottocategoria"
              className="!py-1.5 font-[var(--font-display)] !text-[15px]"
            />
            <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-ink-mute)]">
              {items.length} voci
            </span>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => onMoveSub?.(-1)} disabled={isFirst} className="rounded p-1 hover:bg-[var(--color-cream-soft)] disabled:opacity-30"><ChevronUp size={14} /></button>
              <button type="button" onClick={() => onMoveSub?.(1)} disabled={isLast} className="rounded p-1 hover:bg-[var(--color-cream-soft)] disabled:opacity-30"><ChevronDown size={14} /></button>
              <button type="button" onClick={() => onDeleteSub?.()} className="rounded p-1 text-[var(--color-terra)] hover:bg-[var(--color-cream-soft)]"><Trash2 size={14} /></button>
            </div>
          </>
        )}
      </header>

      <div className="space-y-2 p-3">
        {items.length === 0 ? (
          <p className="text-[12.5px] text-[var(--color-ink-mute)]">Nessuna voce. Aggiungi la prima.</p>
        ) : (
          items.map((it, idx) => (
            <div key={it.id ?? idx} className="border border-[var(--color-line)] bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-brass-deep)]">
                  Voce {idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => it.id && onMoveItem(it.id, -1)} disabled={idx === 0} className="rounded p-1 text-[var(--color-ink-mute)] hover:bg-[var(--color-cream-soft)] hover:text-[var(--color-ink)] disabled:opacity-30"><ChevronUp size={14} /></button>
                  <button type="button" onClick={() => it.id && onMoveItem(it.id, 1)} disabled={idx === items.length - 1} className="rounded p-1 text-[var(--color-ink-mute)] hover:bg-[var(--color-cream-soft)] hover:text-[var(--color-ink)] disabled:opacity-30"><ChevronDown size={14} /></button>
                  <button type="button" onClick={() => onRemoveItem(it)} className="rounded p-1 text-[var(--color-terra)] hover:bg-[var(--color-cream-soft)]"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_120px]">
                <Input placeholder="Nome" value={it.name} onChange={(e) => it.id && onUpdateItem(it.id, { name: e.target.value })} />
                <Input placeholder="Descrizione" value={it.description} onChange={(e) => it.id && onUpdateItem(it.id, { description: e.target.value })} />
                <Input placeholder="Prezzo" value={it.price} onChange={(e) => it.id && onUpdateItem(it.id, { price: e.target.value })} />
              </div>
              <div className="mt-2 grid grid-cols-1 items-center gap-2 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-x-4">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.18em] text-[var(--color-ink-mute)]">
                  Sposta in
                </span>
                <Select
                  value={it.subcategory_id ?? NO_SUB}
                  onChange={(e) => it.id && onUpdateItem(it.id, { subcategory_id: e.target.value === NO_SUB ? null : e.target.value })}
                  className="!py-1.5 !text-[13px]"
                >
                  {subOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
                <Toggle checked={it.show_on_homepage} onChange={(v) => it.id && onUpdateItem(it.id, { show_on_homepage: v })} label="Homepage" />
                <Toggle checked={it.show_on_menu} onChange={(v) => it.id && onUpdateItem(it.id, { show_on_menu: v })} label="Pagina /menu" />
              </div>
            </div>
          ))
        )}
        <button
          type="button"
          onClick={onAddItem}
          className="inline-flex items-center gap-2 border border-[var(--color-brass)] bg-white px-3 py-1.5 text-[12px] text-[var(--color-brass-deep)] hover:bg-[var(--color-brass)] hover:text-white"
        >
          <Plus size={13} /> Aggiungi voce {sub ? `in "${sub.label || "(senza nome)"}"` : "diretta"}
        </button>
      </div>
    </div>
  );
}
