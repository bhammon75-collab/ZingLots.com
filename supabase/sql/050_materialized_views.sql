-- ZingLots B2B: Materialized Views for Performance

-- Lot summary view for fast browsing and search
create materialized view if not exists public.lot_summary_mv as
select
  l.id,
  l.seller_id,
  l.region_id,
  l.title,
  l.vertical,
  l.uom,
  l.quantity,
  l.condition,
  l.status,
  l.end_time,
  l.pickup_radius_km,
  l.needs_forklift,
  l.needs_dock,
  l.hazmat,
  l.published,
  l.created_at,
  -- Current pricing
  l.start_price_cents,
  l.reserve_price_cents,
  coalesce(max(b.amount_cents), l.start_price_cents) as current_price_cents,
  
  -- Bidding activity
  count(distinct b.bidder_id) as unique_bidders,
  count(b.id) as total_bids,
  max(b.created_at) as last_bid_at,
  
  -- Location info
  r.name as region_name,
  r.slug as region_slug,
  loc.city,
  loc.state,
  
  -- Seller info
  p.display_name as seller_name,
  p.business_name as seller_business_name,
  p.verification_tier as seller_verification,
  
  -- Photos
  (l.photos->0->'url') as thumbnail_url,
  
  -- Time remaining (for active lots)
  case 
    when l.end_time is not null and l.status = 'active'
    then extract(epoch from (l.end_time - now()))
    else null
  end as seconds_remaining,
  
  -- Pickup location point for distance calculations
  coalesce(loc.point, r.center) as pickup_point
  
from public.lots l
left join public.bids b on b.lot_id = l.id and b.is_valid = true
left join public.regions r on r.id = l.region_id
left join public.locations loc on loc.id = l.location_id
left join public.profiles p on p.id = l.seller_id
where l.published = true
group by l.id, r.id, r.name, r.slug, r.center, loc.id, loc.city, loc.state, loc.point, p.id, p.display_name, p.business_name, p.verification_tier;

-- Indexes for fast filtering
create unique index if not exists idx_lot_summary_mv_id on public.lot_summary_mv(id);
create index if not exists idx_lot_summary_mv_region on public.lot_summary_mv(region_slug);
create index if not exists idx_lot_summary_mv_vertical on public.lot_summary_mv(vertical);
create index if not exists idx_lot_summary_mv_status on public.lot_summary_mv(status);
create index if not exists idx_lot_summary_mv_ending_soon on public.lot_summary_mv(seconds_remaining) where seconds_remaining is not null;
create index if not exists idx_lot_summary_mv_recent on public.lot_summary_mv(created_at desc);
create index if not exists idx_lot_summary_mv_pickup_point on public.lot_summary_mv using gist(pickup_point);

-- Seller performance view for dashboards
create materialized view if not exists public.seller_stats_mv as
select
  p.id as seller_id,
  p.display_name,
  p.business_name,
  p.verification_tier,
  p.created_at as joined_at,
  
  -- Lot statistics
  count(l.id) as total_lots,
  count(l.id) filter (where l.status = 'sold') as lots_sold,
  count(l.id) filter (where l.status = 'active') as lots_active,
  
  -- Financial metrics (last 30 days)
  sum(e.amount_cents) filter (where e.created_at > now() - interval '30 days') as revenue_cents_30d,
  
  -- Performance metrics
  avg(
    case when l.status = 'sold' 
    then extract(epoch from (l.end_time - l.start_time)) / 3600 
    end
  ) as avg_hours_to_sell,
  
  -- Rating placeholder (could be calculated from reviews later)
  5.0 as rating,
  
  -- Recent activity
  max(l.created_at) as last_listing_at,
  max(e.created_at) as last_sale_at
  
from public.profiles p
left join public.lots l on l.seller_id = p.id
left join public.escrow e on e.lot_id = l.id and e.status = 'picked_up'
where public.can_sell(p.id)
group by p.id, p.display_name, p.business_name, p.verification_tier, p.created_at;

create unique index if not exists idx_seller_stats_mv_id on public.seller_stats_mv(seller_id);
create index if not exists idx_seller_stats_mv_verification on public.seller_stats_mv(verification_tier);

-- Regional activity view for operations
create materialized view if not exists public.region_stats_mv as
select
  r.id as region_id,
  r.name as region_name,
  r.slug as region_slug,
  r.type as region_type,
  
  -- Lot activity
  count(l.id) as total_lots,
  count(l.id) filter (where l.status = 'active') as active_lots,
  count(l.id) filter (where l.created_at > now() - interval '7 days') as new_lots_7d,
  
  -- Bidding activity
  count(distinct b.bidder_id) as unique_bidders,
  avg(lot_summary.unique_bidders) as avg_bidders_per_lot,
  
  -- Financial metrics
  sum(e.amount_cents) filter (where e.created_at > now() - interval '30 days') as gmv_cents_30d,
  
  -- Market health
  avg(
    case when l.status = 'sold'
    then lot_summary.unique_bidders
    end
  ) as avg_bidders_sold_lots,
  
  -- Pickup efficiency
  avg(
    case when pk.status = 'completed'
    then extract(epoch from (pk.scanned_at - e.created_at)) / 3600
    end
  ) as avg_pickup_hours
  
from public.regions r
left join public.lots l on l.region_id = r.id and l.published = true
left join public.bids b on b.lot_id = l.id and b.is_valid = true
left join public.escrow e on e.lot_id = l.id
left join public.pickups pk on pk.lot_id = l.id
left join public.lot_summary_mv lot_summary on lot_summary.id = l.id
where r.active = true
group by r.id, r.name, r.slug, r.type;

create unique index if not exists idx_region_stats_mv_id on public.region_stats_mv(region_id);
create index if not exists idx_region_stats_mv_slug on public.region_stats_mv(region_slug);

-- Function to refresh all materialized views
create or replace function public.refresh_lot_summary()
returns void 
language sql 
security definer
as $$
  refresh materialized view concurrently public.lot_summary_mv;
  refresh materialized view concurrently public.seller_stats_mv;
  refresh materialized view concurrently public.region_stats_mv;
$$;

-- Function to auto-refresh views on data changes (could be called from triggers or cron)
create or replace function public.trigger_refresh_views()
returns trigger
language plpgsql
security definer
as $$
begin
  -- Use pg_notify to trigger async refresh
  perform pg_notify('refresh_views', 'lot_summary');
  return coalesce(new, old);
end;
$$;

-- Example triggers for auto-refresh (commented out to avoid performance impact during development)
-- create trigger refresh_on_lot_change after insert or update or delete on public.lots
--   for each row execute function public.trigger_refresh_views();
-- create trigger refresh_on_bid_change after insert or update or delete on public.bids
--   for each row execute function public.trigger_refresh_views();

-- Grant access to views
grant select on public.lot_summary_mv to authenticated, anon;
grant select on public.seller_stats_mv to authenticated, anon;
grant select on public.region_stats_mv to authenticated, anon;
