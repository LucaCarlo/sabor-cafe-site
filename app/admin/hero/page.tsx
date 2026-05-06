import { requirePermission } from "@/lib/admin/guard";
import { getHero } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { ImagePicker } from "@/components/admin/image-picker";
import { SaveBar } from "@/components/admin/save-bar";
import { saveHero } from "./actions";

export const dynamic = "force-dynamic";

export default async function HeroAdmin() {
  await requirePermission("hero.edit");
  const h = await getHero();

  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Hero
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Sezione hero della homepage
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Il primo blocco visibile: kicker, titolo, sottotitolo, foto e pulsanti.
        </p>
      </header>

      <form action={saveHero} className="space-y-6">
        <FormSection title="Kicker (riga superiore)">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Testo a sinistra">
              <Input name="kicker_left" defaultValue={h?.kicker_left ?? ""} />
            </Field>
            <Field label="Testo a destra">
              <Input name="kicker_right" defaultValue={h?.kicker_right ?? ""} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Titolo principale" description="Composto da 3 parti: 'prima', accento (in italico oro) e 'dopo', più una seconda riga.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Prima dell'accento">
              <Input name="title_line1_before" defaultValue={h?.title_line1_before ?? ""} />
            </Field>
            <Field label="Parola accento (italico oro)">
              <Input name="title_accent" defaultValue={h?.title_accent ?? ""} />
            </Field>
            <Field label="Dopo l'accento">
              <Input name="title_line1_after" defaultValue={h?.title_line1_after ?? ""} />
            </Field>
          </div>
          <Field label="Seconda riga del titolo">
            <Input name="title_line2" defaultValue={h?.title_line2 ?? ""} />
          </Field>
          <Field label="Sottotitolo / lead" hint="Paragrafo descrittivo sotto il titolo">
            <Textarea name="lead" rows={3} defaultValue={h?.lead ?? ""} />
          </Field>
        </FormSection>

        <FormSection title="Foto principale">
          <ImagePicker
            name="image_media_id"
            value={h?.image_media_id}
            fallbackUrl={h?.image_url ?? h?.image_url_fallback ?? null}
          />
          <Field label="Testo alternativo (alt) per accessibilità">
            <Input name="image_alt" defaultValue={h?.image_alt ?? ""} />
          </Field>
          <Field label="URL fallback (se nessun media è selezionato)">
            <Input name="image_url_fallback" defaultValue={h?.image_url_fallback ?? ""} />
          </Field>
        </FormSection>

        <FormSection title="Pulsanti CTA">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="CTA primario — etichetta">
              <Input name="cta_primary_label" defaultValue={h?.cta_primary_label ?? ""} />
            </Field>
            <Field label="CTA primario — link">
              <Input name="cta_primary_href" defaultValue={h?.cta_primary_href ?? ""} />
            </Field>
            <Field label="CTA secondario — etichetta">
              <Input name="cta_secondary_label" defaultValue={h?.cta_secondary_label ?? ""} />
            </Field>
            <Field label="CTA secondario — link">
              <Input name="cta_secondary_href" defaultValue={h?.cta_secondary_href ?? ""} />
            </Field>
          </div>
          <Field label="Etichetta sul badge in basso a destra">
            <Input name="badge_label" defaultValue={h?.badge_label ?? ""} />
          </Field>
        </FormSection>

        <SaveBar />
      </form>
    </div>
  );
}
