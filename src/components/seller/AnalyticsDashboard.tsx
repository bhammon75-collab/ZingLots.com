import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getSupabase } from '@/lib/supabaseClient';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Users, 
  Eye,
  Gavel,
  Clock,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface AnalyticsData {
  totalLots: number;
  activeLots: number;
  soldLots: number;
  totalBids: number;
  totalRevenue: number;
  avgSalePrice: number;
  conversionRate: number;
  avgBidsPerLot: number;
}

interface TrendData {
  date: string;
  revenue: number;
  lots: number;
  bids: number;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [topLots, setTopLots] = useState<any[]>([]);

  const supabase = getSupabase();

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    if (!supabase) return;
    
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const sellerId = session?.session?.user?.id;
      
      if (!sellerId) return;

      // Fetch statistics using the new function
      const { data: stats, error: statsError } = await supabase
        .rpc('get_lot_statistics', {
          p_seller_id: sellerId,
          p_days_back: parseInt(timeRange)
        });

      if (statsError) throw statsError;

      if (stats && stats.length > 0) {
        const stat = stats[0];
        setAnalytics({
          totalLots: stat.total_lots || 0,
          activeLots: stat.active_lots || 0,
          soldLots: stat.sold_lots || 0,
          totalBids: stat.total_bids || 0,
          totalRevenue: stat.total_revenue || 0,
          avgSalePrice: stat.avg_sale_price || 0,
          conversionRate: stat.total_lots > 0 ? (stat.sold_lots / stat.total_lots) * 100 : 0,
          avgBidsPerLot: stat.total_lots > 0 ? stat.total_bids / stat.total_lots : 0
        });
      }

      // Fetch top performing lots
      const { data: lots, error: lotsError } = await supabase
        .from('lots')
        .select(`
          id,
          title,
          current_price,
          status,
          created_at,
          bids:bids(count)
        `)
        .eq('status', 'running')
        .order('current_price', { ascending: false })
        .limit(5);

      if (!lotsError && lots) {
        setTopLots(lots);
      }

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100);
  };

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: { 
    title: string; 
    value: number; 
    change?: number; 
    icon: any;
    format?: 'number' | 'currency' | 'percent';
  }) => {
    const formattedValue = format === 'currency' 
      ? formatCurrency(value * 100)
      : format === 'percent'
      ? `${value.toFixed(1)}%`
      : value.toLocaleString();

    const isPositive = change && change > 0;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formattedValue}</div>
          {change !== undefined && (
            <div className={`flex items-center text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
              <span>{Math.abs(change).toFixed(1)}% from last period</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track your auction performance</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={analytics?.totalRevenue || 0}
          icon={DollarSign}
          format="currency"
          change={12.5}
        />
        <StatCard
          title="Active Lots"
          value={analytics?.activeLots || 0}
          icon={Package}
          change={-5.2}
        />
        <StatCard
          title="Total Bids"
          value={analytics?.totalBids || 0}
          icon={Gavel}
          change={18.3}
        />
        <StatCard
          title="Conversion Rate"
          value={analytics?.conversionRate || 0}
          icon={TrendingUp}
          format="percent"
          change={3.1}
        />
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="buyers">Buyers</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Your sales performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Lots</span>
                    <span className="font-medium">{analytics?.totalLots || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Sold Lots</span>
                    <span className="font-medium">{analytics?.soldLots || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average Sale Price</span>
                    <span className="font-medium">{formatCurrency((analytics?.avgSalePrice || 0) * 100)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Bids per Lot</span>
                    <span className="font-medium">{analytics?.avgBidsPerLot?.toFixed(1) || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Lots</CardTitle>
                <CardDescription>Your highest value active auctions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topLots.map((lot, index) => (
                    <div key={lot.id} className="flex justify-between items-center">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lot.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {lot.bids?.[0]?.count || 0} bids
                        </p>
                      </div>
                      <span className="text-sm font-bold">
                        {formatCurrency((lot.current_price || 0) * 100)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Status</CardTitle>
              <CardDescription>Overview of your lot statuses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <span className="font-medium">{analytics?.activeLots || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Sold</span>
                  </div>
                  <span className="font-medium">{analytics?.soldLots || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                    <span className="text-sm">Unsold</span>
                  </div>
                  <span className="font-medium">
                    {(analytics?.totalLots || 0) - (analytics?.soldLots || 0) - (analytics?.activeLots || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="buyers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Engagement</CardTitle>
              <CardDescription>How buyers interact with your lots</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Detailed buyer analytics coming soon
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}