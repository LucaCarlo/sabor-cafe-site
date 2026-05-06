import { requireAdmin } from "@/lib/admin/guard";
import { getEventi, getEventiSection } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { SaveBar } from "@/components/admin/save-bar";
import { saveEventiSection, addEvento, deleteEvento, saveEventi } from "./actions";
import { EventiEditor } from "./eventi-editor";

export const dynamic = "force-dynamic";

export default async function EventiAdmin() {
  await requireAdmin();
  const [section, items] = await Promise.all([getEventiSection(), getEventi()]);

  return (
    <div className="space-y-10">
      <header>
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Eventi privati
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Sezione "Per le tue occasioni"
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--color-ink-mute)]">
          Heading + lista delle tipologie di eventi (aperitivi aziendali, compleanni, presentazioni…).
        </p>
      </header>

      <form action={saveEventiSection} className="space-y-6">
        <FormSection title="Titolo & lead">
          <Field label="Kicker">
            <Input name="kicker" defaultValue={section?.kicker ?? ""} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <Field label="Prima dell'accento">
              <Input name="title_before" defaultValue={section?.title_before ?? ""} />
            </Field>
            <Field label="Accento">
              <Input name="title_accent" defaultValue={section?.title_accent ?? ""} />
            </Field>
            <Field label="Dopo l'accento">
              <Input name="title_after" defaultValue={section?.title_after ?? ""} />
            </Field>
          </div>
          <Field label="Lead">
            <Textarea name="lead" rows={3} defaultValue={section?.lead ?? ""} />
          </Field>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="CTA — etichetta">
              <Input name="cta_label" defaultValue={section?.cta_label ?? ""} />
            </Field>
            <Field label="CTA — link">
              <Input name="cta_href" defaultValue={section?.cta_href ?? ""} />
            </Field>
          </div>
        </FormSection>
        <SaveBar label="Salva sezione" />
      </form>

      <EventiEditor
        initial={items}
        onSave={saveEventi}
        onAdd={addEvento}
        onDelete={deleteEvento}
      />
    </div>
  );
}
