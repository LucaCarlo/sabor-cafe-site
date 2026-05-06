"use client";

import { useEffect, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Check } from "lucide-react";
import type { MediaRow } from "@/lib/supabase/types";

type Props = {
  /** Hidden form-field name for uncontrolled use with Server Actions */
  name?: string;
  /** Current media id (uuid) — used as initial when uncontrolled, current when controlled */
  value?: string | null;
  /** When provided, ImagePicker becomes controlled; parent owns the value */
  onChange?: (id: string | null) => void;
  /** Optional fallback URL preview when no media id */
  fallbackUrl?: string | null;
  label?: string;
};

export function ImagePicker({ name, value, onChange, fallbackUrl, label }: Props) {
  const [open, setOpen] = useState(false);
  const [media, setMedia] = useState<MediaRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalId, setInternalId] = useState<string | null>(value ?? null);
  const [chosenUrl, setChosenUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const controlled = onChange !== undefined;
  const chosenId = controlled ? value ?? null : internalId;

  const setChosenId = (id: string | null) => {
    if (controlled) onChange!(id);
    else setInternalId(id);
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/media", { cache: "no-store" });
      if (r.ok) {
        const d = (await r.json()) as { media: MediaRow[] };
        setMedia(d.media);
      }
    } finally {
      setLoading(false);
    }
  };

  // When chosenId changes, find the media URL for preview
  useEffect(() => {
    if (!chosenId) {
      setChosenUrl(null);
      return;
    }
    const inList = media.find((m) => m.id === chosenId);
    if (inList) {
      setChosenUrl(inList.public_url);
    } else if (open || media.length === 0) {
      // We need to fetch media to find the URL
      refresh();
    }
  }, [chosenId, media, open]);

  useEffect(() => {
    if (open) refresh();
  }, [open]);

  const choose = (m: MediaRow) => {
    setChosenId(m.id);
    setChosenUrl(m.public_url);
    setOpen(false);
  };

  const clear = () => {
    setChosenId(null);
    setChosenUrl(null);
  };

  const onFile = async (f: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await fetch("/api/admin/media", { method: "POST", body: fd });
      if (!r.ok) throw new Error(await r.text());
      const { media: m } = (await r.json()) as { media: MediaRow };
      setChosenId(m.id);
      setChosenUrl(m.public_url);
      await refresh();
    } catch (e) {
      alert("Upload fallito: " + (e as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = chosenUrl ?? (chosenId ? null : fallbackUrl ?? null);

  return (
    <div>
      {label && (
        <label className="mb-1.5 block font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={chosenId ?? ""} />}
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:gap-4">
        <div className="relative h-28 w-full max-w-[200px] shrink-0 overflow-hidden border border-[var(--color-line)] bg-[var(--color-cream-deep)] sm:w-40">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[var(--color-ink-mute)]">
              <ImageIcon size={20} />
            </div>
          )}
          {!chosenId && fallbackUrl && (
            <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 py-0.5 font-[var(--font-mono)] text-[9px] uppercase tracking-[0.1em] text-white">
              Fallback URL
            </span>
          )}
        </div>
        <div className="flex flex-row flex-wrap gap-2 sm:flex-col">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-3.5 py-2 text-[12px] hover:border-[var(--color-brass)]"
          >
            <ImageIcon size={13} /> Scegli dai media
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 border border-[var(--color-line)] bg-white px-3.5 py-2 text-[12px] hover:border-[var(--color-brass)] disabled:opacity-60"
          >
            <Upload size={13} /> {uploading ? "Caricamento…" : "Carica nuovo"}
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
              e.target.value = "";
            }}
          />
          {chosenId && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-2 px-2 py-1 text-[11px] text-[var(--color-terra)] hover:underline"
            >
              <X size={12} /> Rimuovi (usa fallback)
            </button>
          )}
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-5xl overflow-hidden bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--color-line)] px-5 py-4">
              <h3 className="font-[var(--font-display)] text-[20px]">Libreria media</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto p-5">
              {loading ? (
                <p className="text-center text-[13px] text-[var(--color-ink-mute)]">
                  Caricamento…
                </p>
              ) : media.length === 0 ? (
                <p className="text-center text-[13px] text-[var(--color-ink-mute)]">
                  Nessun media caricato. Usa "Carica nuovo" per iniziare.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                  {media.map((m) => {
                    const sel = m.id === chosenId;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => choose(m)}
                        className={`group relative aspect-square overflow-hidden border-2 transition-colors ${
                          sel ? "border-[var(--color-brass)]" : "border-transparent hover:border-[var(--color-line)]"
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={m.public_url}
                          alt={m.alt}
                          className="h-full w-full object-cover"
                        />
                        {sel && (
                          <span className="absolute inset-0 flex items-center justify-center bg-[var(--color-brass)]/30">
                            <Check size={26} className="text-white" strokeWidth={3} />
                          </span>
                        )}
                        <span className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-left font-[var(--font-mono)] text-[10px] text-white">
                          {m.file_name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
