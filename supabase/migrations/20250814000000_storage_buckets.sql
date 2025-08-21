-- Create additional storage buckets for marketplace assets
-- lot-images: public read, owner-managed write/update
-- lot-docs: private docs related to lots (e.g., manifests), owner read/write via folder prefix

insert into storage.buckets (id, name, public) values ('lot-images','lot-images', true)
  on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('lot-docs','lot-docs', false)
  on conflict (id) do nothing;

-- Public read for lot images
create policy if not exists "Lot images public read" on storage.objects
for select using (bucket_id = 'lot-images');

-- Sellers can upload/update images inside their own folder (<uid>/...)
create policy if not exists "Lot images owner upload" on storage.objects
for insert with check (
  bucket_id = 'lot-images' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy if not exists "Lot images owner update" on storage.objects
for update using (
  bucket_id = 'lot-images' and auth.uid()::text = (storage.foldername(name))[1]
);

-- Lot docs are private to owner by folder prefix
create policy if not exists "Lot docs owner read" on storage.objects
for select using (
  bucket_id = 'lot-docs' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy if not exists "Lot docs owner write" on storage.objects
for insert with check (
  bucket_id = 'lot-docs' and auth.uid()::text = (storage.foldername(name))[1]
);
create policy if not exists "Lot docs owner update" on storage.objects
for update using (
  bucket_id = 'lot-docs' and auth.uid()::text = (storage.foldername(name))[1]
);
