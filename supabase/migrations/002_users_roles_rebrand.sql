-- ============================================================
-- Migration 002: Rebrand "Maison Sabor" → "Sabor Cafè"
-- + Sistema utenti/ruoli con permessi granulari
-- ============================================================

-- 1) REBRAND -------------------------------------------------

update settings set
  brand_primary = 'Sabor',
  brand_secondary = 'Cafè',
  brand_full = 'Sabor Cafè'
where id = 1;

update hero set
  kicker_left = 'Sabor Cafè'
where id = 1
  and kicker_left = 'Maison Sabor';

update eventi_section set
  title_before = 'Sabor Cafè è anche'
where id = 1
  and title_before = 'Maison Sabor è anche';

-- 2) TABELLE RUOLI / UTENTI ----------------------------------

create table if not exists roles (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  description text not null default '',
  is_super boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists role_permissions (
  role_id uuid not null references roles(id) on delete cascade,
  permission_key text not null,
  primary key (role_id, permission_key)
);

create table if not exists app_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid not null references roles(id) on delete restrict,
  display_name text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_app_users_role on app_users (role_id);
create index if not exists idx_role_permissions_role on role_permissions (role_id);

-- RLS: nessuna lettura pubblica. Tutti gli accessi via service-role
alter table roles enable row level security;
alter table role_permissions enable row level security;
alter table app_users enable row level security;

-- (no policy = nessun accesso anon/auth user → service-role bypassa RLS)

-- 3) BOOTSTRAP SUPERADMIN ------------------------------------

insert into roles (name, description, is_super)
  values ('Superadmin', 'Accesso completo a tutte le funzionalità della dashboard.', true)
  on conflict (name) do nothing;

-- Assegna lucacarlorecchio25@gmail.com (user id già noto) al ruolo Superadmin
insert into app_users (user_id, role_id, display_name)
select
  '8e6ee3f7-8e8b-40f7-8eed-1438453f9690'::uuid,
  r.id,
  'Luca Carlorecchio'
from roles r
where r.name = 'Superadmin'
on conflict (user_id) do update
  set role_id = excluded.role_id;

-- ============================================================
-- DONE
-- ============================================================
