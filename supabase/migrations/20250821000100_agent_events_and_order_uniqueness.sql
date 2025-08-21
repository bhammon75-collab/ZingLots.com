-- Agent events table and uniqueness guard for orders per lot
do $$ begin
  create table if not exists app.agent_events (
    id uuid primary key default gen_random_uuid(),
    type text not null,
    payload jsonb,
    status text not null default 'pending',
    error text,
    created_at timestamptz not null default now()
  );
exception when duplicate_table then null end $$;

-- Relax RLS for system writes (edge functions use service role)
alter table app.agent_events enable row level security;
do $$ begin
  create policy if not exists agent_events_public_read on app.agent_events for select using (true);
exception when duplicate_object then null end $$;

-- Ensure at most one order per lot
do $$ begin
  alter table app.orders add constraint uq_orders_lot unique (lot_id);
exception when duplicate_object then null end $$;

