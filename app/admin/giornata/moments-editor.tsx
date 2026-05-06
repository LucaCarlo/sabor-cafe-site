"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import type { GiornataMomentRow } from "@/lib/supabase/types";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";

type MomentInput = {
  id?: string;
  slug: string;
  time_label: string;
  label: string;
  title: string;
  body: string;
  note: string;
  image_media_id: string | null;
  image_url_fallback: string;
  position: number;
};

type Item = MomentInput & { image_url?: string | null };

export function MomentsEditor({
  initial,
  onSave,
  onAdd,
  onDelete,
}: {
  initial: Array<GiornataMomentRow & { image_url: string | null }>;
  onSave: (items: MomentInput[]) => Promise<{ ok: boolean; error?: string }>;
  onAdd: (slug: string) => Promise<{ ok: boolean; error?: string; moment?: GiornataMomentRow }>;
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [items, setItems] = useState<Item[]>(
    initial.map((m) => ({
      id: m.id,
      slug: m.slug,
      time_label: m.time_label,
      label: m.label,
      title: m.title,
      body: m.body,
      note: m.note,
      image_media_id: m.image_media_id,
      image_url_fallback: m.image_url_fallback,
      position: m.position,
      image_url: m.image_url,
    })),
  );
  const [saving, setSaving] = useState(false);
  const [newSlug, setNewSlug] = useState("");

  const update = (i: number, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = items.slice();
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  const remove = async (i: number) => {
    const it = items[i];
    if (!confirm(`Eliminare "${it.label}"?`)) return;
    if (it.id) {
      const r = await onDelete(it.id);
      if (!r.ok) {
        toast.error(r.error ?? "Errore");
        return;
      }
    }
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    toast.success("Momento eliminato");
  };

  const add = async () => {
    if (!newSlug.trim()) {
      toast.error("Inserisci uno slug (es. mattina, pomeriggio)");
      return;
    }
    const r = await onAdd(newSlug);
    if (!r.ok) {
      toast.error(r.error ?? "Errore");
      return;
    }
    if (r.moment) {
      setItems((prev) => [
        ...prev,
        {
          ...r.moment!,
          image_url: null,
        },
      ]);
      setNewSlug("");
      toast.success("Momento aggiunto");
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = items.map((it, i) => ({
        id: it.id,
        slug: it.slug,
        time_label: it.time_label,
        label: it.label,
        title: it.title,
        body: it.body,
        note: it.note,
        image_media_id: it.image_media_id,
        image_url_fallback: it.image_url_fallback,
        position: i + 1,
      }));
      const r = await onSave(payload);
      if (!r.ok) toast.error(r.error ?? "Errore");
      else toast.success("Momenti salvati");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormSection title="Momenti della giornata" description="Trascina con le freccette per riordinare. Le posizioni si aggiornano al salvataggio.">
        <div className="space-y-5">
          {items.map((it, i) => (
            <div
              key={it.id ?? i}
              className="border border-[var(--color-line)] bg-white p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
                  Momento {i + 1} · slug "{it.slug}"
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded p-1 text-[var(--color-ink-mute)] hover:bg-[var(--color-cream-deep)] disabled:opacity-30"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="rounded p-1 text-[var(--color-ink-mute)] hover:bg-[var(--color-cream-deep)] disabled:opacity-30"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="rounded p-1 text-[var(--color-terra)] hover:bg-[var(--color-cream-deep)]"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Slug (univoco)">
                  <Input value={it.slug} onChange={(e) => update(i, { slug: e.target.value })} />
                </Field>
                <Field label="Orario (label)" hint="Ex. 07:00">
                  <Input value={it.time_label} onChange={(e) => update(i, { time_label: e.target.value })} />
                </Field>
                <Field label="Etichetta">
                  <Input value={it.label} onChange={(e) => update(i, { label: e.target.value })} />
                </Field>
                <Field label="Titolo">
                  <Input value={it.title} onChange={(e) => update(i, { title: e.target.value })} />
                </Field>
                <Field label="Descrizione" className="md:col-span-2">
                  <Textarea
                    rows={3}
                    value={it.body}
                    onChange={(e) => update(i, { body: e.target.value })}
                  />
                </Field>
                <Field label="Note (es. 'Caffè · Cornetto · Spremuta')" className="md:col-span-2">
                  <Input value={it.note} onChange={(e) => update(i, { note: e.target.value })} />
                </Field>
                <div className="md:col-span-2">
                  <ImagePicker
                    label="Immagine"
                    value={it.image_media_id}
                    onChange={(id) => update(i, { image_media_id: id })}
                    fallbackUrl={it.image_url ?? it.image_url_fallback}
                  />
                </div>
                <Field label="URL fallback foto" className="md:col-span-2">
                  <Input
                    value={it.image_url_fallback}
                    onChange={(e) => update(i, { image_url_fallback: e.target.value })}
                  />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Aggiungi nuovo momento">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="slug (es. notte, brunch, golden-hour)"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
          />
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-brass)] px-5 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)]"
          >
            <Plus size={14} /> Aggiungi
          </button>
        </div>
      </FormSection>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-[var(--color-line)] bg-[var(--color-cream-soft)] px-6 py-4">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-[var(--color-ink)] px-6 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60"
        >
          {saving ? "Salvataggio…" : "Salva tutti i momenti"}
        </button>
      </div>
    </div>
  );
}

