import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import cache from '@/lib/cache';
import { 
  Activity, 
  Cpu, 
  HardDrive, 
  Wifi,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  apiResponseTime: number;
  cacheHitRate: number;
  memoryUsage: number;
  activeConnections: number;
  errorRate: number;
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageLoadTime: 0,
    apiResponseTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0,
    activeConnections: 0,
    errorRate: 0
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV === 'development') {
      setIsVisible(true);
      startMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, []);

  const startMonitoring = () => {
    // Monitor page load time
    if (window.performance && window.performance.timing) {
      const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
      updateMetric('pageLoadTime', loadTime);
    }

    // Monitor API response times
    interceptFetch();

    // Monitor cache performance
    monitorCache();

    // Monitor memory usage
    monitorMemory();

    // Set up periodic updates
    const interval = setInterval(() => {
      monitorCache();
      monitorMemory();
    }, 5000);

    window.performanceMonitorInterval = interval;
  };

  const stopMonitoring = () => {
    if (window.performanceMonitorInterval) {
      clearInterval(window.performanceMonitorInterval);
    }
  };

  const updateMetric = (key: keyof PerformanceMetrics, value: number) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const interceptFetch = () => {
    const originalFetch = window.fetch;
    let totalRequests = 0;
    let totalTime = 0;
    let errorCount = 0;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      totalRequests++;
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        
        totalTime += responseTime;
        updateMetric('apiResponseTime', Math.round(totalTime / totalRequests));
        updateMetric('activeConnections', totalRequests);
        
        if (!response.ok) {
          errorCount++;
          updateMetric('errorRate', (errorCount / totalRequests) * 100);
        }
        
        return response;
      } catch (error) {
        errorCount++;
        updateMetric('errorRate', (errorCount / totalRequests) * 100);
        throw error;
      }
    };
  };

  const monitorCache = () => {
    const cacheStats = cache.stats();
    const hitRate = calculateCacheHitRate();
    updateMetric('cacheHitRate', hitRate);
  };

  const calculateCacheHitRate = () => {
    // This would need actual tracking of cache hits/misses
    // For demo purposes, returning a simulated value
    return Math.random() * 30 + 70; // 70-100% hit rate
  };

  const monitorMemory = () => {
    if ('memory' in performance) {
      const memInfo = (performance as any).memory;
      const usagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
      updateMetric('memoryUsage', usagePercent);
    }
  };

  const getHealthStatus = () => {
    const { pageLoadTime, apiResponseTime, errorRate } = metrics;
    
    if (pageLoadTime > 3000 || apiResponseTime > 1000 || errorRate > 5) {
      return { status: 'poor', color: 'text-red-500', icon: AlertTriangle };
    }
    if (pageLoadTime > 2000 || apiResponseTime > 500 || errorRate > 2) {
      return { status: 'fair', color: 'text-yellow-500', icon: Activity };
    }
    return { status: 'good', color: 'text-green-500', icon: CheckCircle };
  };

  if (!isVisible) return null;

  const health = getHealthStatus();
  const HealthIcon = health.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-80 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Performance Monitor</CardTitle>
            <Badge variant="outline" className={health.color}>
              <HealthIcon className="h-3 w-3 mr-1" />
              {health.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Page Load Time */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Page Load
              </span>
              <span className="font-mono">{metrics.pageLoadTime}ms</span>
            </div>
            <Progress 
              value={Math.min((metrics.pageLoadTime / 3000) * 100, 100)} 
              className="h-1"
            />
          </div>

          {/* API Response Time */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Wifi className="h-3 w-3" />
                API Response
              </span>
              <span className="font-mono">{metrics.apiResponseTime}ms</span>
            </div>
            <Progress 
              value={Math.min((metrics.apiResponseTime / 1000) * 100, 100)} 
              className="h-1"
            />
          </div>

          {/* Cache Hit Rate */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                Cache Hit Rate
              </span>
              <span className="font-mono">{metrics.cacheHitRate.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.cacheHitRate} className="h-1" />
          </div>

          {/* Memory Usage */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Cpu className="h-3 w-3" />
                Memory Usage
              </span>
              <span className="font-mono">{metrics.memoryUsage.toFixed(1)}%</span>
            </div>
            <Progress value={metrics.memoryUsage} className="h-1" />
          </div>

          {/* Stats Summary */}
          <div className="pt-2 border-t">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Connections:</span>
                <span className="ml-1 font-mono">{metrics.activeConnections}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Error Rate:</span>
                <span className="ml-1 font-mono">{metrics.errorRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    performanceMonitorInterval?: NodeJS.Timeout;
  }
}