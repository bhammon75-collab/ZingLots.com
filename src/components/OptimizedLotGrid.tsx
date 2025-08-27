import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { LazyImage } from '@/components/ui/lazy-image';
import { InfiniteScroll } from '@/components/ui/infinite-scroll';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getSupabase } from '@/lib/supabaseClient';
import cache from '@/lib/cache';
import { 
  Clock, 
  MapPin, 
  Eye,
  Heart,
  
} from 'lucide-react';

interface Lot {
  id: string;
  title: string;
  description?: string;
  current_price: number;
  start_price: number;
  ends_at: string | null;
  status: string;
  image_url?: string;
  category: string;
  bid_count?: number;
  watcher_count?: number;
  location?: string;
  seller?: {
    id: string;
    display_name: string;
  };
}

interface OptimizedLotGridProps {
  filters?: {
    category?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    searchTerm?: string;
    location?: string;
  };
  sort?: 'endingSoon' | 'newest' | 'priceAsc' | 'priceDesc';
  pageSize?: number;
  viewMode?: 'grid' | 'list';
  showFilters?: boolean;
}

export default function OptimizedLotGrid({
  filters = {},
  sort = 'endingSoon',
  pageSize = 24,
  viewMode = 'grid',
  showFilters = true
}: OptimizedLotGridProps) {
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [watchedLots, setWatchedLots] = useState<Set<string>>(new Set());
  
  const supabase = getSupabase();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Generate cache key from filters
  const getCacheKey = useCallback(() => {
    return `lots:${JSON.stringify(filters)}:${sort}:${page}:${pageSize}`;
  }, [filters, sort, page, pageSize]);

  const fetchLots = useCallback(async (pageNum: number, append: boolean = false) => {
    if (!supabase) return;

    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Check cache first
    const cacheKey = getCacheKey();
    const cached = cache.get<{ lots: Lot[], total: number }>(cacheKey);
    
    if (cached && !append) {
      setLots(cached.lots);
      setTotalCount(cached.total);
      setHasMore(cached.lots.length === pageSize);
      setIsLoading(false);
      return;
    }

    abortControllerRef.current = new AbortController();
    
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      // Build query
      let query = supabase
        .from('lots')
        .select(`
          *,
          seller:profiles!lots_seller_id_fkey(id, display_name),
          bids(count),
          lot_watches(count)
        `, { count: 'exact' });

      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.minPrice) {
        query = query.gte('current_price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('current_price', filters.maxPrice);
      }
      if (filters.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,description.ilike.%${filters.searchTerm}%`);
      }
      if (filters.location) {
        query = query.eq('location', filters.location);
      }

      // Add pagination
      const from = pageNum * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      // Sort options
      if (sort === 'endingSoon') {
        query = query.order('ends_at', { ascending: true, nullsFirst: false });
      } else if (sort === 'newest') {
        query = query.order('created_at', { ascending: false, nullsFirst: false });
      } else if (sort === 'priceAsc') {
        query = query.order('current_price', { ascending: true, nullsFirst: false });
      } else if (sort === 'priceDesc') {
        query = query.order('current_price', { ascending: false, nullsFirst: false });
      }

      const { data, error, count } = await query;

      if (error) throw error;

      const formattedLots: Lot[] = (data || []).map(lot => ({
        ...lot,
        bid_count: lot.bids?.[0]?.count || 0,
        watcher_count: lot.lot_watches?.[0]?.count || 0
      }));

      // Cache the results
      cache.set(cacheKey, { lots: formattedLots, total: count || 0 }, 60);

      if (append) {
        setLots(prev => [...prev, ...formattedLots]);
      } else {
        setLots(formattedLots);
      }

      setTotalCount(count || 0);
      setHasMore(formattedLots.length === pageSize);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching lots:', error);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [supabase, filters, sort, pageSize, getCacheKey]);

  useEffect(() => {
    setPage(0);
    // Do not clear lots immediately; keep showing previous results until new data arrives
    fetchLots(0);
  }, [filters, sort, fetchLots]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLots(nextPage, true);
  }, [page, fetchLots]);

  const toggleWatchLot = useCallback((lotId: string) => {
    setWatchedLots(prev => {
      const newSet = new Set(prev);
      if (newSet.has(lotId)) {
        newSet.delete(lotId);
      } else {
        newSet.add(lotId);
      }
      return newSet;
    });
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const getTimeLeft = (endsAt: string | null) => {
    if (!endsAt) return 'No end date';
    
    const end = new Date(endsAt);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const LotCard = ({ lot }: { lot: Lot }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <Link to={`/lot/${lot.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <LazyImage
            src={lot.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&auto=format'}
            alt={lot.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {lot.status === 'running' && (
            <Badge className="absolute top-2 left-2 bg-green-500">
              Live
            </Badge>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWatchLot(lot.id);
            }}
            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
          >
            <Heart 
              className={`h-4 w-4 ${watchedLots.has(lot.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/lot/${lot.id}`}>
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {lot.title}
          </h3>
        </Link>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary">
              {formatPrice(lot.current_price || lot.start_price)}
            </span>
            <Badge variant="secondary">
              {lot.bid_count} bids
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getTimeLeft(lot.ends_at)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {lot.watcher_count}
            </span>
          </div>
          
          {lot.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {lot.location}
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const LotSkeleton = () => (
    <Card>
      <Skeleton className="aspect-[4/3]" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-3 w-full" />
      </div>
    </Card>
  );

  if (isLoading && lots.length === 0) {
    return (
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {Array.from({ length: pageSize }).map((_, i) => (
          <LotSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      {showFilters && (
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {lots.length} of {totalCount} auctions
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {}}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => {}}
            >
              List
            </Button>
          </div>
        </div>
      )}

      <InfiniteScroll
        onLoadMore={loadMore}
        hasMore={hasMore}
        isLoading={isLoadingMore}
      >
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {lots.map(lot => (
            <LotCard key={lot.id} lot={lot} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}