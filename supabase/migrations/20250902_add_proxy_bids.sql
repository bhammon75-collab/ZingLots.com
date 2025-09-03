-- Proxy bids schema
create table if not exists public.proxy_bids (
  id uuid primary key default gen_random_uuid(),
  lot_id text not null,
  user_id uuid not null,
  max_amount numeric not null,
  created_at timestamptz not null default now(),
  unique (lot_id, user_id)
);

-- Basic index for lookups
create index if not exists proxy_bids_lot_idx on public.proxy_bids(lot_id);

