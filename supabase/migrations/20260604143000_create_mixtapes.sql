create extension if not exists pgcrypto;

create table if not exists public.mixtapes (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  theme_key text not null,
  stickers jsonb not null default '[]'::jsonb,
  note text not null check (char_length(note) <= 280),
  tracks jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_mixtape_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists mixtapes_set_updated_at on public.mixtapes;

create trigger mixtapes_set_updated_at
before update on public.mixtapes
for each row
execute function public.set_mixtape_updated_at();

alter table public.mixtapes enable row level security;
