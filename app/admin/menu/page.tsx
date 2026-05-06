import { requirePermission } from "@/lib/admin/guard";
import { getCartaSection, getMenuCategories } from "@/lib/data/site";
import { Field, FormSection, Input } from "@/components/admin/field";
import { SaveBar } from "@/components/admin/save-bar";
import {
  saveCartaSection,
  addCategory,
  deleteCategory,
  saveCategories,
  addItem,
  deleteItem,
  saveItems,
} from "./actions";
import { MenuEditor } from "./menu-editor";

export const dynamic = "force-dynamic";

export default async function MenuAdmin() {
  await requirePermission("menu.edit");
  const [section, categories] = await Promise.all([
    getCartaSection(),
    getMenuCategories(),
  ]);

  return (
    <div className="space-y-10">
      <header>
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Menu / Carta
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Categorie e voci del menu
        </h1>
        <p className="mt-1 max-w-[60ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Le categorie sono usate sia in homepage (tabs) che nella pagina Carta completa.
          Puoi nascondere categorie/voci da una vista o dall'altra. Trascina con le freccette per riordinare.
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

      <MenuEditor
        initial={categories}
        onSaveCategories={saveCategories}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onSaveItems={saveItems}
        onAddItem={addItem}
        onDeleteItem={deleteItem}
      />
    </div>
  );
}
