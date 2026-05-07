-- Sostituisce il campo testo `menu_items.subcategory` con una vera tabella
-- `menu_subcategories` collegata via FK. Le voci possono appartenere a una
-- sottocategoria oppure stare direttamente sotto la categoria.
-- Esegue il backfill dei dati esistenti (preservandoli) prima di rimuovere
-- la vecchia colonna testo.

-- 1. Tabella sottocategorie
create table if not exists menu_subcategories (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  label text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  unique (category_id, label)
);
create index if not exists idx_menu_subcategories_cat
  on menu_subcategories (category_id, position);

alter table menu_subcategories enable row level security;
drop policy if exists "menu_subcategories read" on menu_subcategories;
create policy "menu_subcategories read"
  on menu_subcategories for select
  to anon, authenticated
  using (true);

-- 2. FK su menu_items (set null on delete: se elimini la sottocategoria
--    le voci tornano "dirette" sotto la categoria, non vengono cancellate)
alter table menu_items
  add column if not exists subcategory_id uuid references menu_subcategories(id) on delete set null;

-- 3. Backfill: per ogni (category_id, subcategory) testuale distinto crea
--    una riga in menu_subcategories e aggiorna le voci.
do $$
declare
  has_subcategory_col boolean;
begin
  select exists(
    select 1 from information_schema.columns
    where table_name = 'menu_items' and column_name = 'subcategory'
  ) into has_subcategory_col;

  if has_subcategory_col then
    insert into menu_subcategories (category_id, label, position)
    select
      category_id,
      subcategory,
      row_number() over (partition by category_id order by min(position))
    from menu_items
    where subcategory is not null and subcategory <> ''
    group by category_id, subcategory
    on conflict (category_id, label) do nothing;

    execute $sql$
      update menu_items mi
      set subcategory_id = ms.id
      from menu_subcategories ms
      where ms.category_id = mi.category_id
        and ms.label = mi.subcategory
        and mi.subcategory is not null
        and mi.subcategory <> ''
    $sql$;
  end if;
end $$;

-- 4. Rimuovi la vecchia colonna testo + indice associato
drop index if exists idx_menu_items_subcategory;
alter table menu_items drop column if exists subcategory;

-- 5. Indice utile per le query di lettura raggruppate
create index if not exists idx_menu_items_subcategory_id
  on menu_items (category_id, subcategory_id, position);
