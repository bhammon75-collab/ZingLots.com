-- ZingLots B2B Surplus Marketplace: Extensions & Enums
-- PostGIS for hyperlocal distance calculations
create extension if not exists postgis;
create extension if not exists pgcrypto;

-- Core enums for B2B marketplace
create type public.region_type as enum ('city','state','metro');
create type public.vertical_type as enum ('contractor','restaurant','municipal','mro','office','other');
create type public.uom_type as enum ('pallet','truckload','sqft','linearft','piece','set','each');
create type public.escrow_status as enum ('awaiting_payment','paid','picked_up','refunded','canceled');
create type public.verification_tier as enum ('T0','T1','T2','T3'); -- T0=browse, T1=bid≤$500, T2=sell+higher, T3=verified biz
create type public.lot_status as enum ('draft','published','active','ended','sold','unsold','canceled');
create type public.pickup_status as enum ('pending','scheduled','confirmed','completed','failed');
create type public.inspection_status as enum ('requested','proposed','confirmed','completed','canceled');
