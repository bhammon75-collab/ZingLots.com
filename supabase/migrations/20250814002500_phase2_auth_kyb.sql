-- Phase 2: Auth bootstrap + KYB flow
set search_path = app, public;

-- 1) Ensure app.profiles row on new auth user (role='buyer')
create or replace function app.handle_new_user_app()
returns trigger as $$
begin
  insert into app.profiles(id, handle, display_name, role)
  values (
    new.id,
    split_part(new.email, '@', 1),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'buyer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = app, public;

do $$ begin
  if exists(select 1 from pg_trigger where tgname = 'on_auth_user_created_app') then
    drop trigger on_auth_user_created_app on auth.users;
  end if;
  create trigger on_auth_user_created_app
    after insert on auth.users
    for each row execute procedure app.handle_new_user_app();
end $$;

-- 2) Seller applications: add doc_paths for uploads
do $$ begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema='app' and table_name='seller_applications' and column_name='doc_paths'
  ) then
    alter table app.seller_applications add column doc_paths jsonb not null default '[]'::jsonb;
  end if;
end $$;

-- 3) Admin can review all applications
do $$ begin
  if not exists (
    select 1 from pg_policies where schemaname='app' and tablename='seller_applications' and policyname='seller_apps_admin_read'
  ) then
    create policy seller_apps_admin_read on app.seller_applications for select using (app.is_admin());
  end if;
  if not exists (
    select 1 from pg_policies where schemaname='app' and tablename='seller_applications' and policyname='seller_apps_admin_update'
  ) then
    create policy seller_apps_admin_update on app.seller_applications for update using (app.is_admin()) with check (app.is_admin());
  end if;
end $$;

-- 4) Upon application submission, ensure a sellers row exists (pending)
create or replace function app.on_seller_application()
returns trigger as $$
begin
  if new.user_id is not null then
    insert into app.sellers(id, kyc_status)
    values (new.user_id, 'pending')
    on conflict (id) do nothing;
  end if;
  return new;
end;
$$ language plpgsql;

do $$ begin
  if not exists (select 1 from pg_trigger where tgname = 't_on_seller_application') then
    create trigger t_on_seller_application
      after insert on app.seller_applications
      for each row execute procedure app.on_seller_application();
  end if;
end $$;

-- 5) Helper: admin approve/reject seller KYB
create or replace function app.set_seller_kyc(p_user uuid, p_status app.kyc_status)
returns void as $$
begin
  if not app.is_admin() then
    raise exception 'Only admin can set KYC'
      using errcode = '42501';
  end if;
  update app.sellers set kyc_status = p_status where id = p_user;
  if not found then
    insert into app.sellers(id, kyc_status) values(p_user, p_status);
  end if;
  if p_status = 'verified' then
    update app.profiles set role = 'seller' where id = p_user;
  end if;
end;
$$ language plpgsql security definer set search_path = app, public;

