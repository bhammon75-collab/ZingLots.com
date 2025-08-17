-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "postgis";
create extension if not exists "pg_trgm";

-- Create schema for our app
create schema if not exists marketplace;

-- Enums for various statuses
create type marketplace.business_verification_status as enum ('pending', 'approved', 'rejected', 'manual_review');
create type marketplace.item_status as enum ('draft', 'published', 'ended', 'removed');
create type marketplace.content_flag_status as enum ('open', 'dismissed', 'resolved');
create type marketplace.ticket_status as enum ('open', 'awaiting_user', 'resolved', 'escalated');
create type marketplace.lead_status as enum ('new', 'contacted', 'interested', 'converted', 'dead');

-- Businesses & KYB
create table marketplace.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references auth.users(id),
  name text not null,
  tax_id text,
  address jsonb,
  verified_at timestamptz,
  stripe_account_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table marketplace.kyb_applications (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references marketplace.businesses(id) not null,
  status marketplace.business_verification_status default 'pending',
  risk_score int,
  reasons jsonb,
  documents jsonb,
  ai_analysis jsonb,
  submitted_at timestamptz default now(),
  decided_at timestamptz,
  decided_by text
);

-- Listings with B2B specific fields
create table marketplace.items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references marketplace.businesses(id) not null,
  title text,
  description text,
  ai_generated_title text,
  ai_generated_description text,
  category text,
  subcategory text,
  condition text,
  location_city text,
  location_region text,
  location_point geography(Point, 4326),
  reserve_cents int,
  start_price_cents int,
  current_price_cents int,
  status marketplace.item_status default 'draft',
  -- B2B specific fields
  unit_of_measure text,
  quantity numeric,
  weight_kg numeric,
  dimensions_cm jsonb, -- {length, width, height}
  power_requirements text,
  compliance_marks jsonb,
  hazmat_flags jsonb,
  requires_forklift boolean default false,
  has_loading_dock boolean default false,
  pickup_window_start timestamptz,
  pickup_window_end timestamptz,
  ends_at timestamptz,
  ai_metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes for geo queries
create index idx_items_location on marketplace.items using gist(location_point);
create index idx_items_status_region on marketplace.items(status, location_region);

create table marketplace.item_images (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references marketplace.items(id) on delete cascade,
  path text not null,
  alt_text text,
  ai_analysis jsonb,
  is_primary boolean default false,
  created_at timestamptz default now()
);

-- Bidding
create table marketplace.bids (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references marketplace.items(id) on delete cascade,
  bidder_id uuid references auth.users(id),
  amount_cents int not null,
  is_winning boolean default false,
  placed_at timestamptz default now()
);

create index idx_bids_item_amount on marketplace.bids(item_id, amount_cents desc);

-- Valuation & pricing
create table marketplace.valuations (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references marketplace.items(id) on delete cascade,
  method text,
  low_cents int,
  high_cents int,
  suggested_start_cents int,
  suggested_reserve_cents int,
  comparables jsonb,
  rationale text,
  confidence_score numeric,
  created_at timestamptz default now()
);

create table marketplace.price_adjustments (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references marketplace.items(id) on delete cascade,
  reason text,
  old_start_cents int,
  new_start_cents int,
  approved_by text,
  applied_at timestamptz,
  created_at timestamptz default now()
);

-- T&S / Moderation
create table marketplace.content_flags (
  id uuid primary key default gen_random_uuid(),
  subject_type text,
  subject_id uuid,
  flag text,
  severity int,
  ai_detection jsonb,
  notes text,
  status marketplace.content_flag_status default 'open',
  reviewed_by uuid references auth.users(id),
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- Support & disputes
create table marketplace.tickets (
  id uuid primary key default gen_random_uuid(),
  opener_user_id uuid references auth.users(id),
  item_id uuid references marketplace.items(id),
  kind text,
  status marketplace.ticket_status default 'open',
  summary text,
  ai_summary text,
  ai_suggested_resolution jsonb,
  resolution text,
  messages jsonb,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

-- Growth & Lead Generation
create table marketplace.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  business_name text,
  website text,
  contact jsonb,
  region text,
  source text,
  ai_enrichment jsonb,
  status marketplace.lead_status default 'new',
  notes text,
  assigned_to uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table marketplace.outreach_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text,
  region text,
  template_name text,
  ai_personalization jsonb,
  sent_count int default 0,
  opened_count int default 0,
  reply_count int default 0,
  conversion_count int default 0,
  created_at timestamptz default now()
);

-- Inspections
create table marketplace.inspections (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references marketplace.items(id) on delete cascade,
  requester_id uuid references auth.users(id),
  scheduled_for timestamptz,
  status text default 'requested',
  notes text,
  created_at timestamptz default now()
);

-- AI Agent Activity Log
create table marketplace.ai_agent_logs (
  id uuid primary key default gen_random_uuid(),
  agent_type text not null, -- 'kyb', 'listing_copilot', 'valuation', etc.
  action text not null,
  subject_type text,
  subject_id uuid,
  input jsonb,
  output jsonb,
  model_version text,
  tokens_used int,
  latency_ms int,
  error text,
  created_at timestamptz default now()
);

-- Audit log for compliance
create table marketplace.audit_log (
  id bigserial primary key,
  actor text,
  action text,
  subject_type text,
  subject_id uuid,
  payload jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz default now()
);

-- Create indexes for performance
create index idx_audit_log_created on marketplace.audit_log(created_at desc);
create index idx_ai_agent_logs_created on marketplace.ai_agent_logs(created_at desc);
create index idx_ai_agent_logs_agent on marketplace.ai_agent_logs(agent_type, created_at desc);
create index idx_leads_region_status on marketplace.leads(region, status);
create index idx_content_flags_subject on marketplace.content_flags(subject_type, subject_id);

-- RLS Policies
alter table marketplace.businesses enable row level security;
alter table marketplace.items enable row level security;
alter table marketplace.bids enable row level security;
alter table marketplace.inspections enable row level security;

-- Business owners can see their own businesses
create policy "Business owners can view own business"
  on marketplace.businesses for select
  using (owner_user_id = auth.uid());

-- Anyone can view published items
create policy "Published items are public"
  on marketplace.items for select
  using (status = 'published');

-- Business owners can manage their items
create policy "Business owners can manage items"
  on marketplace.items for all
  using (business_id in (
    select id from marketplace.businesses where owner_user_id = auth.uid()
  ));

-- Authenticated users can place bids
create policy "Authenticated users can bid"
  on marketplace.bids for insert
  with check (auth.uid() = bidder_id);

-- Bidders can see their own bids
create policy "Users can see own bids"
  on marketplace.bids for select
  using (bidder_id = auth.uid());
