export function getIncrementForPrice(price: number): number {
  if (price <= 10000) {
    if (price <= 100) return 1;
    if (price <= 500) return 5;
    if (price <= 1000) return 10;
    if (price <= 5000) return 25;
    if (price <= 10000) return 50;
  }
  return 100;
}

