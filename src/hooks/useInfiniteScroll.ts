import { useState, useEffect, useCallback, useRef } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

interface InfiniteScrollOptions {
  pageSize?: number;
  orderBy?: string;
  ascending?: boolean;
  filters?: Record<string, any>;
}

interface InfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  totalCount: number;
}

export function useInfiniteScroll<T>(
  table: string,
  options: InfiniteScrollOptions = {}
): InfiniteScrollResult<T> {
  const { 
    pageSize = 20, 
    orderBy = 'created_at', 
    ascending = false,
    filters = {}
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const currentPage = useRef(0);

  const supabase = getSupabase();

  const buildQuery = useCallback((query: any) => {
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          query = query.in(key, value);
        } else if (typeof value === 'object' && value.gte !== undefined) {
          query = query.gte(key, value.gte);
        } else if (typeof value === 'object' && value.lte !== undefined) {
          query = query.lte(key, value.lte);
        } else if (typeof value === 'string' && value.includes('%')) {
          query = query.ilike(key, value);
        } else {
          query = query.eq(key, value);
        }
      }
    });
    return query;
  }, [filters]);

  const fetchInitialData = useCallback(async () => {
    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get total count
      let countQuery = supabase.from(table).select('*', { count: 'exact', head: true });
      countQuery = buildQuery(countQuery);
      const { count, error: countError } = await countQuery;

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get first page of data
      let dataQuery = supabase
        .from(table)
        .select('*')
        .order(orderBy, { ascending })
        .range(0, pageSize - 1);
      
      dataQuery = buildQuery(dataQuery);
      const { data, error: dataError } = await dataQuery;

      if (dataError) throw dataError;
      
      setItems(data || []);
      setHasMore((data?.length || 0) === pageSize);
      currentPage.current = 1;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, table, pageSize, orderBy, ascending, buildQuery]);

  const loadMore = useCallback(async () => {
    if (!supabase || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    setError(null);

    try {
      const from = currentPage.current * pageSize;
      const to = from + pageSize - 1;

      let query = supabase
        .from(table)
        .select('*')
        .order(orderBy, { ascending })
        .range(from, to);
      
      query = buildQuery(query);
      const { data, error: dataError } = await query;

      if (dataError) throw dataError;

      if (data && data.length > 0) {
        setItems(prev => [...prev, ...data]);
        setHasMore(data.length === pageSize);
        currentPage.current += 1;
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoadingMore(false);
    }
  }, [supabase, table, pageSize, orderBy, ascending, isLoadingMore, hasMore, buildQuery]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const refresh = useCallback(() => {
    currentPage.current = 0;
    setItems([]);
    setHasMore(true);
    fetchInitialData();
  }, [fetchInitialData]);

  return {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
    totalCount
  };
}