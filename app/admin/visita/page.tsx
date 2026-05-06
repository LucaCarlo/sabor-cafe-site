import { requirePermission } from "@/lib/admin/guard";
import { getVisita } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { SaveBar } from "@/components/admin/save-bar";
import { saveVisita } from "./actions";

export const dynamic = "force-dynamic";

export default async function VisitaAdmin() {
  await requirePermission("visita.edit");
  const v = await getVisita();
  return (
    <div>
      <header className="mb-8">
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Visita
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Sezione "Visita" della homepage
        </h1>
      </header>

      <form action={saveVisita} className="space-y-6">
        <FormSection title="Titolo">
          <Field label="Kicker">
            <Input name="kicker" defaultValue={v?.kicker ?? ""} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Prima dell'accento">
              <Input name="title_before" defaultValue={v?.title_before ?? ""} />
            </Field>
            <Field label="Parola accento">
              <Input name="title_accent" defaultValue={v?.title_accent ?? ""} />
            </Field>
            <Field label="Dopo l'accento">
              <Input name="title_after" defaultValue={v?.title_after ?? ""} />
            </Field>
          </div>
          <Field label="Lead">
            <Textarea name="lead" rows={3} defaultValue={v?.lead ?? ""} />
          </Field>
        </FormSection>

        <FormSection title="Pulsanti & contatti">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="CTA — etichetta">
              <Input name="cta_label" defaultValue={v?.cta_label ?? ""} />
            </Field>
            <Field label="CTA — link">
              <Input name="cta_href" defaultValue={v?.cta_href ?? ""} />
            </Field>
            <Field label="Etichetta pannello (sopra orari)">
              <Input name="panel_label" defaultValue={v?.panel_label ?? ""} />
            </Field>
            <Field label="Pulsante telefono — etichetta">
              <Input name="phone_label" defaultValue={v?.phone_label ?? ""} />
            </Field>
            <Field label="Pulsante telefono — link" hint="Es. tel:+39123456789" className="md:col-span-2">
              <Input name="phone_href" defaultValue={v?.phone_href ?? ""} />
            </Field>
          </div>
        </FormSection>

        <SaveBar />
      </form>
    </div>
  );
}
