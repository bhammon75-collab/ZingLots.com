set search_path = app, public;

create or replace function app.is_lot_seller_verified(p_lot uuid)
returns boolean as $$
declare
  v_show uuid;
  v_business uuid;
  v_seller uuid;
  v_owner uuid;
  v_ok boolean := false;
begin
  select show_id, business_id into v_show, v_business from app.lots where id = p_lot;
  if v_show is not null then
    select seller_id into v_seller from app.shows where id = v_show;
    if v_seller is not null then
      select exists(select 1 from app.sellers where id = v_seller and kyc_status = 'verified') into v_ok;
    end if;
  elsif v_business is not null then
    select owner_id into v_owner from app.businesses where id = v_business;
    if v_owner is not null then
      select exists(select 1 from app.sellers where id = v_owner and kyc_status = 'verified') into v_ok;
    end if;
  end if;
  return coalesce(v_ok, false);
end;
$$ language plpgsql stable security definer set search_path = app, public;

