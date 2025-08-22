import { supabase } from "./supabase";
import { generateMockAuctions } from "./mockRegionData";

export type Auction = {
  id: string;
  title: string;
  hero_image_url?: string | null;
  current_bid?: number | null;
  lots_count?: number | null;
  ends_at?: string | null;
  region_slug?: string | null;
  category?: string;
  condition?: string;
  seller_name?: string;
  seller_rating?: number;
  view_count?: number;
};

export async function fetchRegionAuctions(slug: string): Promise<Auction[]> {
  if (supabase) {
    try {
      // Try "auctions" first
      const { data, error } = await supabase
        .from("auctions")
        .select("id,title,hero_image_url,current_bid,lots_count,ends_at,region_slug")
        .eq("region_slug", slug)
        .order("ends_at", { ascending: true })
        .limit(48);
      
      if (!error && data && data.length > 0) {
        return data as Auction[];
      }

      // Fallback: try "lots"
      const alt = await supabase
        .from("lots")
        .select("id,title,hero_image_url,current_bid,lots_count,ends_at,region_slug")
        .eq("region_slug", slug)
        .order("ends_at", { ascending: true })
        .limit(48);
      
      if (!alt.error && alt.data && alt.data.length > 0) {
        return alt.data as Auction[];
      }
    } catch (error) {
      console.log("Error fetching auctions, using mock data:", error);
    }
  }
  
  // Return mock data if no real data exists or if there's an error
  console.log(`Using mock data for region: ${slug}`);
  return generateMockAuctions(slug, 18) as Auction[];
}