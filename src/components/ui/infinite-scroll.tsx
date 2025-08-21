import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface InfiniteScrollProps {
  children: React.ReactNode;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  threshold?: number;
  className?: string;
  loader?: React.ReactNode;
  endMessage?: React.ReactNode;
}

export function InfiniteScroll({
  children,
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 100,
  className,
  loader = <DefaultLoader />,
  endMessage = <DefaultEndMessage />
}: InfiniteScrollProps) {
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [handleObserver, threshold]);

  return (
    <div className={cn('infinite-scroll-container', className)}>
      {children}
      
      {/* Loading indicator */}
      {isLoading && loader}
      
      {/* Observer target */}
      {hasMore && !isLoading && (
        <div ref={observerTarget} className="h-4" />
      )}
      
      {/* End message */}
      {!hasMore && !isLoading && endMessage}
    </div>
  );
}

function DefaultLoader() {
  return (
    <div className="flex justify-center py-8">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

function DefaultEndMessage() {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <p>No more items to load</p>
    </div>
  );
}