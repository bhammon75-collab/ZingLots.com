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
