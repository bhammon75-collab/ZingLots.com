export const REGION_LABELS: Record<string, string> = {
  "seattle": "Seattle, WA",
  "tacoma": "Tacoma, WA",
  "portland": "Portland, OR",
  "los-angeles": "Los Angeles, CA",
  "san-francisco": "San Francisco, CA",
  "chicago": "Chicago, IL",
  "detroit": "Detroit, MI",
  "new-york": "New York, NY",
  "boston": "Boston, MA",
  "philadelphia": "Philadelphia, PA",
  "houston": "Houston, TX",
  "dallas": "Dallas, TX",
  "atlanta": "Atlanta, GA",
  "miami": "Miami, FL",
  "phoenix": "Phoenix, AZ",
};

export function titleize(slug: string) { 
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()); 
}

export function labelForRegion(slug: string) { 
  return REGION_LABELS[slug] ?? titleize(slug); 
}