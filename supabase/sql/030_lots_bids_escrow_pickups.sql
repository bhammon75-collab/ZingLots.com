-- ZingLots B2B: Core Marketplace Tables (Lots, Bids, Escrow, Pickups)

-- B2B Surplus Lots with hyperlocal pickup requirements
create table if not exists public.lots (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references auth.users(id) on delete cascade,
  region_id uuid not null references public.regions(id),
  location_id uuid references public.locations(id),
  title text not null,
  description text,
  vertical vertical_type not null,
  uom uom_type not null,
  quantity numeric,
  weight_kg numeric,
  length_cm numeric,
  width_cm numeric,
  height_cm numeric,
  condition text, -- "New", "Like New", "Good", "Fair", "For Parts"
  pickup_radius_km numeric not null default 50,
  pickup_window_start timestamptz,
  pickup_window_end timestamptz,
  needs_forklift boolean default false,
  needs_dock boolean default false,
  hazmat boolean default false,
  msds_required boolean default false,
  start_price_cents int not null,
  reserve_price_cents int,
  increment_cents int not null default 500, -- $5 minimum increment
  published boolean not null default false,
  status lot_status not null default 'draft',
  start_time timestamptz,
  end_time timestamptz,
  soft_close_extend_count int default 0, -- track anti-snipe extensions
  photos jsonb, -- array of {url, alt_text, order}
  metadata jsonb, -- equipment specs, serial numbers, compliance certs
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_lots_updated_at before update on public.lots
for each row execute procedure public.update_updated_at_column();

create index if not exists idx_lots_region on public.lots(region_id);
create index if not exists idx_lots_seller on public.lots(seller_id);
create index if not exists idx_lots_status on public.lots(status);
create index if not exists idx_lots_vertical on public.lots(vertical);
create index if not exists idx_lots_endtime on public.lots(end_time) where end_time is not null;
create index if not exists idx_lots_published on public.lots(published, status);

-- Bidding with radius validation
create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id) on delete cascade,
  bidder_id uuid not null references auth.users(id) on delete cascade,
  amount_cents int not null,
  bidder_lat double precision, -- for radius validation
  bidder_lon double precision,
  is_valid boolean default true, -- post-validation flag
  created_at timestamptz default now()
);

create index if not exists idx_bids_lot on public.bids(lot_id, created_at desc);
create index if not exists idx_bids_bidder on public.bids(bidder_id);
create index if not exists idx_bids_amount on public.bids(lot_id, amount_cents desc);

-- Escrow for secure payment handling
create table if not exists public.escrow (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id) on delete cascade,
  winner_id uuid not null references auth.users(id) on delete cascade,
  status escrow_status not null default 'awaiting_payment',
  amount_cents int not null,
  marketplace_fee_cents int not null default 0,
  seller_payout_cents int not null,
  payment_intent_id text, -- Stripe PaymentIntent ID
  transfer_id text, -- Stripe Transfer ID when paid out
  expires_at timestamptz, -- payment deadline
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_escrow_updated_at before update on public.escrow
for each row execute procedure public.update_updated_at_column();

create unique index if not exists idx_escrow_lot on public.escrow(lot_id);
create index if not exists idx_escrow_winner on public.escrow(winner_id);
create index if not exists idx_escrow_status on public.escrow(status);

-- QR Code Pickup Verification
create table if not exists public.pickups (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id) on delete cascade,
  qr_token text not null unique,
  status pickup_status not null default 'pending',
  scheduled_at timestamptz,
  expires_at timestamptz,
  scanned_at timestamptz,
  scanned_by uuid references auth.users(id),
  proof_photos jsonb, -- array of photo URLs
  pickup_notes text,
  created_at timestamptz default now()
);

create index if not exists idx_pickups_lot on public.pickups(lot_id);
create index if not exists idx_pickups_token on public.pickups(qr_token);
create index if not exists idx_pickups_status on public.pickups(status);

-- Inspection scheduling for high-value items
create table if not exists public.inspections (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id) on delete cascade,
  requester_id uuid not null references auth.users(id) on delete cascade,
  status inspection_status not null default 'requested',
  requested_slots timestamptz[], -- buyer's preferred times
  confirmed_slot timestamptz,
  notes text,
  inspector_notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create trigger update_inspections_updated_at before update on public.inspections
for each row execute procedure public.update_updated_at_column();

create index if not exists idx_inspections_lot on public.inspections(lot_id);
create index if not exists idx_inspections_requester on public.inspections(requester_id);
create index if not exists idx_inspections_status on public.inspections(status);

-- Valuation tracking for AI pricing assistance
create table if not exists public.valuations (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references public.lots(id) on delete cascade,
  method text not null, -- "comps_ai", "manual", "api_lookup"
  low_cents int,
  high_cents int,
  suggested_start_cents int,
  suggested_reserve_cents int,
  confidence_score numeric(3,2), -- 0.00 to 1.00
  rationale text,
  comparables_data jsonb, -- source data used
  created_at timestamptz default now()
);

create index if not exists idx_valuations_lot on public.valuations(lot_id, created_at desc);
