-- ZingLots B2B: Row Level Security Policies

-- Enable RLS on all tables
alter table public.regions enable row level security;
alter table public.locations enable row level security;
alter table public.profiles enable row level security;
alter table public.kyb_applications enable row level security;
alter table public.lots enable row level security;
alter table public.bids enable row level security;
alter table public.escrow enable row level security;
alter table public.pickups enable row level security;
alter table public.inspections enable row level security;
alter table public.valuations enable row level security;

-- Helper: check if user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles p 
    where p.id = auth.uid() and p.verification_tier = 'T3'
    and p.business_type = 'admin'
  );
$$ language sql stable;

-- REGIONS POLICIES --
create policy "regions_public_read" on public.regions 
  for select using (active = true);

create policy "regions_admin_write" on public.regions 
  for all using (public.is_admin());

-- LOCATIONS POLICIES --
create policy "locations_owner_full" on public.locations 
  for all using (auth.uid() = owner_id) 
  with check (auth.uid() = owner_id);

create policy "locations_public_read_basic" on public.locations 
  for select using (true); -- Allow reading for pickup radius calculations

-- PROFILES POLICIES --
create policy "profiles_self_read" on public.profiles 
  for select using (auth.uid() = id);

create policy "profiles_self_write" on public.profiles 
  for all using (auth.uid() = id) 
  with check (auth.uid() = id);

create policy "profiles_public_read_limited" on public.profiles 
  for select using (true); -- Allow reading display_name, business_name for seller info

-- KYB APPLICATIONS POLICIES --
create policy "kyb_self_read" on public.kyb_applications 
  for select using (auth.uid() = profile_id);

create policy "kyb_self_write" on public.kyb_applications 
  for insert with check (auth.uid() = profile_id);

create policy "kyb_admin_full" on public.kyb_applications 
  for all using (public.is_admin());

-- LOTS POLICIES --
create policy "lots_published_read" on public.lots 
  for select using (published = true and status in ('published', 'active'));

create policy "lots_seller_full" on public.lots 
  for all using (auth.uid() = seller_id) 
  with check (auth.uid() = seller_id and public.can_sell(auth.uid()));

create policy "lots_admin_full" on public.lots 
  for all using (public.is_admin());

-- BIDS POLICIES --
create policy "bids_public_read" on public.bids 
  for select using (true); -- Transparent bidding

create policy "bids_authenticated_insert" on public.bids 
  for insert with check (
    auth.role() = 'authenticated' 
    and auth.uid() = bidder_id
    and public.can_bid(auth.uid(), amount_cents)
  );

-- ESCROW POLICIES --
create policy "escrow_parties_read" on public.escrow 
  for select using (
    auth.uid() = winner_id 
    or auth.uid() in (select seller_id from public.lots where id = lot_id)
    or public.is_admin()
  );

create policy "escrow_system_write" on public.escrow 
  for all using (public.is_admin()); -- Only system/admin creates escrow

-- PICKUPS POLICIES --
create policy "pickups_parties_read" on public.pickups 
  for select using (
    auth.uid() in (select seller_id from public.lots where id = lot_id)
    or auth.uid() in (select winner_id from public.escrow where lot_id = public.pickups.lot_id)
    or public.is_admin()
  );

create policy "pickups_seller_scan" on public.pickups 
  for update using (
    auth.uid() in (select seller_id from public.lots where id = lot_id)
    or public.is_admin()
  );

-- INSPECTIONS POLICIES --
create policy "inspections_requester_read" on public.inspections 
  for select using (auth.uid() = requester_id);

create policy "inspections_seller_read" on public.inspections 
  for select using (
    auth.uid() in (select seller_id from public.lots where id = lot_id)
  );

create policy "inspections_authenticated_request" on public.inspections 
  for insert with check (
    auth.role() = 'authenticated' 
    and auth.uid() = requester_id
  );

create policy "inspections_seller_respond" on public.inspections 
  for update using (
    auth.uid() in (select seller_id from public.lots where id = lot_id)
    or public.is_admin()
  );

-- VALUATIONS POLICIES --
create policy "valuations_lot_owner_read" on public.valuations 
  for select using (
    auth.uid() in (select seller_id from public.lots where id = lot_id)
    or public.is_admin()
  );

create policy "valuations_system_write" on public.valuations 
  for all using (public.is_admin()); -- AI agents use service role

-- HELPER FUNCTIONS FOR BUSINESS LOGIC --

-- Get winning bid for a lot
create or replace function public.get_winning_bid(p_lot_id uuid)
returns table (
  bidder_id uuid,
  amount_cents int,
  created_at timestamptz
) as $$
begin
  return query
  select b.bidder_id, b.amount_cents, b.created_at
  from public.bids b
  where b.lot_id = p_lot_id and b.is_valid = true
  order by b.amount_cents desc, b.created_at asc
  limit 1;
end;
$$ language plpgsql stable;

-- Calculate marketplace fee (configurable per seller or global)
create or replace function public.calculate_marketplace_fee(
  amount_cents int,
  seller_id uuid default null
)
returns int as $$
declare
  fee_bps int := 900; -- Default 9%
begin
  -- Could customize by seller tier, lot category, etc.
  return (amount_cents * fee_bps) / 10000;
end;
$$ language plpgsql stable;

-- Haversine distance calculation (for radius validation)
create or replace function public.haversine_km(
  lat1 double precision, 
  lon1 double precision, 
  lat2 double precision, 
  lon2 double precision
)
returns double precision as $$
declare
  dlat double precision;
  dlon double precision;
  a double precision;
  c double precision;
  r double precision := 6371; -- Earth radius in km
begin
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat/2) * sin(dlat/2) + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) * sin(dlon/2);
  c := 2 * asin(sqrt(a));
  return r * c;
end;
$$ language plpgsql immutable;
