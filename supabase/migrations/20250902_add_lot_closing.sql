-- Anti-snipe persistence and base price tables
create table if not exists public.lot_closing (
  lot_id text primary key,
  end_at timestamptz not null,
  extensions_used int not null default 0,
  max_extensions int not null default 5,
  anti_snipe_window_sec int not null default 120,
  updated_at timestamptz not null default now()
);

create table if not exists public.lot_prices (
  lot_id text primary key references public.lot_closing(lot_id) on delete cascade,
  start_price numeric not null default 0,
  reserve numeric not null default 0,
  current_price numeric not null default 0,
  updated_at timestamptz not null default now()
);

-- Increment ladder helper (simplified to mirror client bidIncrements)
create or replace function public.compute_increment(p_price numeric)
returns numeric language sql immutable as $$
  select case
    when p_price <= 100 then 1
    when p_price <= 500 then 5
    when p_price <= 1000 then 10
    when p_price <= 5000 then 25
    when p_price <= 10000 then 50
    else 100
  end;
$$;

-- Extend closing time if inside anti-snipe window (transactional)
create or replace function public.extend_lot_if_needed(p_lot_id text, p_now timestamptz)
returns public.lot_closing
language plpgsql
security definer
as $$
declare
  r public.lot_closing;
begin
  -- Ensure row exists (default to +10 minutes if missing)
  insert into public.lot_closing(lot_id, end_at)
  values (p_lot_id, p_now + interval '10 minutes')
  on conflict (lot_id) do nothing;

  -- Lock row
  select * into r from public.lot_closing where lot_id = p_lot_id for update;

  if r is null then
    raise exception 'lot_closing row not found for %', p_lot_id;
  end if;

  if (extract(epoch from (r.end_at - p_now)) <= r.anti_snipe_window_sec)
     and (r.extensions_used < r.max_extensions) then
    r.end_at := p_now + make_interval(secs => r.anti_snipe_window_sec);
    r.extensions_used := r.extensions_used + 1;
    r.updated_at := now();
    update public.lot_closing
      set end_at = r.end_at,
          extensions_used = r.extensions_used,
          updated_at = r.updated_at
      where lot_id = p_lot_id;
  end if;

  return r;
end
$$;

-- Sitemap helper: list product paths from lot_prices
create or replace function public.list_sitemap_lots()
returns table(path text, lastmod timestamptz)
language sql stable as $$
  select '/product/' || lot_id as path, updated_at as lastmod from public.lot_prices order by updated_at desc limit 1000;
$$;

