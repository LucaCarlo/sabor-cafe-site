import { requireAdmin } from "@/lib/admin/guard";
import { getManifesto } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea, Select } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import { SaveBar } from "@/components/admin/save-bar";
import { saveManifesto } from "./actions";

export const dynamic = "force-dynamic";

const ICONS = ["Coffee", "Utensils", "Wine", "Leaf", "Star", "Heart"] as const;

export default async function ManifestoAdmin() {
  await requireAdmin();
  const m = await getManifesto();
  const pillars =
    m?.pillars && m.pillars.length === 3
      ? m.pillars
      : [
          { icon: "Coffee" as const, title: "", body: "" },
          { icon: "Utensils" as const, title: "", body: "" },
          { icon: "Wine" as const, title: "", body: "" },
        ];

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Manifesto
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Sezione manifesto
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--color-ink-mute)]">
          La narrazione del posto: titolo + 2 paragrafi + 3 pilastri con icone.
        </p>
      </header>

      <form action={saveManifesto} className="space-y-6">
        <FormSection title="Titolo">
          <Field label="Kicker (numero + testo, es. '.01 — Il manifesto')">
            <Input name="kicker" defaultValue={m?.kicker ?? ""} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Prima dell'accento">
              <Input name="title_before" defaultValue={m?.title_before ?? ""} />
            </Field>
            <Field label="Parola accento">
              <Input name="title_accent" defaultValue={m?.title_accent ?? ""} />
            </Field>
            <Field label="Dopo l'accento">
              <Input name="title_after" defaultValue={m?.title_after ?? ""} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Testi">
          <Field label="Paragrafo principale (lead)">
            <Textarea name="lead" rows={3} defaultValue={m?.lead ?? ""} />
          </Field>
          <Field label="Paragrafo secondario">
            <Textarea name="secondary" rows={3} defaultValue={m?.secondary ?? ""} />
          </Field>
        </FormSection>

        <FormSection title="Foto del manifesto">
          <ImagePicker
            name="image_media_id"
            value={m?.image_media_id}
            fallbackUrl={m?.image_url ?? m?.image_url_fallback ?? null}
          />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Testo alternativo">
              <Input name="image_alt" defaultValue={m?.image_alt ?? ""} />
            </Field>
            <Field label="Didascalia sotto la foto">
              <Input name="image_caption" defaultValue={m?.image_caption ?? ""} />
            </Field>
            <Field label="URL fallback" className="md:col-span-2">
              <Input name="image_url_fallback" defaultValue={m?.image_url_fallback ?? ""} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Tre pilastri" description="Ogni pilastro ha un'icona, un titolo e una descrizione breve.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 border border-[var(--color-line)] bg-[var(--color-cream-soft)] p-4"
              >
                <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-[var(--color-brass-deep)]">
                  Pilastro {i + 1}
                </span>
                <Field label="Icona">
                  <Select name={`pillar_${i}_icon`} defaultValue={p.icon}>
                    {ICONS.map((ic) => (
                      <option key={ic} value={ic}>
                        {ic}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Titolo">
                  <Input name={`pillar_${i}_title`} defaultValue={p.title} />
                </Field>
                <Field label="Descrizione">
                  <Textarea name={`pillar_${i}_body`} rows={4} defaultValue={p.body} />
                </Field>
              </div>
            ))}
          </div>
        </FormSection>

        <SaveBar />
      </form>
    </div>
  );
}
