import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { useDebounce } from './useDebounce';

interface SearchOptions {
  searchFields?: string[];
  orderBy?: string;
  ascending?: boolean;
  limit?: number;
  additionalFilters?: Record<string, any>;
}

interface SearchResult<T> {
  results: T[];
  isSearching: boolean;
  error: string | null;
  totalCount: number;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  clearSearch: () => void;
}

export function useOptimizedSearch<T>(
  table: string,
  options: SearchOptions = {}
): SearchResult<T> {
  const {
    searchFields = ['title', 'description'],
    orderBy = 'created_at',
    ascending = false,
    limit = 50,
    additionalFilters = {}
  } = options;

  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const supabase = getSupabase();

  const performSearch = useCallback(async () => {
    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    // If search term is empty, clear results
    if (!debouncedSearchTerm.trim()) {
      setResults([]);
      setTotalCount(0);
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      // Build the search query
      let query = supabase.from(table).select('*', { count: 'exact' });

      // Add search conditions using OR for multiple fields
      if (searchFields.length > 0) {
        const searchConditions = searchFields
          .map(field => `${field}.ilike.%${debouncedSearchTerm}%`)
          .join(',');
        
        query = query.or(searchConditions);
      }

      // Apply additional filters
      Object.entries(additionalFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });

      // Apply ordering and limit
      query = query.order(orderBy, { ascending }).limit(limit);

      const { data, error: searchError, count } = await query;

      if (searchError) throw searchError;

      setResults(data || []);
      setTotalCount(count || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [supabase, table, debouncedSearchTerm, searchFields, orderBy, ascending, limit, additionalFilters]);

  useEffect(() => {
    performSearch();
  }, [performSearch]);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setResults([]);
    setTotalCount(0);
    setError(null);
  }, []);

  return {
    results,
    isSearching,
    error,
    totalCount,
    searchTerm,
    setSearchTerm,
    clearSearch
  };
}