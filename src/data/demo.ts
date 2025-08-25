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

// B2B-appropriate image URLs for each category
const CATEGORY_IMAGES: Record<string, string[]> = {
  "Construction Materials": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", // Lumber stacks
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop", // Construction site
    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop"  // Building materials
  ],
  "Restaurant Equipment": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop", // Commercial kitchen
    "https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&h=600&fit=crop", // Restaurant equipment
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=800&h=600&fit=crop"  // Professional kitchen
  ],
  "Office Furniture": [
    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&h=600&fit=crop", // Office chairs
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop", // Modern office
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=600&fit=crop"  // Conference room
  ],
  "Industrial Equipment": [
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop", // Industrial machinery
    "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop", // Warehouse equipment
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop"  // Industrial tools
  ],
  "Municipal Surplus": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop", // Municipal equipment
    "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=600&fit=crop", // Safety equipment
    "https://images.unsplash.com/photo-1609207807107-e8ec2120f9de?w=800&h=600&fit=crop"  // Public works
  ],
  "Vehicles & Fleet": [
    "https://images.unsplash.com/photo-1583267746897-2cf415887172?w=800&h=600&fit=crop", // Commercial truck
    "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop", // Fleet vehicles
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop"  // Work vehicles
  ],
};

export const DEMO_LOTS: LotItem[] = Array.from({ length: 24 }).map((_, i) => {
  const cats = CATEGORIES.map((c) => c.name);
  const category = cats[i % cats.length];
  const titles = TITLES[category] || [
    `${category} – Mixed Lot`,
  ];
  const title = titles[i % titles.length];
  const images = CATEGORY_IMAGES[category] || [];
  const image_url = images.length > 0 ? images[i % images.length] : undefined;
  const priceBase = 900 + (i % 6) * 175;
  return {
    id: `lot-${i + 1}`,
    title,
    category,
    image_url,
    currentBid: (priceBase + i * 23) * 100,
    buyNow: i % 5 === 0 ? (priceBase * 8 + i * 50) * 100 : undefined,
    endsIn: `${45 - (i % 45)}m`,
    reserve_met: i % 3 !== 0,
    watchers: Math.floor(Math.random() * 25) + 5,
    verified_seller: i % 4 === 0,
  };
});
