// Enhanced TypeScript definitions for ZingLots B2B Marketplace
// Matches the new database schema from migration files

export interface Region {
  id: string;
  name: string;
  slug: string;
  description?: string;
  state_code: string;
  timezone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  name: string;
  region_id: string;
  latitude: number;
  longitude: number;
  city: string;
  state_code: string;
  zip_code?: string;
  radius_miles: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  region?: Region;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  tax_id?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website?: string;
  description?: string;
  verification_tier: 'T0' | 'T1' | 'T2' | 'T3';
  verification_documents?: Record<string, any>;
  stripe_connect_account_id?: string;
  stripe_onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lot {
  id: string;
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor' | 'salvage';
  starting_bid: number;
  reserve_price?: number;
  current_bid?: number;
  bid_count: number;
  seller_id: string;
  location_id: string;
  pickup_address: string;
  pickup_instructions?: string;
  pickup_window_start?: string;
  pickup_window_end?: string;
  auction_start: string;
  auction_end: string;
  status: 'draft' | 'active' | 'ended' | 'sold' | 'picked_up' | 'cancelled';
  images: string[];
  specifications?: Record<string, any>;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    weight?: number;
    unit?: 'ft' | 'in' | 'lbs' | 'kg';
  };
  quantity: number;
  minimum_bid_tier: 'T0' | 'T1' | 'T2' | 'T3';
  pickup_verification_code?: string;
  pickup_qr_code?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  seller?: BusinessProfile;
  location?: Location;
  bids?: Bid[];
  winning_bid?: Bid;
}

export interface Bid {
  id: string;
  lot_id: string;
  bidder_id: string;
  amount: number;
  bidder_location_lat: number;
  bidder_location_lng: number;
  distance_from_lot: number;
  is_eligible: boolean;
  is_winning: boolean;
  placed_at: string;
  
  // Relations
  lot?: Lot;
  bidder?: BusinessProfile;
}

export interface Escrow {
  id: string;
  lot_id: string;
  buyer_id: string;
  seller_id: string;
  amount: number;
  stripe_payment_intent_id: string;
  status: 'pending' | 'paid' | 'held' | 'released' | 'refunded';
  pickup_confirmed_at?: string;
  released_at?: string;
  refunded_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  lot?: Lot;
  buyer?: BusinessProfile;
  seller?: BusinessProfile;
}

export interface User {
  id: string;
  email: string;
  role: 'buyer' | 'seller' | 'admin';
  is_verified: boolean;
  verification_tier: 'T0' | 'T1' | 'T2' | 'T3';
  preferred_location_id?: string;
  notification_preferences?: Record<string, boolean>;
  last_active_at?: string;
  created_at: string;
  updated_at: string;
  
  // Relations
  business_profile?: BusinessProfile;
  preferred_location?: Location;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  error?: string;
}

// Search and Filter Types
export interface LotFilters {
  region_id?: string;
  location_id?: string;
  category?: string;
  condition?: Lot['condition'];
  min_price?: number;
  max_price?: number;
  distance_miles?: number;
  verification_tier?: 'T0' | 'T1' | 'T2' | 'T3';
  status?: Lot['status'];
  ending_soon?: boolean;
  sort_by?: 'ending_soonest' | 'newest' | 'price_asc' | 'price_desc' | 'distance';
  user_lat?: number;
  user_lng?: number;
}

export interface RegionStats {
  total_lots: number;
  active_lots: number;
  total_businesses: number;
  average_bid_amount: number;
  categories: Record<string, number>;
  weekly_growth: number;
}

// Form Types
export interface CreateLotFormData {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  condition: Lot['condition'];
  starting_bid: number;
  reserve_price?: number;
  location_id: string;
  pickup_address: string;
  pickup_instructions?: string;
  pickup_window_start?: string;
  pickup_window_end?: string;
  auction_duration_hours: number;
  images: File[];
  specifications?: Record<string, string>;
  dimensions?: Lot['dimensions'];
  quantity: number;
  minimum_bid_tier: Lot['minimum_bid_tier'];
}

export interface BusinessProfileFormData {
  business_name: string;
  business_type: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  website?: string;
  description?: string;
}

// Event Types for Real-time Features
export interface LotUpdateEvent {
  type: 'bid_placed' | 'lot_ended' | 'lot_sold' | 'pickup_confirmed';
  lot_id: string;
  data: Record<string, any>;
  timestamp: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Utility Types
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Distance {
  miles: number;
  kilometers: number;
}

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total_seconds: number;
}

// Constants
export const VERIFICATION_TIERS = ['T0', 'T1', 'T2', 'T3'] as const;
export const LOT_CONDITIONS = ['new', 'like_new', 'good', 'fair', 'poor', 'salvage'] as const;
export const LOT_STATUSES = ['draft', 'active', 'ended', 'sold', 'picked_up', 'cancelled'] as const;
export const USER_ROLES = ['buyer', 'seller', 'admin'] as const;

// Business Categories
export const BUSINESS_CATEGORIES = {
  construction: {
    name: 'Construction & Materials',
    subcategories: ['Heavy Equipment', 'Tools', 'Materials', 'Safety Equipment']
  },
  restaurant: {
    name: 'Restaurant & Food Service',
    subcategories: ['Kitchen Equipment', 'Furniture', 'POS Systems', 'Refrigeration']
  },
  office: {
    name: 'Office & Business Equipment',
    subcategories: ['Furniture', 'Electronics', 'Computers', 'Printers']
  },
  municipal: {
    name: 'Municipal & Government',
    subcategories: ['Vehicles', 'Furniture', 'Equipment', 'Electronics']
  },
  healthcare: {
    name: 'Healthcare & Medical',
    subcategories: ['Equipment', 'Furniture', 'Electronics', 'Supplies']
  },
  retail: {
    name: 'Retail & Commercial',
    subcategories: ['Fixtures', 'Equipment', 'POS Systems', 'Inventory']
  }
} as const;

export type BusinessCategory = keyof typeof BUSINESS_CATEGORIES;
