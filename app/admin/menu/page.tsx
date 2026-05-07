import { requirePermission } from "@/lib/admin/guard";
import { getMenuCategories } from "@/lib/data/site";
import {
  addCategory,
  deleteCategory,
  saveCategories,
  addSubcategory,
  deleteSubcategory,
  saveSubcategories,
  addItem,
  deleteItem,
  saveItems,
} from "./actions";
import { MenuEditor } from "./menu-editor";

export const dynamic = "force-dynamic";

export default async function MenuAdmin() {
  await requirePermission("menu.edit");
  const categories = await getMenuCategories();

  return (
    <div className="space-y-8">
      <header>
        <span className="font-[var(--font-mono)] text-[10px] uppercase tracking-[0.22em] text-[var(--color-brass)]">
          Menu
        </span>
        <h1 className="mt-1 font-[var(--font-display)] text-[30px]">
          Categorie, sottocategorie e voci
        </h1>
        <p className="mt-1 max-w-[70ch] text-[13.5px] text-[var(--color-ink-mute)]">
          Le categorie sono usate sia in homepage (tabs della sezione &quot;Carta&quot;) che
          nella pagina /menu completa. Puoi nascondere categorie/voci da una vista
          o dall&apos;altra. Riordina con le freccette. Dentro ogni categoria puoi
          creare <strong>sottocategorie</strong> e aggiungere voci dentro: nella
          pagina /menu vengono raggruppate sotto un sotto-titolo. Le voci possono
          anche stare direttamente sotto la categoria, senza sottocategoria. Per
          modificare il <strong>paragrafo della homepage</strong> (titolo, kicker,
          CTA) vai su &quot;Carta&quot;.
        </p>
      </header>

      <MenuEditor
        initial={categories}
        onSaveCategories={saveCategories}
        onAddCategory={addCategory}
        onDeleteCategory={deleteCategory}
        onSaveSubcategories={saveSubcategories}
        onAddSubcategory={addSubcategory}
        onDeleteSubcategory={deleteSubcategory}
        onSaveItems={saveItems}
        onAddItem={addItem}
        onDeleteItem={deleteItem}
      />
    </div>
  );
}
