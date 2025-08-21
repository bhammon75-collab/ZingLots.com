-- ZingLots B2B: Business Profiles with Verification Tiers
-- Enhanced profiles for B2B users with business context
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  verification_tier verification_tier not null default 'T0', -- T0=browse, T1=bid≤$500, T2=sell+higher, T3=verified biz
  business_name text,
  business_license text,
  business_type text, -- contractor, restaurant, municipal, etc.
  default_region_id uuid references public.regions(id),
  stripe_connect_id text,
  stripe_customer_id text,
  last_known_lat double precision,
  last_known_lon double precision,
  notification_preferences jsonb default '{"email": true, "sms": false, "push": true}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles
for each row execute procedure public.update_updated_at_column();

create index if not exists idx_profiles_region on public.profiles(default_region_id);
create index if not exists idx_profiles_verification on public.profiles(verification_tier);
create index if not exists idx_profiles_business_type on public.profiles(business_type);

-- KYB (Know Your Business) verification tracking
create table if not exists public.kyb_applications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  business_name text not null,
  tax_id text,
  business_license text,
  address jsonb,
  beneficial_owners jsonb, -- UBO data
  submitted_documents jsonb, -- file paths and metadata
  status text check (status in ('pending','approved','rejected','manual_review')) default 'pending',
  risk_score int check (risk_score >= 0 and risk_score <= 100),
  reasons jsonb, -- approval/rejection reasons
  submitted_at timestamptz default now(),
  decided_at timestamptz,
  reviewed_by uuid references public.profiles(id),
  notes text
);

create index if not exists idx_kyb_profile on public.kyb_applications(profile_id);
create index if not exists idx_kyb_status on public.kyb_applications(status);

-- Helper: create profile on new auth user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, verification_tier)
  values (
    new.id, 
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
    'T0'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Ensure trigger exists
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: check if user can bid on amount
create or replace function public.can_bid(user_id uuid, amount_cents int)
returns boolean as $$
declare
  tier verification_tier;
begin
  select verification_tier into tier from public.profiles where id = user_id;
  
  case tier
    when 'T0' then return false; -- T0 can only browse
    when 'T1' then return amount_cents <= 50000; -- T1 can bid up to $500
    when 'T2', 'T3' then return true; -- T2+ can bid any amount
    else return false;
  end case;
end;
$$ language plpgsql stable;

-- Helper: check if user can sell
create or replace function public.can_sell(user_id uuid)
returns boolean as $$
declare
  tier verification_tier;
begin
  select verification_tier into tier from public.profiles where id = user_id;
  return tier in ('T2', 'T3');
end;
$$ language plpgsql stable;
