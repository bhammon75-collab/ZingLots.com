export type Category = {
  name: string;
  slug: string;
  children?: { name: string; slug: string }[];
};

// B2B marketplace categories
export const CATEGORIES: Category[] = [
  { name: "Construction & Trades", slug: "construction-trades" },
  { name: "Restaurant & Food Service", slug: "restaurant-food-service" },
  { name: "Office & Admin", slug: "office-admin" },
  { name: "IT & Networking", slug: "it-networking" },
  { name: "Warehousing & Material Handling", slug: "warehousing-material-handling" },
  { name: "Packaging & Fulfillment", slug: "packaging-fulfillment" },
  { name: "Printing, Signage & Promo", slug: "printing-signage-promo" },
  { name: "Event, AV & Creative", slug: "event-av-creative" },
  { name: "Manufacturing & Industrial (no hazmat)", slug: "manufacturing-industrial" },
  { name: "Metalworking & Fabrication", slug: "metalworking-fabrication" },
  { name: "Woodworking", slug: "woodworking" },
  { name: "Auto Service (no refrigerant kits)", slug: "auto-service" },
  { name: "Landscaping & Grounds", slug: "landscaping-grounds" },
  { name: "Cleaning & Janitorial", slug: "cleaning-janitorial" },
  { name: "Security & Cash Handling", slug: "security-cash-handling" },
  { name: "Hospitality & Lodging (FF&E)", slug: "hospitality-lodging-ffe" },
  { name: "Retail & POS", slug: "retail-pos" },
  { name: "Vending & Kiosks", slug: "vending-kiosks" },
];

// Featured subset for nav/filter surfaces
export const FEATURED_CATEGORIES: Category[] = [
  { name: "Construction & Trades", slug: "construction-trades" },
  { name: "Restaurant & Food Service", slug: "restaurant-food-service" },
  { name: "Office & Admin", slug: "office-admin" },
  { name: "Warehousing & Material Handling", slug: "warehousing-material-handling" },
];

// Friendly/legacy aliases to canonical slugs used across older links and UIs
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  // Legacy -> New canonical mappings
  construction: "construction-trades",
  "construction-materials": "construction-trades",
  restaurant: "restaurant-food-service",
  "restaurant-equipment": "restaurant-food-service",
  office: "office-admin",
  "office-furniture": "office-admin",
  industrial: "manufacturing-industrial",
  "industrial-equipment": "manufacturing-industrial",
  vehicles: "auto-service",
  vehicle: "auto-service",
  fleet: "auto-service",
  municipal: "warehousing-material-handling", // Redirect legacy to closest broad category
  "municipal-surplus": "warehousing-material-handling",
  // Additional legacy -> new
  furniture: "office-admin",
  apparel: "printing-signage-promo",
  blacksmith: "metalworking-fabrication",
  smithing: "metalworking-fabrication",
  blacksmithing: "metalworking-fabrication",
  jewelry: "metalworking-fabrication",
  "jewelry-making": "metalworking-fabrication",
};

export function canonicalizeCategorySlug(slugOrAlias: string | undefined | null): string | null {
  if (!slugOrAlias) return null;
  const lowered = String(slugOrAlias).toLowerCase();
  // Already canonical?
  if (CATEGORIES.some((c) => c.slug === lowered)) return lowered;
  // Map known alias -> canonical
  if (CATEGORY_SLUG_ALIASES[lowered]) return CATEGORY_SLUG_ALIASES[lowered];
  // Attempt naive normalization (spaces -> dash) and match
  const dashed = lowered.replace(/\s+/g, "-");
  if (CATEGORIES.some((c) => c.slug === dashed)) return dashed;
  return null;
}

export function getSlugForCategoryName(name: string | undefined | null): string | null {
  if (!name) return null;
  const category = CATEGORIES.find((c) => c.name === name);
  return category ? category.slug : null;
}

export function getCategoryBySlugOrAlias(slugOrAlias: string | undefined | null): Category | null {
  const canonical = canonicalizeCategorySlug(slugOrAlias);
  if (!canonical) return null;
  return CATEGORIES.find((c) => c.slug === canonical) || null;
}
