import { supabase } from "./supabase";

export type Auction = {
  id: string;
  title: string;
  hero_image_url?: string | null;
  current_bid?: number | null;
  lots_count?: number | null;
  ends_at?: string | null;
  region_slug?: string | null;
};

export async function fetchRegionAuctions(slug: string): Promise<Auction[]> {
  if (supabase) {
    // Try "auctions" first
    const { data, error } = await supabase
      .from("auctions")
      .select("id,title,hero_image_url,current_bid,lots_count,ends_at,region_slug")
      .eq("region_slug", slug)
      .order("ends_at", { ascending: true })
      .limit(48);
    if (!error && data) return data as Auction[];

    // Fallback: try "lots"
    const alt = await supabase
      .from("lots")
      .select("id,title,hero_image_url,current_bid,lots_count,ends_at,region_slug")
      .eq("region_slug", slug)
      .order("ends_at", { ascending: true })
      .limit(48);
    if (!alt.error && alt.data) return alt.data as Auction[];
  }
  return []; // graceful fallback
}