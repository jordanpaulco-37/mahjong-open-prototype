-- ============================================================
-- THE MAHJONG OPEN — Initial Schema
-- Run this in your Supabase SQL Editor or via CLI
-- ============================================================

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  full_name   text,
  email       text,
  role        text not null default 'player' check (role in ('player', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Cities
create table if not exists public.cities (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  state       text,
  slug        text unique not null,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Seasons (9-week quarters, one active per city)
create table if not exists public.seasons (
  id           uuid primary key default gen_random_uuid(),
  city_id      uuid references public.cities on delete cascade not null,
  name         text not null,
  year         integer,
  quarter      integer check (quarter between 1 and 4),
  starts_at    timestamptz,
  ends_at      timestamptz,
  total_weeks  integer not null default 9,
  is_active    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- City memberships (player ↔ city/season)
create table if not exists public.city_memberships (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles on delete cascade not null,
  city_id     uuid references public.cities on delete cascade not null,
  season_id   uuid references public.seasons on delete cascade not null,
  status      text not null default 'pending' check (status in ('pending', 'active', 'canceled')),
  paid_status text not null default 'unpaid' check (paid_status in ('unpaid', 'paid', 'refunded')),
  skill_level text check (skill_level in ('beginner', 'intermediate', 'advanced')),
  created_at  timestamptz not null default now(),
  unique(user_id, season_id)
);

-- Payments
create table if not exists public.payments (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references public.profiles on delete cascade not null,
  city_id             uuid references public.cities not null,
  season_id           uuid references public.seasons not null,
  amount              integer,  -- cents
  status              text,
  provider            text default 'stripe',
  provider_payment_id text,
  created_at          timestamptz not null default now()
);

-- Scramble tables (weekly foursomes)
create table if not exists public.scramble_tables (
  id               uuid primary key default gen_random_uuid(),
  city_id          uuid references public.cities on delete cascade not null,
  season_id        uuid references public.seasons on delete cascade not null,
  creator_id       uuid references public.profiles on delete cascade not null,
  week_number      integer not null check (week_number between 1 and 9),
  table_date       date not null,
  table_time       time not null,
  location_name    text not null,
  location_address text,
  skill_level      text check (skill_level in ('beginner', 'intermediate', 'advanced')),
  notes            text,
  status           text not null default 'open' check (status in ('open', 'full', 'completed', 'canceled')),
  created_at       timestamptz not null default now()
);

-- Table seats (max 4 per table)
create table if not exists public.table_seats (
  id          uuid primary key default gen_random_uuid(),
  table_id    uuid references public.scramble_tables on delete cascade not null,
  user_id     uuid references public.profiles on delete cascade not null,
  seat_number integer not null check (seat_number between 1 and 4),
  joined_at   timestamptz not null default now(),
  canceled_at timestamptz,
  unique(table_id, seat_number),
  unique(table_id, user_id)
);

-- Score submissions
create table if not exists public.score_submissions (
  id           uuid primary key default gen_random_uuid(),
  table_id     uuid references public.scramble_tables on delete cascade not null unique,
  submitted_by uuid references public.profiles on delete cascade not null,
  status       text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'edited')),
  admin_notes  text,
  created_at   timestamptz not null default now(),
  approved_at  timestamptz,
  approved_by  uuid references public.profiles
);

-- Per-player score details
create table if not exists public.score_submission_players (
  id                  uuid primary key default gen_random_uuid(),
  score_submission_id uuid references public.score_submissions on delete cascade not null,
  user_id             uuid references public.profiles on delete cascade not null,
  wins                integer not null default 0,
  points              integer not null default 0,
  notes               text
);

-- Standings (recalculated on approval)
create table if not exists public.standings (
  id            uuid primary key default gen_random_uuid(),
  city_id       uuid references public.cities on delete cascade not null,
  season_id     uuid references public.seasons on delete cascade not null,
  user_id       uuid references public.profiles on delete cascade not null,
  total_points  integer not null default 0,
  total_wins    integer not null default 0,
  tables_played integer not null default 0,
  rank          integer,
  updated_at    timestamptz not null default now(),
  unique(season_id, user_id)
);

-- Announcements
create table if not exists public.announcements (
  id          uuid primary key default gen_random_uuid(),
  city_id     uuid references public.cities on delete cascade,  -- null = all cities
  season_id   uuid references public.seasons on delete cascade, -- null = all seasons
  title       text not null,
  body        text not null,
  pinned      boolean not null default false,
  created_by  uuid references public.profiles on delete cascade not null,
  created_at  timestamptz not null default now()
);

-- Indexes for common queries
create index if not exists idx_city_memberships_user on public.city_memberships(user_id);
create index if not exists idx_city_memberships_city_season on public.city_memberships(city_id, season_id);
create index if not exists idx_scramble_tables_city_season on public.scramble_tables(city_id, season_id);
create index if not exists idx_scramble_tables_creator on public.scramble_tables(creator_id);
create index if not exists idx_table_seats_table on public.table_seats(table_id);
create index if not exists idx_table_seats_user on public.table_seats(user_id);
create index if not exists idx_standings_city_season on public.standings(city_id, season_id);
create index if not exists idx_announcements_city on public.announcements(city_id);
