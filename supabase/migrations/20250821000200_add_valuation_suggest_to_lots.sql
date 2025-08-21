-- Add valuation_suggest JSONB to lots for agent recommendations
do $$ begin
  alter table app.lots add column if not exists valuation_suggest jsonb;
exception when duplicate_column then null end $$;

