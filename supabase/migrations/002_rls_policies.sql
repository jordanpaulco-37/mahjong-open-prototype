-- ============================================================
-- THE MAHJONG OPEN — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.seasons enable row level security;
alter table public.city_memberships enable row level security;
alter table public.payments enable row level security;
alter table public.scramble_tables enable row level security;
alter table public.table_seats enable row level security;
alter table public.score_submissions enable row level security;
alter table public.score_submission_players enable row level security;
alter table public.standings enable row level security;
alter table public.announcements enable row level security;

-- Helper: check if user is admin
create or replace function public.is_admin()
returns boolean language sql security definer
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: get user's active paid city_id
create or replace function public.my_active_city_id()
returns uuid language sql security definer
as $$
  select city_id from public.city_memberships
  where user_id = auth.uid() and status = 'active' and paid_status = 'paid'
  order by created_at desc limit 1;
$$;

-- Helper: get user's active paid season_id
create or replace function public.my_active_season_id()
returns uuid language sql security definer
as $$
  select season_id from public.city_memberships
  where user_id = auth.uid() and status = 'active' and paid_status = 'paid'
  order by created_at desc limit 1;
$$;

-- ============================================================
-- PROFILES
-- ============================================================
create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid());

create policy "profiles_insert_own" on public.profiles
  for insert with check (id = auth.uid());

-- ============================================================
-- CITIES — public read, admin write
-- ============================================================
create policy "cities_public_read" on public.cities
  for select using (true);

create policy "cities_admin_write" on public.cities
  for all using (public.is_admin());

-- ============================================================
-- SEASONS — players see active seasons for their city
-- ============================================================
create policy "seasons_player_read" on public.seasons
  for select using (
    is_active = true or public.is_admin()
  );

create policy "seasons_admin_write" on public.seasons
  for all using (public.is_admin());

-- ============================================================
-- CITY_MEMBERSHIPS
-- ============================================================
create policy "memberships_own" on public.city_memberships
  for select using (user_id = auth.uid() or public.is_admin());

create policy "memberships_insert_own" on public.city_memberships
  for insert with check (user_id = auth.uid() or public.is_admin());

create policy "memberships_admin_update" on public.city_memberships
  for update using (public.is_admin());

-- ============================================================
-- PAYMENTS — own only
-- ============================================================
create policy "payments_own" on public.payments
  for select using (user_id = auth.uid() or public.is_admin());

create policy "payments_admin_all" on public.payments
  for all using (public.is_admin());

-- ============================================================
-- SCRAMBLE_TABLES — paid players see city tables
-- ============================================================
create policy "tables_city_read" on public.scramble_tables
  for select using (
    city_id = public.my_active_city_id()
    or public.is_admin()
  );

create policy "tables_paid_insert" on public.scramble_tables
  for insert with check (
    creator_id = auth.uid()
    and city_id = public.my_active_city_id()
    and exists (
      select 1 from public.city_memberships
      where user_id = auth.uid()
      and paid_status = 'paid'
      and status = 'active'
    )
  );

create policy "tables_admin_update" on public.scramble_tables
  for update using (public.is_admin());

-- ============================================================
-- TABLE_SEATS
-- ============================================================
create policy "seats_city_read" on public.table_seats
  for select using (
    exists (
      select 1 from public.scramble_tables t
      where t.id = table_id
      and t.city_id = public.my_active_city_id()
    )
    or public.is_admin()
  );

create policy "seats_paid_insert" on public.table_seats
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.city_memberships
      where user_id = auth.uid()
      and paid_status = 'paid'
      and status = 'active'
    )
  );

-- Players can cancel their own seat (24h check enforced in API route)
create policy "seats_cancel_own" on public.table_seats
  for update using (user_id = auth.uid() or public.is_admin());

-- ============================================================
-- SCORE_SUBMISSIONS
-- ============================================================
create policy "scores_read_seated" on public.score_submissions
  for select using (
    submitted_by = auth.uid()
    or exists (
      select 1 from public.table_seats ts
      where ts.table_id = table_id
      and ts.user_id = auth.uid()
      and ts.canceled_at is null
    )
    or public.is_admin()
  );

create policy "scores_insert_creator" on public.score_submissions
  for insert with check (
    submitted_by = auth.uid()
    and exists (
      select 1 from public.scramble_tables t
      where t.id = table_id
      and t.creator_id = auth.uid()
    )
  );

create policy "scores_admin_update" on public.score_submissions
  for update using (public.is_admin());

-- ============================================================
-- SCORE_SUBMISSION_PLAYERS
-- ============================================================
create policy "score_players_read_seated" on public.score_submission_players
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from public.score_submissions ss
      join public.table_seats ts on ts.table_id = ss.table_id
      where ss.id = score_submission_id
      and ts.user_id = auth.uid()
      and ts.canceled_at is null
    )
    or public.is_admin()
  );

create policy "score_players_insert_creator" on public.score_submission_players
  for insert with check (public.is_admin() or exists (
    select 1 from public.score_submissions ss
    join public.scramble_tables t on t.id = ss.table_id
    where ss.id = score_submission_id
    and t.creator_id = auth.uid()
  ));

create policy "score_players_admin_update" on public.score_submission_players
  for update using (public.is_admin());

-- ============================================================
-- STANDINGS — players see their city/season
-- ============================================================
create policy "standings_city_read" on public.standings
  for select using (
    city_id = public.my_active_city_id()
    or public.is_admin()
  );

create policy "standings_admin_write" on public.standings
  for all using (public.is_admin());

-- ============================================================
-- ANNOUNCEMENTS — players see their city or global
-- ============================================================
create policy "announcements_player_read" on public.announcements
  for select using (
    city_id is null
    or city_id = public.my_active_city_id()
    or public.is_admin()
  );

create policy "announcements_admin_write" on public.announcements
  for all using (public.is_admin());
