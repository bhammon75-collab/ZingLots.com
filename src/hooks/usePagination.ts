import { useState, useEffect, useCallback } from 'react';
import { getSupabase } from '@/lib/supabaseClient';

interface PaginationOptions {
  pageSize?: number;
  initialPage?: number;
}

interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  refresh: () => void;
}

export function usePagination<T>(
  table: string,
  options: PaginationOptions = {}
): PaginationResult<T> {
  const { pageSize = 12, initialPage = 1 } = options;
  const [data, setData] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabase();
  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchData = useCallback(async () => {
    if (!supabase) {
      setError('Supabase client not initialized');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get total count
      const { count, error: countError } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;
      setTotalCount(count || 0);

      // Get paginated data
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data: pageData, error: dataError } = await supabase
        .from(table)
        .select('*')
        .range(from, to)
        .order('created_at', { ascending: false });

      if (dataError) throw dataError;
      setData(pageData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [supabase, table, currentPage, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  return {
    data,
    currentPage,
    totalPages,
    totalCount,
    isLoading,
    error,
    nextPage,
    prevPage,
    goToPage,
    refresh: fetchData
  };
}