export const FLAGS = {
  ENABLE_COMPARE: (import.meta as any)?.env?.VITE_ENABLE_COMPARE === 'true',
  ENABLE_WATCHLIST: (import.meta as any)?.env?.VITE_ENABLE_WATCHLIST === 'true',
} as const;

