"use client";

import { useRef, useState } from "react";
import { Upload, Trash2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import type { MediaRow } from "@/lib/supabase/types";

export function MediaLibrary({ initial }: { initial: MediaRow[] }) {
  const [media, setMedia] = useState<MediaRow[]>(initial);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const upload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploaded: MediaRow[] = [];
      for (const f of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", f);
        const r = await fetch("/api/admin/media", { method: "POST", body: fd });
        if (!r.ok) {
          toast.error(`${f.name}: upload fallito`);
          continue;
        }
        const { media: m } = (await r.json()) as { media: MediaRow };
        uploaded.push(m);
      }
      if (uploaded.length) {
        setMedia((prev) => [...uploaded, ...prev]);
        toast.success(`${uploaded.length} immagine/i caricate`);
      }
    } finally {
      setUploading(false);
    }
  };

  const remove = async (m: MediaRow) => {
    if (!confirm(`Eliminare "${m.file_name}"? Non si può annullare.`)) return;
    const r = await fetch(`/api/admin/media?id=${m.id}`, { method: "DELETE" });
    if (!r.ok) {
      toast.error("Eliminazione fallita");
      return;
    }
    setMedia((prev) => prev.filter((x) => x.id !== m.id));
    toast.success("Immagine eliminata");
  };

  const copyUrl = (m: MediaRow) => {
    navigator.clipboard.writeText(m.public_url);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success("URL copiato");
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) upload(e.dataTransfer.files);
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="mb-6 flex flex-col items-center justify-center gap-3 border-2 border-dashed border-[var(--color-line)] bg-white py-12 transition-colors hover:border-[var(--color-brass)]"
      >
        <Upload size={28} className="text-[var(--color-brass)]" strokeWidth={1.5} />
        <div className="text-center">
          <p className="text-[14.5px] text-[var(--color-ink)]">
            Trascina qui le foto, oppure
          </p>
          <button
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="mt-2 inline-flex items-center gap-2 bg-[var(--color-ink)] px-5 py-2 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)] disabled:opacity-60"
          >
            {uploading ? "Caricamento…" : "Scegli file"}
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) upload(e.target.files);
              e.target.value = "";
            }}
          />
        </div>
        <p className="text-[12px] text-[var(--color-ink-mute)]">
          JPG, PNG, WebP, AVIF. Più file insieme.
        </p>
      </div>

      {media.length === 0 ? (
        <p className="border border-[var(--color-line)] bg-white p-10 text-center text-[14px] text-[var(--color-ink-mute)]">
          Nessuna immagine ancora caricata.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {media.map((m) => (
            <figure
              key={m.id}
              className="group relative aspect-square overflow-hidden border border-[var(--color-line)] bg-white"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={m.public_url}
                alt={m.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
                <span className="block truncate font-[var(--font-mono)] text-[10px] text-white">
                  {m.file_name}
                </span>
                <span className="block text-[10px] text-white/70">
                  {m.width}×{m.height}
                  {m.size_bytes ? ` · ${Math.round(m.size_bytes / 1024)} KB` : ""}
                </span>
              </figcaption>
              <div className="absolute right-1.5 top-1.5 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => copyUrl(m)}
                  title="Copia URL"
                  className="flex h-7 w-7 items-center justify-center rounded bg-white/95 text-[var(--color-ink)] hover:bg-white"
                >
                  {copiedId === m.id ? <Check size={13} /> : <Copy size={13} />}
                </button>
                <button
                  type="button"
                  onClick={() => remove(m)}
                  title="Elimina"
                  className="flex h-7 w-7 items-center justify-center rounded bg-white/95 text-[var(--color-terra)] hover:bg-white"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
