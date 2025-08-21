-- Phase 1: Core data model additions and RLS
set search_path = app, public;

-- 1) Businesses (seller-owned)
create table if not exists app.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references app.profiles(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_businesses_owner on app.businesses(owner_id);

create or replace function app.is_business_owner(_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = app, public
as $$
  select exists (
    select 1 from app.businesses b
    where b.id = _business_id and b.owner_id = auth.uid()
  );
$$;

alter table app.businesses enable row level security;
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='businesses' and policyname='businesses_select_public') then
    create policy businesses_select_public on app.businesses for select using (true);
  end if;
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='businesses' and policyname='businesses_insert_owner') then
    create policy businesses_insert_owner on app.businesses for insert with check (owner_id = auth.uid());
  end if;
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='businesses' and policyname='businesses_update_owner') then
    create policy businesses_update_owner on app.businesses for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());
  end if;
end $$;

-- 2) Lots: add optional business_id to support marketplace (non-show)
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='app' and table_name='lots' and column_name='business_id'
  ) then
    alter table app.lots add column business_id uuid references app.businesses(id) on delete set null;
    create index if not exists idx_lots_business on app.lots(business_id);
  end if;
end $$;

-- Allow business owners to update their lots (in addition to show owners)
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='lots' and policyname='Lots: update by business owner or admin') then
    create policy "Lots: update by business owner or admin" on app.lots for update using (
      (business_id is not null and app.is_business_owner(business_id)) or app.is_admin()
    ) with check (
      (business_id is not null and app.is_business_owner(business_id)) or app.is_admin()
    );
  end if;
end $$;

-- 3) Lot images metadata table
create table if not exists app.lot_images (
  id uuid primary key default gen_random_uuid(),
  lot_id uuid not null references app.lots(id) on delete cascade,
  storage_path text not null,
  sort_index int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists idx_lot_images_lot on app.lot_images(lot_id, sort_index);

alter table app.lot_images enable row level security;
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='lot_images' and policyname='Lot images: public select') then
    create policy "Lot images: public select" on app.lot_images for select using (true);
  end if;
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='lot_images' and policyname='Lot images: owner insert') then
    create policy "Lot images: owner insert" on app.lot_images for insert with check (
      exists(
        select 1 from app.lots l
        where l.id = lot_id
          and (
            app.is_seller_of_show(l.show_id)
            or (l.business_id is not null and app.is_business_owner(l.business_id))
            or app.is_admin()
          )
      )
    );
  end if;
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='lot_images' and policyname='Lot images: owner update') then
    create policy "Lot images: owner update" on app.lot_images for update using (
      exists(
        select 1 from app.lots l
        where l.id = lot_images.lot_id
          and (
            app.is_seller_of_show(l.show_id)
            or (l.business_id is not null and app.is_business_owner(l.business_id))
            or app.is_admin()
          )
      )
    ) with check (
      exists(
        select 1 from app.lots l
        where l.id = lot_id
          and (
            app.is_seller_of_show(l.show_id)
            or (l.business_id is not null and app.is_business_owner(l.business_id))
            or app.is_admin()
          )
      )
    );
  end if;
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='lot_images' and policyname='Lot images: owner delete') then
    create policy "Lot images: owner delete" on app.lot_images for delete using (
      exists(
        select 1 from app.lots l
        where l.id = lot_images.lot_id
          and (
            app.is_seller_of_show(l.show_id)
            or (l.business_id is not null and app.is_business_owner(l.business_id))
            or app.is_admin()
          )
      )
    );
  end if;
end $$;

-- 4) Audit logs table + triggers
create table if not exists app.audit_logs (
  id bigint generated always as identity primary key,
  table_name text not null,
  row_id uuid,
  action text not null check (action in ('insert','update','delete')),
  actor_id uuid,
  changed jsonb,
  created_at timestamptz not null default now()
);
create index if not exists idx_audit_table_time on app.audit_logs(table_name, created_at desc);

alter table app.audit_logs enable row level security;
do $$ begin
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='audit_logs' and policyname='Audit: admin select') then
    create policy "Audit: admin select" on app.audit_logs for select using (app.is_admin());
  end if;
  if not exists(select 1 from pg_policies where schemaname='app' and tablename='audit_logs' and policyname='Audit: allow insert') then
    create policy "Audit: allow insert" on app.audit_logs for insert with check (true);
  end if;
end $$;

create or replace function app.log_audit()
returns trigger as $$
declare
  v_action text;
  v_row jsonb;
begin
  if tg_op = 'INSERT' then v_action := 'insert'; v_row := to_jsonb(new); end if;
  if tg_op = 'UPDATE' then v_action := 'update'; v_row := to_jsonb(new); end if;
  if tg_op = 'DELETE' then v_action := 'delete'; v_row := to_jsonb(old); end if;
  insert into app.audit_logs(table_name, row_id, action, actor_id, changed)
    values (tg_table_name::text, coalesce(new.id, old.id), v_action, auth.uid(), v_row);
  return coalesce(new, old);
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 't_audit_lots') then
    create trigger t_audit_lots after insert or update or delete on app.lots
      for each row execute procedure app.log_audit();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 't_audit_orders') then
    create trigger t_audit_orders after insert or update or delete on app.orders
      for each row execute procedure app.log_audit();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 't_audit_payouts') then
    create trigger t_audit_payouts after insert or update or delete on app.payouts
      for each row execute procedure app.log_audit();
  end if;
  if not exists (select 1 from pg_trigger where tgname = 't_audit_sellers') then
    create trigger t_audit_sellers after insert or update or delete on app.sellers
      for each row execute procedure app.log_audit();
  end if;
end $$;

-- 5) Constraints: non-negative amounts; ends_at validation
do $$ begin
  begin
    alter table app.lots add constraint lots_nonneg_prices check (start_price >= 0 and bid_increment > 0);
  exception when duplicate_object then null; end;
  begin
    alter table app.bids add constraint bids_amount_positive check (amount > 0);
  exception when duplicate_object then null; end;
  begin
    alter table app.orders add constraint orders_nonneg check (subtotal >= 0 and shipping_cents >= 0);
  exception when duplicate_object then null; end;
  begin
    alter table app.payouts add constraint payouts_nonneg check (amount >= 0);
  exception when duplicate_object then null; end;
end $$;

create or replace function app.validate_lot_on_change()
returns trigger as $$
begin
  if new.status = 'running' then
    if new.ends_at is null or new.ends_at <= now() then
      raise exception 'ends_at must be in the future when publishing a lot';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 't_validate_lot') then
    create trigger t_validate_lot before insert or update on app.lots
      for each row execute procedure app.validate_lot_on_change();
  end if;
end $$;

-- 6) Compatibility views (optional): map invoices/messages names
create or replace view app.invoices as
  select * from app.orders;
create or replace view app.messages as
  select id, show_id, sender_id as user_id, content as body, created_at from app.chat_messages;

-- 7) Seeds: ensure one buyer and five lots with images
do $$
begin
  -- Buyer profile
  if not exists(select 1 from app.profiles where id = '00000000-0000-0000-0000-000000000003') then
    insert into app.profiles(id, handle, display_name, role) values
      ('00000000-0000-0000-0000-000000000003', 'buyerjoe', 'Buyer Joe', 'buyer');
  end if;

  -- Create businesses for existing sellers
  if not exists(select 1 from app.businesses where owner_id = '00000000-0000-0000-0000-000000000001') then
    insert into app.businesses(owner_id, name) values ('00000000-0000-0000-0000-000000000001', 'BrickVault LLC');
  end if;
  if not exists(select 1 from app.businesses where owner_id = '00000000-0000-0000-0000-000000000002') then
    insert into app.businesses(owner_id, name) values ('00000000-0000-0000-0000-000000000002', 'RetroHero LLC');
  end if;

  -- Create 5 lots tied to businesses with future ends_at
  perform 1 from app.lots where title like 'Seeded Biz Lot%';
  if not found then
    insert into app.lots(id, show_id, business_id, category, title, description, start_price, bid_increment, status, ends_at)
    select gen_random_uuid(),
           null::uuid,
           (select id from app.businesses where owner_id = '00000000-0000-0000-0000-000000000001' limit 1),
           'LEGO'::app.category,
           concat('Seeded Biz Lot #', g.i),
           'Demo business lot',
           25 + g.i,
           1,
           'queued'::app.lot_status,
           now() + interval '2 days'
    from generate_series(1,5) as g(i);
  end if;

  -- Attach 2 placeholder images per lot (metadata only)
  insert into app.lot_images(lot_id, storage_path, sort_index)
  select l.id, concat('00000000-0000-0000-0000-000000000001/seed_', n::text, '.jpg'), n-1
  from app.lots l cross join generate_series(1,2) n
  where l.title like 'Seeded Biz Lot%' and not exists (
    select 1 from app.lot_images li where li.lot_id = l.id
  );
end
$$;

