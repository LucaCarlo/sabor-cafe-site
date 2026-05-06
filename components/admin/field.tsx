"use client";

import { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
  required,
  className = "",
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block font-[var(--font-mono)] text-[10.5px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
        {label}
        {required && <span className="ml-1 text-[var(--color-terra)]">*</span>}
      </label>
      {children}
      {hint && (
        <p className="mt-1 text-[12px] text-[var(--color-ink-mute)]">{hint}</p>
      )}
    </div>
  );
}

const baseInput =
  "w-full border border-[var(--color-line)] bg-white px-3 py-2.5 text-[14px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)]/70 focus:border-[var(--color-brass)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brass)]/20";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`${baseInput} resize-y leading-[1.6] ${props.className ?? ""}`}
    />
  );
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={`${baseInput} ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 text-[13px] text-[var(--color-ink)]"
    >
      <span
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? "bg-[var(--color-brass)]" : "bg-[var(--color-line)]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </span>
      {label}
    </button>
  );
}

export function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border border-[var(--color-line)] bg-white">
      <header className="border-b border-[var(--color-line)] bg-[var(--color-cream-soft)] px-6 py-4">
        <h2 className="font-[var(--font-display)] text-[19px] text-[var(--color-ink)]">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-[13px] text-[var(--color-ink-mute)]">{description}</p>
        )}
      </header>
      <div className="space-y-5 p-6">{children}</div>
    </section>
  );
}
