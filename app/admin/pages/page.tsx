import { requirePermission } from "@/lib/admin/guard";
import { getPageMeta } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import { savePageMeta } from "./actions";
import { PhotoStripField } from "./photo-strip-field";

export const dynamic = "force-dynamic";

const SLUGS = ["menu", "galleria", "contatti"] as const;
const TITLES: Record<(typeof SLUGS)[number], string> = {
  menu: "Pagina Carta — /menu",
  galleria: "Pagina Galleria — /galleria",
  contatti: "Pagina Contatti — /contatti",
};

export default async function PagesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  await requirePermission("pages.edit");
  const sp = await searchParams;
  const active = (SLUGS as readonly string[]).includes(sp.slug ?? "")
    ? (sp.slug as (typeof SLUGS)[number])
    : "menu";

  const meta = await getPageMeta(active);

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Pagine
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Header & SEO delle pagine
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--color-ink-mute)]">
          Per ogni sotto-pagina puoi modificare titolo, descrizione, header editoriale
          e foto strip.
        </p>
      </header>

      <nav className="mb-6 flex gap-1 border-b border-[var(--color-line)]">
        {SLUGS.map((s) => (
          <a
            key={s}
            href={`/admin/pages?slug=${s}`}
            className={`px-4 py-2.5 font-[var(--font-mono)] text-[11px] uppercase tracking-[0.2em] ${
              active === s
                ? "border-b-2 border-[var(--color-brass)] text-[var(--color-ink)]"
                : "text-[var(--color-ink-mute)] hover:text-[var(--color-ink)]"
            }`}
          >
            {s}
          </a>
        ))}
      </nav>

      <h2 className="mb-4 font-[var(--font-display)] text-[22px]">
        {TITLES[active]}
      </h2>

      <form action={savePageMeta} className="space-y-6">
        <input type="hidden" name="slug" value={active} />

        <FormSection title="SEO">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Titolo (tag <title>)">
              <Input name="title" defaultValue={meta?.title ?? ""} />
            </Field>
            <Field label="Numero header (es. .01)">
              <Input name="header_number" defaultValue={meta?.header_number ?? ".01"} />
            </Field>
            <Field label="Descrizione (meta description)" className="md:col-span-2">
              <Textarea name="description" rows={3} defaultValue={meta?.description ?? ""} />
            </Field>
          </div>
          <ImagePicker
            name="og_image_media_id"
            label="Immagine Open Graph"
            value={meta?.og_image_media_id}
          />
        </FormSection>

        <FormSection title="Header editoriale" description="Visibile in cima alla pagina pubblica.">
          <Field label="Kicker (etichetta sopra titolo)">
            <Input name="header_kicker" defaultValue={meta?.header_kicker ?? ""} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Titolo: prima dell'accento">
              <Input name="header_title_before" defaultValue={meta?.header_title_before ?? ""} />
            </Field>
            <Field label="Accento (italico oro)">
              <Input name="header_title_accent" defaultValue={meta?.header_title_accent ?? ""} />
            </Field>
            <Field label="Dopo l'accento">
              <Input name="header_title_after" defaultValue={meta?.header_title_after ?? ""} />
            </Field>
          </div>
          <Field label="Sottotitolo lead">
            <Textarea name="header_sub" rows={3} defaultValue={meta?.header_sub ?? ""} />
          </Field>
        </FormSection>

        <FormSection title="Photo strip" description="4 foto sotto il titolo header. Lascia vuoto per nasconderle.">
          <PhotoStripField initial={meta?.header_photos ?? []} />
        </FormSection>

        <div className="sticky bottom-0 -mx-4 mt-8 flex items-center justify-end border-t border-[var(--color-line)] bg-[var(--color-cream-soft)] px-4 py-4 sm:-mx-6 sm:px-6">
          <button
            type="submit"
            className="bg-[var(--color-ink)] px-6 py-2.5 font-[var(--font-mono)] text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-cream)] hover:bg-[var(--color-brass-deep)]"
          >
            Salva pagina
          </button>
        </div>
      </form>
    </div>
  );
}
