import type { LotItem } from "@/components/LotCard";

import { CATEGORIES } from "@/data/categories";

export const DEMO_SELLERS = [
  { id: "s1", name: "BuildPro Materials" },
  { id: "s2", name: "City Surplus" },
  { id: "s3", name: "KitchenPro Liquidators" },
];

export const DEMO_SHOWS = [
  { id: "show1", title: "Weekly Contractor Deals", when: "Fri 10AM", lots: 24 },
  { id: "show2", title: "Restaurant Closeout", when: "Tue 2PM", lots: 18 },
];

const TITLES: Record<string,string[]> = {
  "Construction Materials": [
    "Pallet of Premium 2x4x8 Cedar Lumber (150 pcs)",
    "Steel Studs & Track – Mixed Sizes (Bundle)",
    "Roofing Shingles – 28 Bundles (Architectural)"
  ],
  "Restaurant Equipment": [
    "Commercial 6‑Burner Range w/ Oven – Natural Gas",
    "True T‑49 Reach‑In Refrigerator – 49 cu ft",
    "Stainless Prep Tables – Set of 3 (NSF)"
  ],
  "Office Furniture": [
    "Herman Miller Aeron Chairs – Lot of 10",
    "Electric Sit‑Stand Desks – Lot of 6",
    "Conference Table – 10ft w/ Power"
  ],
  "Industrial Equipment": [
    "Tennant T5 Industrial Floor Scrubber",
    "Pallet Racking Uprights & Beams – 42pcs",
    "5HP Air Compressor – 80 Gallon"
  ],
  "Municipal Surplus": [
    "Traffic Cones – Lot of 120",
    "Park Maintenance Tools – Mixed Lot",
    "Emergency Light Bars – Lot of 6"
  ],
  "Vehicles & Fleet": [
    "2016 Ford F‑150 XL – 4x2 Regular Cab",
    "2018 Chevy Express 2500 Cargo Van",
    "2017 Ram 1500 Tradesman – 4x4"
  ],
};

export const DEMO_LOTS: LotItem[] = Array.from({ length: 24 }).map((_, i) => {
  const cats = CATEGORIES.map((c) => c.name);
  const category = cats[i % cats.length];
  const titles = TITLES[category] || [
    `${category} – Mixed Lot`,
  ];
  const title = titles[i % titles.length];
  const priceBase = 900 + (i % 6) * 175;
  return {
    id: `lot-${i + 1}`,
    title,
    category,
    currentBid: (priceBase + i * 23) * 100,
    buyNow: i % 5 === 0 ? (priceBase * 8 + i * 50) * 100 : undefined,
    endsIn: `${45 - (i % 45)}m`,
  };
});
