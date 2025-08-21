/**
 * Simple in-memory cache with TTL support
 * For production, consider using Redis or similar
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private store: Map<string, CacheEntry<any>>;
  private timers: Map<string, NodeJS.Timeout>;

  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  set<T>(key: string, value: T, ttl: number = 300): void {
    // Clear existing timer if any
    this.clearTimer(key);

    // Store the entry
    this.store.set(key, {
      data: value,
      timestamp: Date.now(),
      ttl: ttl * 1000 // Convert to milliseconds
    });

    // Set auto-expiry timer
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.delete(key);
      }, ttl * 1000);
      this.timers.set(key, timer);
    }
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (entry.ttl > 0) {
      const elapsed = Date.now() - entry.timestamp;
      if (elapsed > entry.ttl) {
        this.delete(key);
        return null;
      }
    }

    return entry.data as T;
  }

  /**
   * Check if a key exists and is valid
   */
  has(key: string): boolean {
    const value = this.get(key);
    return value !== null;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): void {
    this.clearTimer(key);
    this.store.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    // Clear all timers
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.store.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.store.size;
  }

  /**
   * Clear expired entries
   */
  prune(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.store.forEach((entry, key) => {
      if (entry.ttl > 0) {
        const elapsed = now - entry.timestamp;
        if (elapsed > entry.ttl) {
          keysToDelete.push(key);
        }
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  /**
   * Get cache statistics
   */
  stats(): {
    size: number;
    keys: string[];
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const keys = Array.from(this.store.keys());
    const timestamps = Array.from(this.store.values()).map(e => e.timestamp);
    
    return {
      size: this.store.size,
      keys,
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : null,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : null
    };
  }

  private clearTimer(key: string): void {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
  }
}

// Create singleton instance
const cache = new Cache();

// Prune expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    cache.prune();
  }, 5 * 60 * 1000);
}

export default cache;

/**
 * Decorator for caching function results
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: {
    ttl?: number;
    keyGenerator?: (...args: Parameters<T>) => string;
  } = {}
): T {
  const { ttl = 300, keyGenerator = (...args) => JSON.stringify(args) } = options;

  return ((...args: Parameters<T>) => {
    const key = `memoize:${fn.name}:${keyGenerator(...args)}`;
    
    // Check cache first
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function and cache result
    const result = fn(...args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, value, ttl);
        return value;
      });
    }

    cache.set(key, result, ttl);
    return result;
  }) as T;
}

/**
 * React hook for using cache
 */
export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    ttl?: number;
    staleWhileRevalidate?: boolean;
  } = {}
): {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => void;
} {
  const { ttl = 300, staleWhileRevalidate = true } = options;
  const [data, setData] = useState<T | null>(() => cache.get<T>(key));
  const [isLoading, setIsLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await fetcher();
      cache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [key, fetcher, ttl]);

  useEffect(() => {
    const cached = cache.get<T>(key);
    
    if (cached) {
      setData(cached);
      
      // If staleWhileRevalidate is enabled, fetch fresh data in background
      if (staleWhileRevalidate) {
        fetch();
      }
    } else {
      fetch();
    }
  }, [key]);

  return {
    data,
    isLoading,
    error,
    refresh: fetch
  };
}

import { useState, useEffect, useCallback } from 'react';