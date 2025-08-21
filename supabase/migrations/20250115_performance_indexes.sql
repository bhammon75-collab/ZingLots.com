-- Performance optimization indexes for handling thousands of auctions

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_lots_status_ends_at ON app.lots(status, ends_at) WHERE status IN ('running', 'queued');
CREATE INDEX IF NOT EXISTS idx_lots_show_status ON app.lots(show_id, status);
CREATE INDEX IF NOT EXISTS idx_lots_category_status ON app.lots(category, status) WHERE status = 'running';
CREATE INDEX IF NOT EXISTS idx_lots_winner_status ON app.lots(winner_id, status) WHERE winner_id IS NOT NULL;

-- Text search indexes for better search performance
CREATE INDEX IF NOT EXISTS idx_lots_title_gin ON app.lots USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_lots_description_gin ON app.lots USING gin(to_tsvector('english', description)) WHERE description IS NOT NULL;

-- Partial indexes for active auctions (most queried)
CREATE INDEX IF NOT EXISTS idx_lots_active ON app.lots(created_at DESC) WHERE status = 'running';
CREATE INDEX IF NOT EXISTS idx_lots_ending_soon ON app.lots(ends_at ASC) WHERE status = 'running' AND ends_at IS NOT NULL;

-- Indexes for bid queries
CREATE INDEX IF NOT EXISTS idx_bids_lot_amount ON app.bids(lot_id, amount DESC);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_created ON app.bids(bidder_id, created_at DESC);

-- Indexes for seller queries
CREATE INDEX IF NOT EXISTS idx_shows_seller_status ON app.shows(seller_id, status);
CREATE INDEX IF NOT EXISTS idx_shows_starts_at ON app.shows(starts_at) WHERE status = 'scheduled';

-- Indexes for order management
CREATE INDEX IF NOT EXISTS idx_orders_lot_status ON app.orders(lot_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status ON app.orders(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_created_status ON app.orders(created_at DESC, status);

-- Function to get lot statistics for dashboard
CREATE OR REPLACE FUNCTION app.get_lot_statistics(
  p_seller_id uuid DEFAULT NULL,
  p_days_back integer DEFAULT 30
)
RETURNS TABLE (
  total_lots bigint,
  active_lots bigint,
  sold_lots bigint,
  total_bids bigint,
  total_revenue numeric,
  avg_sale_price numeric
)
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT l.id) AS total_lots,
    COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'running') AS active_lots,
    COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'sold') AS sold_lots,
    COUNT(DISTINCT b.id) AS total_bids,
    COALESCE(SUM(o.subtotal), 0) AS total_revenue,
    AVG(o.subtotal) AS avg_sale_price
  FROM app.lots l
  LEFT JOIN app.shows s ON s.id = l.show_id
  LEFT JOIN app.bids b ON b.lot_id = l.id
  LEFT JOIN app.orders o ON o.lot_id = l.id AND o.status IN ('paid', 'settled')
  WHERE 
    (p_seller_id IS NULL OR s.seller_id = p_seller_id)
    AND l.created_at >= NOW() - INTERVAL '1 day' * p_days_back;
END;
$$;

-- Function for efficient lot search with pagination
CREATE OR REPLACE FUNCTION app.search_lots(
  p_search_term text DEFAULT NULL,
  p_category app.category DEFAULT NULL,
  p_status app.lot_status DEFAULT NULL,
  p_min_price numeric DEFAULT NULL,
  p_max_price numeric DEFAULT NULL,
  p_limit integer DEFAULT 20,
  p_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  category app.category,
  status app.lot_status,
  current_price numeric,
  start_price numeric,
  ends_at timestamptz,
  bid_count bigint,
  total_count bigint
)
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  v_total_count bigint;
BEGIN
  -- Get total count for pagination
  SELECT COUNT(*)
  INTO v_total_count
  FROM app.lots l
  WHERE 
    (p_search_term IS NULL OR 
     l.title ILIKE '%' || p_search_term || '%' OR 
     l.description ILIKE '%' || p_search_term || '%')
    AND (p_category IS NULL OR l.category = p_category)
    AND (p_status IS NULL OR l.status = p_status)
    AND (p_min_price IS NULL OR COALESCE(l.current_price, l.start_price) >= p_min_price)
    AND (p_max_price IS NULL OR COALESCE(l.current_price, l.start_price) <= p_max_price);

  -- Return paginated results with bid count
  RETURN QUERY
  SELECT
    l.id,
    l.title,
    l.description,
    l.category,
    l.status,
    l.current_price,
    l.start_price,
    l.ends_at,
    COUNT(DISTINCT b.id) AS bid_count,
    v_total_count AS total_count
  FROM app.lots l
  LEFT JOIN app.bids b ON b.lot_id = l.id
  WHERE 
    (p_search_term IS NULL OR 
     l.title ILIKE '%' || p_search_term || '%' OR 
     l.description ILIKE '%' || p_search_term || '%')
    AND (p_category IS NULL OR l.category = p_category)
    AND (p_status IS NULL OR l.status = p_status)
    AND (p_min_price IS NULL OR COALESCE(l.current_price, l.start_price) >= p_min_price)
    AND (p_max_price IS NULL OR COALESCE(l.current_price, l.start_price) <= p_max_price)
  GROUP BY l.id, l.title, l.description, l.category, l.status, l.current_price, l.start_price, l.ends_at
  ORDER BY 
    CASE WHEN l.status = 'running' THEN 0 ELSE 1 END,
    l.ends_at ASC NULLS LAST,
    l.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- Create materialized view for popular lots (refresh periodically)
CREATE MATERIALIZED VIEW IF NOT EXISTS app.popular_lots AS
SELECT 
  l.id,
  l.title,
  l.category,
  l.current_price,
  l.start_price,
  l.ends_at,
  COUNT(DISTINCT b.bidder_id) as unique_bidders,
  COUNT(b.id) as total_bids,
  COUNT(DISTINCT w.user_id) as watchers
FROM app.lots l
LEFT JOIN app.bids b ON b.lot_id = l.id
LEFT JOIN app.lot_watches w ON w.lot_id = l.id
WHERE l.status = 'running'
GROUP BY l.id
HAVING COUNT(b.id) > 5 OR COUNT(DISTINCT w.user_id) > 10
ORDER BY COUNT(b.id) DESC, COUNT(DISTINCT w.user_id) DESC;

CREATE UNIQUE INDEX IF NOT EXISTS idx_popular_lots_id ON app.popular_lots(id);

-- Function to refresh materialized view (call this periodically)
CREATE OR REPLACE FUNCTION app.refresh_popular_lots()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY app.popular_lots;
END;
$$;

-- Add comment to track optimization
COMMENT ON SCHEMA app IS 'Optimized for handling thousands of concurrent auctions with performance indexes and search functions';