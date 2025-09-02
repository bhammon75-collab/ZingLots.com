export type RegionMetrics = {
  totalAuctions: number;
  markets: number;
  businesses: number;
};

// Stub adapter: return metrics or null to hide
export function getRegionMetrics(): RegionMetrics | null {
  // In a real implementation, fetch from API or DB.
  // Return null to hide the bar if unavailable.
  return {
    totalAuctions: 1248,
    markets: 86,
    businesses: 312,
  };
}

