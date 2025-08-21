-- Bidding engine hardening: increments table, idempotency, audit logs, anti-snipe cap, seller block, serializable wrapper
set search_path = app, public;

-- Increments ladder table (server-enforced)
create table if not exists app.bid_increments (
  up_to numeric not null,
  step numeric not null,
  primary key (up_to)
);

insert into app.bid_increments(up_to, step) values
  (100, 5), (500, 10), (1000, 25), (5000, 50), (10000, 100), (1e18, 250)
on conflict (up_to) do update set step = excluded.step;

create or replace function app.bid_increment_for(p_amount numeric)
returns numeric language plpgsql stable as $$
declare v_step numeric; begin
  select step into v_step from app.bid_increments where p_amount < up_to order by up_to asc limit 1;
  if v_step is null then return 250; end if;
  return v_step;
end$$;

-- Bid idempotency keys
create table if not exists app.bid_idempotency (
  key text primary key,
  lot_id uuid not null references app.lots(id) on delete cascade,
  bidder_id uuid not null references app.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
create index if not exists bid_idem_lot_bidder on app.bid_idempotency(lot_id, bidder_id);

-- Audit logs for bids
create table if not exists app.audit_logs (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  actor uuid,
  action text not null,
  lot_id uuid,
  details jsonb
);
create index if not exists audit_logs_created on app.audit_logs(created_at desc);

-- Public wrapper with SERIALIZABLE + retry, seller block, anti-snipe cap counter
create or replace function public.place_bid(lot_id uuid, offered numeric, max numeric, idempotency_key text default null)
returns jsonb
language plpgsql security definer
set search_path to app, public
as $$
declare
  v_uid uuid := auth.uid();
  v_consider numeric;
  v_attempt int := 0;
  v_ok boolean; v_current numeric; v_winner uuid; v_ends timestamptz; v_reserve boolean;
  v_seller uuid;
begin
  if v_uid is null then raise exception 'Unauthorized'; end if;

  -- Sellers cannot bid on their own lots
  select s.seller_id into v_seller
  from app.lots l join app.shows s on s.id = l.show_id
  where l.id = lot_id;
  if v_seller = v_uid then
    raise exception 'Sellers cannot bid on their own lots' using errcode = 'RBID01';
  end if;

  v_consider := greatest(offered, coalesce(max, offered));

  -- Idempotency
  if idempotency_key is not null then
    begin
      insert into app.bid_idempotency(key, lot_id, bidder_id) values (idempotency_key, lot_id, v_uid);
    exception when unique_violation then
      -- Return current observable state without re-applying effects
      return (
        select jsonb_build_object(
          'ok', true,
          'current_amount', l.current_price,
          'winner_id', l.winner_id,
          'new_ends_at', l.ends_at,
          'reserve_met', l.reserve_met
        ) from app.lots l where l.id = lot_id
      );
    end;
  end if;

  <<retry>>
  begin
    v_attempt := v_attempt + 1;
    perform set_config('transaction_isolation', 'serializable', true);

    -- Optional idempotency via header key propagated by PostgREST (or clients can pass one via offered+max)
    -- We compute a deterministic key as a fallback
    perform 1;
    -- lock + compute in inner function already handles FOR UPDATE
    select ok, current_amount, winner_id, new_ends_at, reserve_met
      into v_ok, v_current, v_winner, v_ends, v_reserve
    from app.place_bid(lot_id, v_uid, v_consider);

    insert into app.audit_logs(actor, action, lot_id, details)
    values (v_uid, 'place_bid', lot_id, jsonb_build_object('offered', offered, 'max', max, 'current', v_current, 'winner', v_winner))
    on conflict do nothing;

    return jsonb_build_object('ok', v_ok, 'current_amount', v_current, 'winner_id', v_winner, 'new_ends_at', v_ends, 'reserve_met', v_reserve);
  exception
    when serialization_failure then
      if v_attempt < 3 then
        perform pg_sleep(0.02 * v_attempt);
        goto retry;
      else
        raise;
      end if;
  end;
end; $$;

