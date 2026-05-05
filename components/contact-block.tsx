"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Instagram, MapPin, Clock, Mail, Send, Phone } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

type Reason = "Riservare un tavolo" | "Evento privato" | "Collaborazione" | "Altro";

export function ContactBlock() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    reason: Reason;
    message: string;
  }>({ name: "", email: "", reason: "Riservare un tavolo", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
    setTimeout(() => setSent(false), 5000);
    setForm({ name: "", email: "", reason: "Riservare un tavolo", message: "" });
  };

  return (
    <section className="container-x mx-auto max-w-[1500px] py-[clamp(80px,10vw,140px)]">
      {/* Three info cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {[
          {
            icon: MapPin,
            k: "Indirizzo",
            v: "Civitanova Marche",
            sub: "Italia · centro storico",
          },
          {
            icon: Clock,
            k: "Orario",
            v: "07:00 — 23:00",
            sub: "Sabato-Domenica fino alle 24:00",
          },
          {
            icon: Instagram,
            k: "Social",
            v: "@sabor.cafe",
            sub: "DM aperti",
            href: "https://www.instagram.com/sabor.cafe/",
          },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={c.k}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.85, ease, delay: i * 0.1 }}
              className="card-hover border border-[var(--color-line)] bg-[var(--color-cream-soft)] p-[clamp(28px,3.5vw,40px)] hover:border-[var(--color-brass)]"
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-brass)] text-[var(--color-brass-deep)]">
                <Icon size={20} strokeWidth={1.5} />
              </span>
              <span className="mt-6 block kicker">{c.k}</span>
              {c.href ? (
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 block font-[var(--font-display)] text-[clamp(1.5rem,2vw,1.8rem)] text-[var(--color-ink)] transition-colors hover:text-[var(--color-brass-deep)]"
                >
                  {c.v}
                </a>
              ) : (
                <span className="mt-2 block font-[var(--font-display)] text-[clamp(1.5rem,2vw,1.8rem)] text-[var(--color-ink)]">
                  {c.v}
                </span>
              )}
              <span className="mt-1 block text-[14px] text-[var(--color-ink-mute)]">
                {c.sub}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Form + map */}
      <div className="mt-16 grid grid-cols-1 gap-x-[clamp(30px,5vw,72px)] gap-y-12 md:grid-cols-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.95, ease }}
          className="md:col-span-7"
        >
          <div className="section-num-badge mb-5">.01 — Scrivici</div>
          <h2 className="h-display h-section">
            Una <span className="italic brass-deep">parola</span>, basta poco.
          </h2>
          <p className="lead mt-5 max-w-[44ch]">
            Per prenotazioni, eventi privati, collaborazioni o domande.
            Rispondiamo in giornata.
          </p>

          <form onSubmit={submit} className="mt-10 space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Nome" required>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] focus:border-[var(--color-brass)] focus:outline-none"
                  placeholder="Mario Rossi"
                />
              </Field>
              <Field label="Email" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] focus:border-[var(--color-brass)] focus:outline-none"
                  placeholder="mario@example.com"
                />
              </Field>
            </div>

            <Field label="Tipo di richiesta">
              <div className="flex flex-wrap gap-2">
                {(["Riservare un tavolo", "Evento privato", "Collaborazione", "Altro"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setForm({ ...form, reason: r })}
                    className={`rounded-full border px-4 py-1.5 font-[var(--font-mono)] text-[11px] font-medium uppercase tracking-[0.18em] transition-all ${
                      form.reason === r
                        ? "border-[var(--color-brass-deep)] bg-[var(--color-brass-deep)] text-[var(--color-cream)]"
                        : "border-[var(--color-line)] text-[var(--color-ink-soft)] hover:border-[var(--color-brass)]"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Messaggio" required>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full resize-none border border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-3.5 text-[15px] text-[var(--color-ink)] placeholder:text-[var(--color-ink-mute)] focus:border-[var(--color-brass)] focus:outline-none"
                placeholder="Raccontaci cosa hai in mente…"
              />
            </Field>

            <button
              type="submit"
              className="group inline-flex items-center gap-3 bg-[var(--color-ink)] px-7 py-4 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-cream)] transition-all hover:bg-[var(--color-brass-deep)]"
            >
              {sent ? (
                <>Messaggio inviato ✓</>
              ) : (
                <>
                  Invia messaggio
                  <Send size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 flex items-center gap-2 font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
            <Mail size={12} strokeWidth={1.6} className="text-[var(--color-brass)]" />
            Form non collegato a backend in questa anteprima
          </p>
        </motion.div>

        {/* Map + quick contact */}
        <motion.aside
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.95, ease, delay: 0.15 }}
          className="md:col-span-5"
        >
          <div className="section-num-badge mb-5">.02 — Mappa</div>
          <h3 className="h-display text-[clamp(1.6rem,2.4vw,2rem)]">
            Cuore di Civitanova.
          </h3>

          <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden border border-[var(--color-line)] bg-[var(--color-cream-deep)]">
            <svg viewBox="0 0 600 450" className="absolute inset-0 h-full w-full">
              <defs>
                <pattern id="m-d" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#D6CDB8" />
                </pattern>
              </defs>
              <rect width="600" height="450" fill="url(#m-d)" />
              <g stroke="#9C7A4B" strokeWidth="1.5" fill="none" opacity="0.55">
                <path d="M0 220 L600 200" />
                <path d="M150 0 L160 450" />
                <path d="M380 0 L420 450" />
                <path d="M0 320 L600 340" />
                <path d="M0 110 L600 90" />
              </g>
              <path
                d="M0 380 Q150 360 300 390 T600 380 L600 450 L0 450 Z"
                fill="#3F5337"
                opacity="0.18"
              />
              <g transform="translate(310, 215)">
                <circle r="22" fill="#9C7A4B" opacity="0.25" />
                <circle r="14" fill="#9C7A4B" opacity="0.4" />
                <circle r="6" fill="#6E5530" />
              </g>
            </svg>
            <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-cream-soft)] px-4 py-2 shadow-sm">
              <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-[var(--color-brass)]" />
              <span className="font-[var(--font-mono)] text-[11px] uppercase tracking-[0.22em] text-[var(--color-ink)]">
                Maison Sabor · qui
              </span>
            </div>
          </div>

          <ul className="mt-8 space-y-4 border-t border-[var(--color-line)] pt-6">
            <li className="flex items-start gap-3">
              <Phone size={14} strokeWidth={1.6} className="text-[var(--color-brass)] mt-1 shrink-0" />
              <div>
                <span className="block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
                  Telefono
                </span>
                <span className="mt-0.5 block font-[var(--font-display)] text-[clamp(1.05rem,1.4vw,1.18rem)] text-[var(--color-ink)]">
                  Su Instagram, in DM
                </span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={14} strokeWidth={1.6} className="text-[var(--color-brass)] mt-1 shrink-0" />
              <div>
                <span className="block font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-ink-mute)]">
                  Coordinate
                </span>
                <span className="mt-0.5 block font-[var(--font-display)] text-[clamp(1.05rem,1.4vw,1.18rem)] text-[var(--color-ink)]">
                  43°18′N · 13°43′E
                </span>
              </div>
            </li>
          </ul>
        </motion.aside>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="kicker mb-2 block">
        {label}
        {required && <span className="text-[var(--color-terra)]">·</span>}
      </label>
      {children}
    </div>
  );
}
