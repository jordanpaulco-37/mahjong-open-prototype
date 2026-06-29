-- Launch 1 registration schema (review only)
-- Purpose:
--   - public registration flow
--   - no portal/tables/scores/standings in this pass
--   - city and series are seeded for launch

BEGIN;

-- Ensure UUID generation is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Profiles (minimal profile record for future auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  text,
  email      text NOT NULL,
  phone      text,
  role       text NOT NULL DEFAULT 'player'
             CHECK (role IN ('player', 'admin', 'commissioner')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2) Cities (seed with launch options)
CREATE TABLE IF NOT EXISTS public.cities (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  state      text NOT NULL,
  slug       text NOT NULL UNIQUE,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3) Series (launch series only)
CREATE TABLE IF NOT EXISTS public.series (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                  text NOT NULL UNIQUE,
  starts_at             date NOT NULL,
  ends_at               date NOT NULL,
  registration_closes_at date,
  total_weeks           integer NOT NULL DEFAULT 8,
  price_cents           integer NOT NULL DEFAULT 8000,
  is_active             boolean NOT NULL DEFAULT true,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- 4) Registrations / memberships (launch signup record)
CREATE TABLE IF NOT EXISTS public.registrations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name     text NOT NULL,
  email         text NOT NULL,
  phone         text,
  city_id       uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  series_id     uuid NOT NULL REFERENCES public.series(id) ON DELETE CASCADE,
  skill_level   text NOT NULL
                CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  paid_status   text NOT NULL DEFAULT 'pending'
                CHECK (paid_status IN ('pending', 'paid', 'refunded')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (email, series_id)
);

-- 5) Payments (one or more per registration)
CREATE TABLE IF NOT EXISTS public.payments (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id      uuid NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
  amount_cents          integer NOT NULL DEFAULT 8000,
  currency              text NOT NULL DEFAULT 'USD',
  status                text NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  provider              text NOT NULL DEFAULT 'stripe',
  provider_payment_id   text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on all launch tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Seed launch cities (dropdown options)
INSERT INTO public.cities (name, state, slug, is_active)
VALUES
  ('Ocean Springs', 'MS', 'ocean-springs-ms', true),
  ('Meridian', 'MS', 'meridian-ms', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed the first launch series
INSERT INTO public.series (
  name,
  starts_at,
  ends_at,
  registration_closes_at,
  total_weeks,
  price_cents,
  is_active
)
VALUES (
  'The Mahjong Open — 2026 — Series One',
  '2026-08-17',
  '2026-10-11',
  '2026-08-31',
  8,
  8000,
  true
)
ON CONFLICT (name) DO NOTHING;

-- Public read policies for catalog tables only
DROP POLICY IF EXISTS "Public can read active cities" ON public.cities;
CREATE POLICY "Public can read active cities"
  ON public.cities
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Public can read active series" ON public.series;
CREATE POLICY "Public can read active series"
  ON public.series
  FOR SELECT
  USING (is_active = true);

-- No public policies for profiles, registrations, or payments.
-- These must be written/read only server-side using the service_role key.

COMMIT;
