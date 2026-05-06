"use client";

import { useFormStatus } from "react-dom";

export function SaveBar({ label = "Salva modifiche" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <div className="sticky bottom-0 -mx-4 mt-8 flex items-center justify-end gap-3 border-t border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-4 sm:-mx-6 sm:px-6">
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 bg-[var(--color-ink)] px-6 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] transition-colors hover:bg-[var(--color-brass-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Salvataggio…" : label}
      </button>
    </div>
  );
}
