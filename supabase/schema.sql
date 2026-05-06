-- ============================================================
-- Sabor Cafè — Schema Supabase
-- Esegui per intero in: Supabase Dashboard → SQL Editor → Run
-- ============================================================

-- Estensioni
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELLE
-- ============================================================

-- Media library
create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  file_name text not null,
  storage_path text not null unique,
  public_url text not null,
  mime_type text not null,
  width int,
  height int,
  size_bytes bigint,
  alt text default '',
  created_at timestamptz not null default now()
);
create index if not exists idx_media_created_at on media (created_at desc);

-- Settings singleton (id = 1)
create table if not exists settings (
  id int primary key default 1,
  brand_primary text not null default 'Sabor',
  brand_secondary text not null default 'Cafè',
  brand_full text not null default 'Sabor Cafè',
  meta_year text not null default 'MMXXVI',
  edition_label text not null default 'Édition 2026',
  description text not null default 'Bar contemporaneo a Civitanova Marche. Caffè selezionato, cucina del giorno, aperitivo curato.',
  instagram_url text not null default 'https://www.instagram.com/sabor.cafe/',
  instagram_handle text not null default '@sabor.cafe',
  email text not null default '',
  phone text not null default '',
  address text not null default 'Civitanova Marche · Italia',
  city text not null default 'Civitanova Marche',
  country text not null default 'IT',
  hours_weekday text not null default '07:00 — 23:00',
  hours_weekend text not null default '08:00 — 24:00',
  hours_kitchen text not null default '12:00 — 22:00',
  hours_weekday_label text not null default 'Lun — Ven',
  hours_weekend_label text not null default 'Sab — Dom',
  hours_kitchen_label text not null default 'Cucina',
  open_hour int not null default 7,
  close_hour int not null default 23,
  price_range text not null default '€€',
  serves_cuisine text not null default 'Caffè, Colazione, Pranzo, Aperitivo',
  coords_lat numeric not null default 43.3,
  coords_lng numeric not null default 13.72,
  coords_label text not null default '43°18′N · 13°43′E',
  site_url text not null default 'https://saborcafe.it',
  logo_media_id uuid references media(id) on delete set null,
  og_image_media_id uuid references media(id) on delete set null,
  reservation_label text not null default 'Riserva un tavolo',
  reservation_href text not null default '/contatti',
  constraint settings_singleton check (id = 1)
);

-- Hero (singleton)
create table if not exists hero (
  id int primary key default 1,
  kicker_left text not null default 'Sabor Cafè',
  kicker_right text not null default 'Civitanova · MMXXVI',
  title_line1_before text not null default 'Caffè, cucina,',
  title_accent text not null default 'aperitivo',
  title_line1_after text not null default '.',
  title_line2 text not null default 'Per ogni occasione.',
  lead text not null default 'Un bar contemporaneo nel cuore di Civitanova: caffè selezionato, cucina del giorno, aperitivo curato e occasioni private. Apertura continua, dalla mattina alla sera.',
  image_media_id uuid references media(id) on delete set null,
  image_url_fallback text not null default 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1800&q=85',
  image_alt text not null default 'Atmosfera del bar al tramonto',
  cta_primary_label text not null default 'Riserva un tavolo',
  cta_primary_href text not null default '/contatti',
  cta_secondary_label text not null default 'Vedi la carta',
  cta_secondary_href text not null default '/menu',
  badge_label text not null default 'Aperti adesso · Civitanova',
  constraint hero_singleton check (id = 1)
);

-- Manifesto (singleton + pillars in JSONB)
create table if not exists manifesto (
  id int primary key default 1,
  kicker text not null default '.01 — Il manifesto',
  title_before text not null default 'Una',
  title_accent text not null default 'maison',
  title_after text not null default ', non un bar qualsiasi.',
  lead text not null default 'Sabor nasce con un''idea che a Civitanova mancava: un posto in cui caffè, cucina e aperitivo siano trattati con la stessa cura, dall''apertura alla chiusura. Spazio contemporaneo, materiali caldi, attenzione al dettaglio.',
  secondary text not null default 'Niente trucchi. Niente proclami. Solo le cose fatte come si deve, ogni giorno — perché il bar che servirebbe a noi è anche quello che vorremmo offrire a te.',
  image_media_id uuid references media(id) on delete set null,
  image_url_fallback text not null default 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1100&q=85',
  image_alt text not null default 'Sala interna del bar',
  image_caption text not null default 'Il salone — luce di mattina',
  pillars jsonb not null default '[
    {"icon":"Coffee","title":"Selezione","body":"Caffè single-origin in rotazione mensile, latte fresco da fornitori locali, materie prime stagionali."},
    {"icon":"Utensils","title":"Cucina","body":"Piatti del giorno fatti al momento, ricette semplici, ingredienti riconoscibili. Niente surgelati."},
    {"icon":"Wine","title":"Carta","body":"Una selezione ragionata di vini marchigiani al calice, cocktail classici, distillati artigianali."}
  ]'::jsonb,
  constraint manifesto_singleton check (id = 1)
);

-- Carta (sezione homepage heading)
create table if not exists carta_section (
  id int primary key default 1,
  kicker text not null default '.02 — La carta',
  title_before text not null default 'Quattro',
  title_accent text not null default 'capitoli',
  title_after text not null default ', quattro modi di stare bene.',
  cta_label text not null default 'Vedi la carta completa',
  cta_href text not null default '/menu',
  constraint carta_section_singleton check (id = 1)
);

-- Categorie menu (usate sia in homepage tabs che in /menu)
create table if not exists menu_categories (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  label text not null,
  sub text not null default '',
  headline text not null default '',
  image_media_id uuid references media(id) on delete set null,
  image_url_fallback text not null default '',
  show_on_homepage boolean not null default true,
  show_on_menu boolean not null default true,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_menu_categories_position on menu_categories (position);

-- Items del menu
create table if not exists menu_items (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid not null references menu_categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  price text not null default '',
  position int not null default 0,
  show_on_homepage boolean not null default true,
  show_on_menu boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_menu_items_cat on menu_items (category_id, position);

-- Giornata (heading)
create table if not exists giornata_section (
  id int primary key default 1,
  kicker text not null default '.03 — Una giornata da Sabor',
  title_before text not null default 'Lo stesso posto,',
  title_accent text not null default 'tre ritmi',
  title_after text not null default 'diversi.',
  constraint giornata_section_singleton check (id = 1)
);

-- Giornata moments (lista)
create table if not exists giornata_moments (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  time_label text not null,
  label text not null,
  title text not null,
  body text not null,
  note text not null,
  image_media_id uuid references media(id) on delete set null,
  image_url_fallback text not null default '',
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_giornata_moments_position on giornata_moments (position);

-- Eventi (heading)
create table if not exists eventi_section (
  id int primary key default 1,
  kicker text not null default '.04 — Per le tue occasioni',
  title_before text not null default 'Sabor Cafè è anche',
  title_accent text not null default 'privata',
  title_after text not null default '.',
  lead text not null default 'Ti aiutiamo a organizzare l''occasione giusta — da un aperitivo aziendale a una presentazione esclusiva. Spazio, servizio, dettagli: tutto pensato.',
  cta_label text not null default 'Richiedi disponibilità',
  cta_href text not null default '/contatti',
  constraint eventi_section_singleton check (id = 1)
);

-- Eventi (lista)
create table if not exists eventi (
  id uuid primary key default uuid_generate_v4(),
  number_label text not null,
  title text not null,
  sub text not null,
  body text not null,
  image_media_id uuid references media(id) on delete set null,
  image_url_fallback text not null default '',
  cta_label text not null default 'Richiedi info',
  cta_href text not null default '/contatti',
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_eventi_position on eventi (position);

-- Visita (singleton)
create table if not exists visita (
  id int primary key default 1,
  kicker text not null default '.05 — Visita',
  title_before text not null default 'Riserva un',
  title_accent text not null default 'tavolo',
  title_after text not null default ', vienici a trovare.',
  lead text not null default 'Per la colazione, una pausa pranzo, un aperitivo o una cena privata: la porta è aperta e la sedia ti aspetta. Riserva online o in DM, ti rispondiamo entro la giornata.',
  cta_label text not null default 'Riservare adesso',
  cta_href text not null default '/contatti',
  panel_label text not null default 'Prenotazioni',
  phone_label text not null default 'Chiama il bar',
  phone_href text not null default 'tel:+39',
  constraint visita_singleton check (id = 1)
);

-- Gallery categorie (per filtri dinamici)
create table if not exists gallery_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- Gallery items
create table if not exists gallery_items (
  id uuid primary key default uuid_generate_v4(),
  image_media_id uuid references media(id) on delete set null,
  image_url_fallback text not null default '',
  alt text not null default '',
  category_id uuid references gallery_categories(id) on delete set null,
  size text not null default 'sq',
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_gallery_items_position on gallery_items (position);

-- Page meta (per sub-pages: menu, galleria, contatti)
create table if not exists page_meta (
  slug text primary key,
  title text not null default '',
  description text not null default '',
  og_image_media_id uuid references media(id) on delete set null,
  header_kicker text not null default '',
  header_number text not null default '.01',
  header_title_before text not null default '',
  header_title_accent text not null default '',
  header_title_after text not null default '',
  header_sub text not null default '',
  header_photos jsonb not null default '[]'::jsonb
);

-- ============================================================
-- VIEW utility: settings + media joined
-- ============================================================

create or replace view settings_view as
  select s.*,
    (select public_url from media where id = s.logo_media_id) as logo_url,
    (select public_url from media where id = s.og_image_media_id) as og_image_url
  from settings s;

-- ============================================================
-- ROW LEVEL SECURITY: tutto pubblico in lettura,
-- scrittura solo via service-role (server)
-- ============================================================

alter table media enable row level security;
alter table settings enable row level security;
alter table hero enable row level security;
alter table manifesto enable row level security;
alter table carta_section enable row level security;
alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table giornata_section enable row level security;
alter table giornata_moments enable row level security;
alter table eventi_section enable row level security;
alter table eventi enable row level security;
alter table visita enable row level security;
alter table gallery_categories enable row level security;
alter table gallery_items enable row level security;
alter table page_meta enable row level security;

-- Policy SELECT pubblica per tutte
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'media','settings','hero','manifesto','carta_section',
      'menu_categories','menu_items','giornata_section','giornata_moments',
      'eventi_section','eventi','visita','gallery_categories','gallery_items','page_meta'
    ])
  loop
    execute format('drop policy if exists "public_read_%s" on %I;', t, t);
    execute format('create policy "public_read_%s" on %I for select using (true);', t, t);
  end loop;
end $$;

-- ============================================================
-- SEED dei dati attuali del sito
-- ============================================================

-- Singletons (idempotente)
insert into settings (id) values (1) on conflict (id) do nothing;
insert into hero (id) values (1) on conflict (id) do nothing;
insert into manifesto (id) values (1) on conflict (id) do nothing;
insert into carta_section (id) values (1) on conflict (id) do nothing;
insert into giornata_section (id) values (1) on conflict (id) do nothing;
insert into eventi_section (id) values (1) on conflict (id) do nothing;
insert into visita (id) values (1) on conflict (id) do nothing;

-- Menu categorie + items
do $$
declare cat_id uuid;
begin
  -- Caffè
  insert into menu_categories (slug, label, sub, headline, image_url_fallback, show_on_homepage, show_on_menu, position)
  values ('caffe', 'Caffè', 'Espressi · miscele · specialità', 'Una tazza che racconta una scelta.',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85', true, true, 1)
  on conflict (slug) do nothing
  returning id into cat_id;
  if cat_id is not null then
    insert into menu_items (category_id, name, description, price, position) values
      (cat_id, 'Espresso', 'Selezione del giorno', '1,40 €', 1),
      (cat_id, 'Espresso single-origin', 'Rotazione mensile', '2,20 €', 2),
      (cat_id, 'Espresso macchiato', 'Goccia di latte fresco', '1,50 €', 3),
      (cat_id, 'Caffè americano', 'In tazza grande', '1,80 €', 4),
      (cat_id, 'Cappuccino', 'Schiuma vellutata, cacao a richiesta', '1,80 €', 5),
      (cat_id, 'Latte macchiato', 'Latte caldo, espresso', '2,00 €', 6),
      (cat_id, 'V60 / Chemex', 'Filter coffee, alla giornata', '4,00 €', 7),
      (cat_id, 'Affogato', 'Espresso e gelato di nostra fornitura', '4,50 €', 8);
  end if;

  -- Cucina
  cat_id := null;
  insert into menu_categories (slug, label, sub, headline, image_url_fallback, show_on_homepage, show_on_menu, position)
  values ('cucina', 'Cucina', 'Pranzo veloce ma fatto bene', 'Piatti del giorno, ingredienti riconoscibili.',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85', true, true, 2)
  on conflict (slug) do nothing
  returning id into cat_id;
  if cat_id is not null then
    insert into menu_items (category_id, name, description, price, position) values
      (cat_id, 'Toast classico', 'Cotto e fontina d''alpeggio', '5,00 €', 1),
      (cat_id, 'Toast vegetariano', 'Verdure grigliate, hummus', '5,50 €', 2),
      (cat_id, 'Tramezzino tonno', 'Maionese leggera', '4,50 €', 3),
      (cat_id, 'Tramezzino salmone', 'Burro e cetriolo', '5,50 €', 4),
      (cat_id, 'Insalata del giorno', 'Cambia spesso, mai banale', '8,00 €', 5),
      (cat_id, 'Bowl di stagione', 'Cereali, verdure, proteine', '9,50 €', 6),
      (cat_id, 'Tortino di verdure', 'Servito con pane caldo', '7,50 €', 7),
      (cat_id, 'Piatto del giorno', 'Chiedi al banco', '10,00 €', 8);
  end if;

  -- Aperitivo
  cat_id := null;
  insert into menu_categories (slug, label, sub, headline, image_url_fallback, show_on_homepage, show_on_menu, position)
  values ('aperitivo', 'Aperitivo & vini', 'Calici, taglieri, conversazioni', 'Calici, taglieri, conversazioni.',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85', true, true, 3)
  on conflict (slug) do nothing
  returning id into cat_id;
  if cat_id is not null then
    insert into menu_items (category_id, name, description, price, position) values
      (cat_id, 'Spritz Aperol', 'Con olive ascolane', '6,00 €', 1),
      (cat_id, 'Spritz Campari', 'Più amaro, deciso', '6,00 €', 2),
      (cat_id, 'Hugo', 'Sambuco, prosecco, menta', '6,00 €', 3),
      (cat_id, 'Calice di vino bianco', 'Verdicchio dei Castelli di Jesi', '5,00 €', 4),
      (cat_id, 'Calice di vino rosso', 'Rosso piceno superiore', '5,00 €', 5),
      (cat_id, 'Birra alla spina', 'Selezione marchigiana', '5,50 €', 6),
      (cat_id, 'Tagliere piccolo', 'Salumi e formaggi locali', '10,00 €', 7),
      (cat_id, 'Tagliere grande', 'Per due, da condividere', '18,00 €', 8),
      (cat_id, 'Olive ascolane', 'Fritte al momento, calde', '6,00 €', 9);
  end if;

  -- Pasticceria
  cat_id := null;
  insert into menu_categories (slug, label, sub, headline, image_url_fallback, show_on_homepage, show_on_menu, position)
  values ('pasticceria', 'Pasticceria', 'Fresca, del giorno, fatta come si deve', 'Fresca, fragrante, fatta come si deve.',
    'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1400&q=85', true, true, 4)
  on conflict (slug) do nothing
  returning id into cat_id;
  if cat_id is not null then
    insert into menu_items (category_id, name, description, price, position) values
      (cat_id, 'Cornetto vuoto', 'Sfoglia croccante', '1,30 €', 1),
      (cat_id, 'Cornetto crema', 'Crema fatta in casa', '1,50 €', 2),
      (cat_id, 'Cornetto cioccolato', 'Cioccolato fondente 70%', '1,50 €', 3),
      (cat_id, 'Cornetto amarena', 'Amarena Fabbri', '1,60 €', 4),
      (cat_id, 'Brioche vegana', 'Senza burro né uova', '1,80 €', 5),
      (cat_id, 'Maritozzo con la panna', 'Soffice, generoso', '2,80 €', 6),
      (cat_id, 'Crostatina', 'Frutta di stagione', '2,20 €', 7),
      (cat_id, 'Cookie cioccolato', 'Fondente 70%, croccante fuori', '2,00 €', 8);
  end if;
end $$;

-- Giornata moments
insert into giornata_moments (slug, time_label, label, title, body, note, image_url_fallback, position) values
  ('mattina', '07:00', 'Mattina', 'Il rito che inizia ogni giorno.',
    'Il primo caffè è un piccolo gesto di cura: dosatura precisa, latte vellutato, un cornetto fragrante per accompagnarlo. La giornata comincia bene quando comincia da qui.',
    'Caffè · Cornetto · Spremuta',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85', 1),
  ('pomeriggio', '13:00', 'Pomeriggio', 'Una pausa che vale il suo tempo.',
    'Il pranzo veloce, ma fatto bene. Una bowl di stagione, un toast, un''insalata pensata. Si torna al lavoro con qualcosa di buono nel ricordo, non solo nella pancia.',
    'Bowl · Toast · Insalate',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85', 2),
  ('sera', '18:30', 'Sera', 'L''ora di rallentare.',
    'Spritz e tagliere, calici e cose da sgranocchiare. Musica bassa, luce calda, conversazioni che si dilatano. La giornata finisce dolce, qui dentro.',
    'Spritz · Tagliere · Vino al calice',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85', 3)
on conflict (slug) do nothing;

-- Eventi
insert into eventi (number_label, title, sub, body, image_url_fallback, position) values
  ('01', 'Aperitivo aziendale', 'Per il tuo team, da 8 a 40 persone',
    'Tagliere, calici, finger food. Una serata curata per ringraziare un team o festeggiare un risultato. Personalizziamo allestimento e selezione su richiesta.',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=85', 1),
  ('02', 'Compleanni & celebrazioni', 'Riservi lo spazio, noi pensiamo al resto',
    'Aperitivo o cena privata, tavolata grande, allestimento personalizzato. Possibilità di torta su misura della pasticceria di nostra fornitura.',
    'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1200&q=85', 2),
  ('03', 'Presentazioni & cene private', 'Lanci, book launch, riunioni esclusive',
    'Spazio raccolto e contemporaneo per presentazioni, lanci di libri, cene di lavoro. Servizio dedicato, audio se richiesto, schermo a disposizione.',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1200&q=85', 3)
on conflict do nothing;

-- Gallery categorie
insert into gallery_categories (name, position) values
  ('Spazio', 1), ('Caffè', 2), ('Cucina', 3), ('Persone', 4), ('Atmosfera', 5)
on conflict (name) do nothing;

-- Gallery items (foto seed)
do $$
declare
  cat_spazio uuid := (select id from gallery_categories where name='Spazio');
  cat_caffe uuid := (select id from gallery_categories where name='Caffè');
  cat_cucina uuid := (select id from gallery_categories where name='Cucina');
  cat_persone uuid := (select id from gallery_categories where name='Persone');
  cat_atm uuid := (select id from gallery_categories where name='Atmosfera');
begin
  insert into gallery_items (image_url_fallback, alt, category_id, size, position) values
    ('https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1400&q=85', 'Bancone in legno', cat_spazio, 'wide', 1),
    ('https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1400&q=85', 'Sala interna', cat_spazio, 'tall', 2),
    ('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85', 'Cappuccino', cat_caffe, 'sq', 3),
    ('https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1400&q=85', 'Espresso scuro', cat_caffe, 'sq', 4),
    ('https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1400&q=85', 'Latte art', cat_caffe, 'tall', 5),
    ('https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=1400&q=85', 'Chicchi tostati', cat_caffe, 'sq', 6),
    ('https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1400&q=85', 'Mani al lavoro', cat_persone, 'tall', 7),
    ('https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1400&q=85', 'Sorrisi al banco', cat_persone, 'wide', 8),
    ('https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1400&q=85', 'Pasticceria fresca', cat_cucina, 'sq', 9),
    ('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1400&q=85', 'Bowl di stagione', cat_cucina, 'sq', 10),
    ('https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1400&q=85', 'Dolci del mattino', cat_cucina, 'sq', 11),
    ('https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1400&q=85', 'Atmosfera serale', cat_atm, 'tall', 12)
  on conflict do nothing;
end $$;

-- Page meta
insert into page_meta (slug, title, description, header_kicker, header_number, header_title_before, header_title_accent, header_title_after, header_sub, header_photos) values
  ('menu', 'Carta', 'Tutto quello che serviamo, dal caffè all''aperitivo. Selezione, prezzi, dettagli.',
    'La carta', '.01', 'Tutto in', 'carta', '— senza scorciatoie.',
    'Quattro capitoli: caffè, pasticceria, cucina, aperitivo & vini. Cambiamo spesso, segnaliamo quel che è del giorno, chiediamo del banco quando hai dubbi.',
    '["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=900&q=85"]'::jsonb),
  ('galleria', 'Galleria', 'Foto del bar, dei piatti, delle persone. Aggiornata ogni settimana.',
    'Galleria', '.01', 'Una', 'collezione', 'di sguardi.',
    'Foto del bar, dei piatti, delle persone. Quel che resta di una giornata da Sabor, raccontato in immagini.',
    '["https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85"]'::jsonb),
  ('contatti', 'Contatti', 'Riserva un tavolo, un evento privato, una collaborazione. Ti rispondiamo entro la giornata.',
    'Contatti', '.01', 'Vienici a', 'trovare', '— o scrivici.',
    'Riservare un tavolo, organizzare un evento, una collaborazione: il modo più veloce è il form qui sotto. Rispondiamo in giornata, di solito prima.',
    '["https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=85","https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=900&q=85"]'::jsonb)
on conflict (slug) do nothing;

-- ============================================================
-- STORAGE bucket "media" (esegui anche questo)
-- Se il bucket non esiste viene creato pubblico in lettura.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Storage policies: lettura pubblica, scrittura solo via service-role
do $$
begin
  -- public read
  if not exists (select 1 from pg_policies where policyname='public_read_media_bucket' and tablename='objects' and schemaname='storage') then
    create policy "public_read_media_bucket" on storage.objects
      for select using (bucket_id = 'media');
  end if;
end $$;

-- ============================================================
-- DONE
-- ============================================================
