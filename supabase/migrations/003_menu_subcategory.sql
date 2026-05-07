-- Aggiunge una sottocategoria opzionale alle voci del menu.
-- Voci con la stessa subcategory (case-sensitive) vengono raggruppate
-- sotto un sotto-titolo nella pagina /menu pubblica.
alter table menu_items
  add column if not exists subcategory text not null default '';

create index if not exists idx_menu_items_subcategory
  on menu_items (category_id, subcategory, position);
