// Curated stock images for categories commonly used on the site
// Images are sized for card usage (4:3) and hero usage when needed.

const STOCK: Record<string, string[]> = {
  construction: [
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1521207418485-99c705420785?w=1200&h=900&fit=crop",
  ],
  restaurant: [
    "https://images.unsplash.com/photo-1574739782594-db4ead022697?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1580622149255-b1b76963c2ab?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=1200&h=900&fit=crop",
  ],
  office: [
    "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1529078155058-5d716f45d604?w=1200&h=900&fit=crop",
  ],
  vehicles: [
    "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&h=900&fit=crop",
  ],
  warehouse: [
    "https://images.unsplash.com/photo-1586521995568-39c0bcb2b7b2?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1586524501164-1f11a32556e6?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1515162305280-d9c3ff2a46d0?w=1200&h=900&fit=crop",
  ],
  municipal: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1557800636-894a64c1696f?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1541976076758-347942db1970?w=1200&h=900&fit=crop",
  ],
  electronics: [
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?w=1200&h=900&fit=crop",
  ],
  default: [
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=900&fit=crop",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=900&fit=crop",
  ],
};

function normalizeCategory(input?: string): keyof typeof STOCK {
  if (!input) return "default";
  const s = input.toLowerCase();
  if (s.includes("restaurant") || s.includes("kitchen") || s.includes("food")) return "restaurant";
  if (s.includes("office") || s.includes("furniture") || s.includes("desk")) return "office";
  if (s.includes("vehicle") || s.includes("truck") || s.includes("van")) return "vehicles";
  if (s.includes("municipal") || s.includes("public") || s.includes("tools")) return "municipal";
  if (s.includes("warehouse") || s.includes("racking") || s.includes("material")) return "warehouse";
  if (s.includes("electronic") || s.includes("computer") || s.includes("tech")) return "electronics";
  if (s.includes("construction") || s.includes("lumber") || s.includes("equipment") || s.includes("tool")) return "construction";
  return "default";
}

function hash(seed: string | number): number {
  const str = String(seed);
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function getStockImage(categoryOrTitle?: string, seed?: string | number): string {
  const key = normalizeCategory(categoryOrTitle);
  const pool = STOCK[key] ?? STOCK.default;
  if (seed == null) return pool[Math.floor(Math.random() * pool.length)];
  const idx = hash(seed) % pool.length;
  return pool[idx];
}

export function getHeroStockImage(seed?: string | number): string {
  const pool = [
    ...STOCK.construction,
    ...STOCK.warehouse,
    ...STOCK.restaurant,
    ...STOCK.office,
  ];
  if (seed == null) return pool[Math.floor(Math.random() * pool.length)];
  const idx = hash(seed) % pool.length;
  return pool[idx];
}

export default getStockImage;