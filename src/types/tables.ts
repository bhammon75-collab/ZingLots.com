// Minimal table type hints for app schema used in UI
export type Profile = {
  id: string;
  handle: string | null;
  display_name: string | null;
  role: 'buyer' | 'seller' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Business = {
  id: string;
  owner_id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type Lot = {
  id: string;
  show_id: string | null;
  business_id: string | null;
  category: 'TCG' | 'LEGO' | 'FIGURE' | 'DIECAST' | 'PLUSH';
  title: string;
  description: string | null;
  start_price: number;
  bid_increment: number;
  status: 'queued' | 'running' | 'sold' | 'unsold' | 'void';
  winner_id: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type LotImage = {
  id: string;
  lot_id: string;
  storage_path: string;
  sort_index: number;
  created_at: string;
};

export type Bid = {
  id: string;
  lot_id: string;
  bidder_id: string;
  amount: number;
  created_at: string;
};

export type Invoice = {
  id: string;
  lot_id: string;
  buyer_id: string;
  status: 'invoiced' | 'paid' | 'settled' | 'refunded';
  subtotal: number;
  fees_bps: number;
  shipping_cents: number;
  created_at: string;
  updated_at: string;
};

export type Payout = {
  id: string;
  order_id: string;
  seller_id: string;
  amount: number;
  status: 'pending' | 'transferred' | 'failed';
  created_at: string;
  updated_at: string;
};

export type Message = {
  id: string;
  show_id: string;
  user_id: string;
  body: string;
  created_at: string;
};

export type Dispute = {
  id: string;
  order_id: string;
  buyer_id: string;
  type: 'item_not_received' | 'item_not_as_described' | 'other';
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  reason: string | null;
  created_at: string;
  updated_at: string;
};

