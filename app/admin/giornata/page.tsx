import { requireAdmin } from "@/lib/admin/guard";
import { getGiornataMoments, getGiornataSection } from "@/lib/data/site";
import { Field, FormSection, Input, Textarea } from "@/components/admin/field";
import { SaveBar } from "@/components/admin/save-bar";
import { saveGiornataSection, addMoment, deleteMoment, saveMoments } from "./actions";
import { MomentsEditor } from "./moments-editor";

export const dynamic = "force-dynamic";

export default async function GiornataAdmin() {
  await requireAdmin();
  const [section, moments] = await Promise.all([
    getGiornataSection(),
    getGiornataMoments(),
  ]);

  return (
    <div className="space-y-10">
      <header>
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Una giornata da Sabor
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Sezione "Una giornata"
        </h1>
        <p className="mt-1 text-[13.5px] text-[var(--color-ink-mute)]">
          Heading della sezione + lista dei momenti (mattina, pomeriggio, sera, ecc.).
        </p>
      </header>

      <form action={saveGiornataSection} className="space-y-6">
        <FormSection title="Titolo della sezione">
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
        </FormSection>
        <SaveBar label="Salva titolo sezione" />
      </form>

      <MomentsEditor
        initial={moments}
        onSave={saveMoments}
        onAdd={addMoment}
        onDelete={deleteMoment}
      />
    </div>
  );
}
