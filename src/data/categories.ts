export type Category = {
  name: string;
  slug: string;
  children?: { name: string; slug: string }[];
};

// B2B marketplace categories
export const CATEGORIES: Category[] = [
  { name: "Construction Materials", slug: "construction-materials" },
  { name: "Restaurant Equipment", slug: "restaurant-equipment" },
  { name: "Office Furniture", slug: "office-furniture" },
  { name: "Industrial Equipment", slug: "industrial-equipment" },
  { name: "Municipal Surplus", slug: "municipal-surplus" },
  { name: "Vehicles & Fleet", slug: "vehicles-fleet" },
];

// Featured subset for nav/filter surfaces
export const FEATURED_CATEGORIES: Category[] = [
  { name: "Construction Materials", slug: "construction-materials" },
  { name: "Restaurant Equipment", slug: "restaurant-equipment" },
  { name: "Office Furniture", slug: "office-furniture" },
  { name: "Industrial Equipment", slug: "industrial-equipment" },
];

// Friendly/legacy aliases to canonical slugs used across older links and UIs
export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  construction: "construction-materials",
  restaurant: "restaurant-equipment",
  office: "office-furniture",
  municipal: "municipal-surplus",
  industrial: "industrial-equipment",
  vehicles: "vehicles-fleet",
  vehicle: "vehicles-fleet",
  fleet: "vehicles-fleet",
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
