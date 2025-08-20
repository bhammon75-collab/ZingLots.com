-- ZingLots B2B: Regions & Locations for Hyperlocal Marketplace
-- Regions for organizing markets by geography
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  type region_type not null default 'city',
  parent_id uuid references public.regions(id) on delete set null,
  lat double precision,
  lon double precision,
  center geography(Point, 4326),
  active boolean not null default true,
  created_at timestamptz default now()
);

-- Auto-populate center point from lat/lon
create or replace function public.set_region_center()
returns trigger language plpgsql as $$
begin
  if new.lat is not null and new.lon is not null then
    new.center := ST_SetSRID(ST_MakePoint(new.lon, new.lat),4326)::geography;
  end if;
  return new;
end;$$;

create trigger trg_set_region_center
before insert or update on public.regions
for each row execute function public.set_region_center();

create index if not exists idx_regions_center on public.regions using gist(center);
create index if not exists idx_regions_active_slug on public.regions(active, slug) where active = true;

-- Business pickup/delivery locations
create table if not exists public.locations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  label text,
  address text,
  city text,
  state text,
  postal_code text,
  lat double precision,
  lon double precision,
  point geography(Point, 4326),
  has_forklift boolean default false,
  has_dock boolean default false,
  pickup_instructions text,
  business_hours jsonb, -- {mon: "8-17", tue: "8-17", ...}
  created_at timestamptz default now()
);

-- Auto-populate point from lat/lon
create or replace function public.set_location_point()
returns trigger language plpgsql as $$
begin
  if new.lat is not null and new.lon is not null then
    new.point := ST_SetSRID(ST_MakePoint(new.lon, new.lat),4326)::geography;
  end if;
  return new;
end;$$;

create trigger trg_set_location_point
before insert or update on public.locations
for each row execute function public.set_location_point();

create index if not exists idx_locations_point on public.locations using gist(point);
create index if not exists idx_locations_owner on public.locations(owner_id);

-- Seed major regions (Seattle pilot)
insert into public.regions (name, slug, type, lat, lon) values 
  ('Washington', 'wa', 'state', 47.7511, -120.7401),
  ('Seattle', 'seattle', 'city', 47.6062, -122.3321),
  ('Tacoma', 'tacoma', 'city', 47.2529, -122.4443),
  ('Bellevue', 'bellevue', 'city', 47.6101, -122.2015)
on conflict (slug) do nothing;

-- Set parent relationships
update public.regions set parent_id = (select id from public.regions where slug = 'wa') 
where slug in ('seattle', 'tacoma', 'bellevue') and parent_id is null;
