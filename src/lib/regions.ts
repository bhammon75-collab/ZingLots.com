export type StateInfo = {
  code: string;
  name: string;
  markets?: number;
  auctions?: number;
};

const STATES: StateInfo[] = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

export function getStates(): StateInfo[] {
  // Return a deduped, alphabetized list. In the future, merge with real metrics.
  const seen = new Set<string>();
  const list: StateInfo[] = [];
  for (const s of STATES) {
    if (!seen.has(s.code)) {
      seen.add(s.code);
      list.push(s);
    }
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function groupByLetter(states: StateInfo[]): Record<string, StateInfo[]> {
  return states.reduce((acc, s) => {
    const letter = s.name[0]?.toUpperCase() || "#";
    (acc[letter] ||= []).push(s);
    return acc;
  }, {} as Record<string, StateInfo[]>);
}

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