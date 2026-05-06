"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";
import type { EventoRow } from "@/lib/supabase/types";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";

type Item = {
  id?: string;
  number_label: string;
  title: string;
  sub: string;
  body: string;
  image_media_id: string | null;
  image_url_fallback: string;
  cta_label: string;
  cta_href: string;
  position: number;
  image_url?: string | null;
};

export function EventiEditor({
  initial,
  onSave,
  onAdd,
  onDelete,
}: {
  initial: Array<EventoRow & { image_url: string | null }>;
  onSave: (items: Omit<Item, "image_url">[]) => Promise<{ ok: boolean; error?: string }>;
  onAdd: () => Promise<{ ok: boolean; error?: string; evento?: EventoRow }>;
  onDelete: (id: string) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [items, setItems] = useState<Item[]>(initial.map((e) => ({ ...e })));
  const [saving, setSaving] = useState(false);

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
    if (!confirm(`Eliminare "${it.title}"?`)) return;
    if (it.id) {
      const r = await onDelete(it.id);
      if (!r.ok) {
        toast.error(r.error ?? "Errore");
        return;
      }
    }
    setItems((prev) => prev.filter((_, idx) => idx !== i));
    toast.success("Evento eliminato");
  };
  const add = async () => {
    const r = await onAdd();
    if (!r.ok) return toast.error(r.error ?? "Errore");
    if (r.evento) setItems((prev) => [...prev, { ...r.evento!, image_url: null }]);
    toast.success("Evento aggiunto");
  };
  const save = async () => {
    setSaving(true);
    try {
      const payload = items.map((it, i) => ({
        id: it.id,
        number_label: it.number_label,
        title: it.title,
        sub: it.sub,
        body: it.body,
        image_media_id: it.image_media_id,
        image_url_fallback: it.image_url_fallback,
        cta_label: it.cta_label,
        cta_href: it.cta_href,
        position: i + 1,
      }));
      const r = await onSave(payload);
      if (!r.ok) toast.error(r.error ?? "Errore");
      else toast.success("Eventi salvati");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormSection title="Tipologie di eventi">
        <div className="space-y-5">
          {items.map((it, i) => (
            <div key={it.id ?? i} className="border border-[var(--color-line)] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
                  Evento {i + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="rounded p-1 hover:bg-[var(--color-cream-deep)] disabled:opacity-30"><ChevronUp size={16} /></button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === items.length - 1} className="rounded p-1 hover:bg-[var(--color-cream-deep)] disabled:opacity-30"><ChevronDown size={16} /></button>
                  <button type="button" onClick={() => remove(i)} className="rounded p-1 text-[var(--color-terra)] hover:bg-[var(--color-cream-deep)]"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Numero (es. 01, 02)">
                  <Input value={it.number_label} onChange={(e) => update(i, { number_label: e.target.value })} />
                </Field>
                <Field label="Titolo">
                  <Input value={it.title} onChange={(e) => update(i, { title: e.target.value })} />
                </Field>
                <Field label="Sottotitolo">
                  <Input value={it.sub} onChange={(e) => update(i, { sub: e.target.value })} />
                </Field>
                <Field label="Descrizione" className="md:col-span-2">
                  <Textarea rows={3} value={it.body} onChange={(e) => update(i, { body: e.target.value })} />
                </Field>
                <Field label="CTA — etichetta">
                  <Input value={it.cta_label} onChange={(e) => update(i, { cta_label: e.target.value })} />
                </Field>
                <Field label="CTA — link">
                  <Input value={it.cta_href} onChange={(e) => update(i, { cta_href: e.target.value })} />
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
                  <Input value={it.image_url_fallback} onChange={(e) => update(i, { image_url_fallback: e.target.value })} />
                </Field>
              </div>
            </div>
          ))}
        </div>
      </FormSection>

      <div className="flex items-center justify-between">
        <button type="button" onClick={add} className="inline-flex items-center gap-2 border border-[var(--color-brass)] bg-white px-4 py-2 text-[12px] text-[var(--color-brass-deep)] hover:bg-[var(--color-brass)] hover:text-white">
          <Plus size={14} /> Aggiungi evento
        </button>
        <button type="button" onClick={save} disabled={saving} className="bg-[var(--color-ink)] px-6 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60">
          {saving ? "Salvataggio…" : "Salva tutti gli eventi"}
        </button>
      </div>
    </div>
  );
}
