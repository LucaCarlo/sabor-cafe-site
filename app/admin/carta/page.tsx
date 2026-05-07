import { requirePermission } from "@/lib/admin/guard";
import { getCartaSection } from "@/lib/data/site";
import { Field, FormSection, Input } from "@/components/admin/field";
import { SaveBar } from "@/components/admin/save-bar";
import { saveCartaSection } from "../menu/actions";

export const dynamic = "force-dynamic";

export default async function CartaAdmin() {
  await requirePermission("menu.edit");
  const section = await getCartaSection();

  return (
    <div className="space-y-8">
      <header>
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Carta — sezione homepage
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Paragrafo &quot;Carta&quot; in homepage
        </h1>
        <p className="mt-1 max-w-[70ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Modifica il titolo, il sottotitolo e la CTA della sezione &quot;Carta&quot; che
          compare nella homepage (con i tab delle categorie). Per gestire le voci
          del menu vai su <strong>Menu</strong>.
        </p>
      </header>

      <form action={saveCartaSection} className="space-y-6">
        <FormSection title="Heading sezione homepage">
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
    </div>
  );
}
