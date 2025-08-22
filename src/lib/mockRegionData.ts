// Mock auction data for regional pages
export type MockAuction = {
  id: string;
  title: string;
  hero_image_url: string;
  current_bid: number;
  lots_count: number;
  ends_at: string;
  category: string;
  condition: string;
  seller_name: string;
  seller_rating: number;
  view_count: number;
};

const categories = [
  "Construction Equipment",
  "Restaurant Equipment", 
  "Office Furniture",
  "Industrial Machinery",
  "Medical Equipment",
  "Electronics",
  "Warehouse Equipment",
  "Retail Fixtures"
];

const conditions = ["New", "Like New", "Good", "Fair"];

// Generate realistic auction titles based on category
const titleTemplates: Record<string, string[]> = {
  "Construction Equipment": [
    "CAT 320D Excavator - Low Hours",
    "John Deere 544K Wheel Loader",
    "Bobcat S650 Skid Steer with Attachments",
    "Miller Welding Equipment Lot",
    "DeWalt Tool Package - 50+ Items",
    "Scaffolding System - Complete Set",
    "Concrete Mixer & Power Tools Bundle",
    "Generator Set - 100kW Diesel"
  ],
  "Restaurant Equipment": [
    "Complete Kitchen Equipment Package",
    "Hobart Commercial Mixer - 60Qt",
    "True Refrigeration Walk-In Cooler",
    "Vulcan 6-Burner Range with Oven",
    "Commercial Ice Machine - 500lb/day",
    "Stainless Steel Prep Tables (Set of 5)",
    "Complete Bar Equipment Package",
    "Pizza Oven & Prep Station Bundle"
  ],
  "Office Furniture": [
    "Herman Miller Aeron Chairs (Lot of 25)",
    "Executive Desk Collection - Mahogany",
    "Conference Room Table & 12 Chairs",
    "Steelcase Cubicle System - 20 Stations",
    "Filing Cabinet Collection (30 Units)",
    "Reception Area Furniture Set",
    "Standing Desks - Adjustable (10 Units)",
    "Office Lounge Furniture Package"
  ],
  "Industrial Machinery": [
    "CNC Milling Machine - Haas VF-2",
    "Forklift - Toyota 8000lb Capacity",
    "Industrial Lathe - 16\" x 40\"",
    "Air Compressor System - 100HP",
    "Welding Robots (Set of 2)",
    "Hydraulic Press - 150 Ton",
    "Industrial Shelving - Heavy Duty",
    "Material Handling Equipment Lot"
  ],
  "Medical Equipment": [
    "GE Ultrasound Machine - Logiq E9",
    "Hospital Beds (Lot of 10)",
    "Dental Chair & Equipment Package",
    "X-Ray Machine - Digital",
    "Medical Office Furniture Set",
    "Exam Tables & Equipment (5 Rooms)",
    "Laboratory Equipment Bundle",
    "Physical Therapy Equipment Package"
  ],
  "Electronics": [
    "Server Rack Equipment - Complete",
    "MacBook Pro Lot (15 Units)",
    "Network Equipment - Cisco Bundle",
    "POS System - Complete Restaurant Setup",
    "Security Camera System - 32 Cameras",
    "Audio/Visual Equipment Package",
    "Desktop Computers (Lot of 30)",
    "Smart TV Collection - Various Sizes"
  ],
  "Warehouse Equipment": [
    "Pallet Racking System - 10,000 sq ft",
    "Electric Pallet Jacks (Set of 5)",
    "Conveyor System - 200ft",
    "Loading Dock Equipment Package",
    "Industrial Fans - Large (8 Units)",
    "Warehouse Lighting - LED Upgrade",
    "Safety Equipment Bundle",
    "Shipping & Packaging Station Setup"
  ],
  "Retail Fixtures": [
    "Retail Display Cases - Glass (20 Units)",
    "Checkout Counter System - Complete",
    "Clothing Racks & Mannequins Bundle",
    "Gondola Shelving - 50 Sections",
    "Jewelry Display Cases - Locking",
    "Store Lighting Package - Track & Spot",
    "Cash Register Systems (5 Stations)",
    "Retail Signage & Display Package"
  ]
};

// Professional stock images for each category
const imageUrls: Record<string, string[]> = {
  "Construction Equipment": [
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=800&h=600&fit=crop"
  ],
  "Restaurant Equipment": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1564758564527-b97d79cb27c1?w=800&h=600&fit=crop"
  ],
  "Office Furniture": [
    "https://images.unsplash.com/photo-1555212697-194d092e3b8f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1497366754035-f200581a8d4d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=800&h=600&fit=crop"
  ],
  "Industrial Machinery": [
    "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1609205807490-b18b25342edc?w=800&h=600&fit=crop"
  ],
  "Medical Equipment": [
    "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1583912086296-be5b69f7e061?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop"
  ],
  "Electronics": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=600&fit=crop"
  ],
  "Warehouse Equipment": [
    "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1565891741441-64926e441838?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1553692754-e4fd2c1d0e79?w=800&h=600&fit=crop"
  ],
  "Retail Fixtures": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567449303078-57ad995bd17f?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop"
  ]
};

// Regional business names
const sellerNames: Record<string, string[]> = {
  "seattle": ["Pacific Surplus Co.", "Emerald City Liquidators", "Sound Equipment Sales", "Northwest Industrial", "Cascade Auctions"],
  "tacoma": ["Tacoma Surplus Warehouse", "South Sound Equipment", "Port City Liquidators", "Pierce County Auctions", "Commencement Bay Sales"],
  "portland": ["Rose City Surplus", "PDX Equipment Co.", "Bridge City Auctions", "Oregon Industrial Sales", "Willamette Valley Liquidators"],
  "los-angeles": ["LA Surplus Direct", "SoCal Equipment Sales", "Hollywood Liquidators", "Angeles Industrial", "Pacific Coast Auctions"],
  "san-francisco": ["Bay Area Surplus", "Golden Gate Equipment", "SF Industrial Sales", "Silicon Valley Liquidators", "NorCal Auctions"],
  "chicago": ["Windy City Surplus", "Chicago Equipment Co.", "Midwest Industrial", "Lake Shore Liquidators", "Illinois Auction House"],
  "detroit": ["Motor City Surplus", "Detroit Equipment Sales", "Great Lakes Industrial", "Michigan Liquidators", "Auto City Auctions"],
  "new-york": ["Empire State Surplus", "NYC Equipment Direct", "Manhattan Industrial", "Brooklyn Liquidators", "Big Apple Auctions"],
  "boston": ["Bay State Surplus", "Boston Equipment Co.", "New England Industrial", "Commonwealth Liquidators", "Harbor City Auctions"],
  "philadelphia": ["Philly Surplus Direct", "Liberty Equipment Sales", "Delaware Valley Industrial", "Keystone Liquidators", "Independence Auctions"],
  "houston": ["Houston Surplus Co.", "Gulf Coast Equipment", "Texas Industrial Sales", "Bayou City Liquidators", "Space City Auctions"],
  "dallas": ["Dallas Equipment Direct", "DFW Surplus Sales", "Metroplex Industrial", "Lone Star Liquidators", "Big D Auctions"],
  "atlanta": ["Atlanta Surplus Warehouse", "Peach State Equipment", "Southern Industrial Sales", "Georgia Liquidators", "ATL Auction House"],
  "miami": ["Miami Equipment Direct", "South Beach Surplus", "Sunshine State Industrial", "Florida Keys Liquidators", "Magic City Auctions"],
  "phoenix": ["Phoenix Surplus Co.", "Valley Equipment Sales", "Desert Industrial", "Arizona Liquidators", "Sonoran Auctions"]
};

function generateFutureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateAuctionId(): string {
  const prefix = ["A", "B", "L", "S"][Math.floor(Math.random() * 4)];
  const year = new Date().getFullYear();
  const number = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${year}-${number}`;
}

export function generateMockAuctions(region: string, count: number = 12): MockAuction[] {
  const auctions: MockAuction[] = [];
  const regionSellers = sellerNames[region] || sellerNames["seattle"];
  
  for (let i = 0; i < count; i++) {
    const category = getRandomElement(categories);
    const titles = titleTemplates[category];
    const images = imageUrls[category];
    const condition = getRandomElement(conditions);
    const daysLeft = Math.floor(Math.random() * 14) + 1;
    const basePrice = Math.floor(Math.random() * 50000) + 500;
    const currentBid = Math.floor(basePrice * (0.3 + Math.random() * 0.5));
    
    auctions.push({
      id: generateAuctionId(),
      title: getRandomElement(titles),
      hero_image_url: getRandomElement(images),
      current_bid: currentBid,
      lots_count: Math.floor(Math.random() * 50) + 1,
      ends_at: generateFutureDate(daysLeft),
      category,
      condition,
      seller_name: getRandomElement(regionSellers),
      seller_rating: 4 + Math.random(),
      view_count: Math.floor(Math.random() * 500) + 50
    });
  }
  
  // Sort by ending soonest first
  return auctions.sort((a, b) => 
    new Date(a.ends_at).getTime() - new Date(b.ends_at).getTime()
  );
}

// Get featured auctions for a region
export function getFeaturedAuctions(region: string): MockAuction[] {
  return generateMockAuctions(region, 3).map(auction => ({
    ...auction,
    current_bid: auction.current_bid * 2, // Featured items have higher bids
    view_count: auction.view_count * 3
  }));
}