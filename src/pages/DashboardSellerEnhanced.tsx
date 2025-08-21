import { Helmet } from "react-helmet-async";
import ModernNav from "@/components/ModernNav";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSupabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AnalyticsDashboard from "@/components/seller/AnalyticsDashboard";
import BulkLotManager from "@/components/seller/BulkLotManager";
import CSVImport from "@/components/lots/CSVImport";
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  Upload, 
  Plus,
  BarChart3,
  Settings,
  FileText
} from "lucide-react";

interface SellerStats {
  totalRevenue: number;
  activeLots: number;
  totalOrders: number;
  conversionRate: number;
}

const DashboardSellerEnhanced = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [sellerVerified, setSellerVerified] = useState(false);
  const [stats, setStats] = useState<SellerStats>({
    totalRevenue: 0,
    activeLots: 0,
    totalOrders: 0,
    conversionRate: 0
  });

  const supabase = getSupabase();

  useEffect(() => {
    checkSellerStatus();
  }, []);

  const checkSellerStatus = async () => {
    if (!supabase) return;
    
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (!userId) {
        navigate('/login');
        return;
      }

      // Check seller verification
      const { data: seller } = await supabase
        .from('sellers')
        .select('kyc_status')
        .eq('id', userId)
        .single();

      setSellerVerified(seller?.kyc_status === 'verified');

      // Fetch basic stats
      const { data: statsData } = await supabase
        .rpc('get_lot_statistics', {
          p_seller_id: userId,
          p_days_back: 30
        });

      if (statsData && statsData.length > 0) {
        const stat = statsData[0];
        setStats({
          totalRevenue: stat.total_revenue || 0,
          activeLots: stat.active_lots || 0,
          totalOrders: stat.sold_lots || 0,
          conversionRate: stat.total_lots > 0 
            ? (stat.sold_lots / stat.total_lots) * 100 
            : 0
        });
      }
    } catch (error) {
      console.error('Error fetching seller data:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <ModernNav />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Seller Dashboard | ZingLots</title>
        <meta name="description" content="Manage your auctions, track sales, and grow your business on ZingLots" />
      </Helmet>
      
      <ModernNav />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your auctions and track performance
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(stats.totalRevenue * 100)}
              </div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Lots</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeLots}</div>
              <p className="text-xs text-muted-foreground">Currently running</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">Completed sales</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Lots sold</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        {sellerVerified && (
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Button 
              onClick={() => navigate('/sell/new')}
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create New Lot</span>
            </Button>
            
            <Button 
              onClick={() => navigate('/seller/live')}
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
            >
              <Upload className="h-5 w-5" />
              <span>Go Live</span>
            </Button>
            
            <Button 
              variant="outline"
              className="h-auto py-4 flex flex-col items-center gap-2"
              onClick={() => document.getElementById('csv-import')?.click()}
            >
              <FileText className="h-5 w-5" />
              <span>Import CSV</span>
            </Button>
          </div>
        )}

        {/* Verification Warning */}
        {!sellerVerified && (
          <Card className="mb-8 border-yellow-500 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Complete Your Verification</CardTitle>
              <CardDescription className="text-yellow-700">
                You need to complete seller verification to start creating lots and going live.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate('/seller/apply')}>
                Complete Verification
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="lots">Manage Lots</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest auction activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">New bid on "Commercial Kitchen Equipment"</span>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lot "Office Furniture Set" sold</span>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Payment received for Order #1234</span>
                      <span className="text-xs text-muted-foreground">3 hours ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pending Actions</CardTitle>
                  <CardDescription>Items requiring your attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">3 orders awaiting shipment</span>
                      <Button size="sm">View Orders</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2 lots ending soon</span>
                      <Button size="sm" variant="outline">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">5 new messages</span>
                      <Button size="sm" variant="outline">View Messages</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle>💡 Pro Tips</CardTitle>
                <CardDescription>Maximize your success on ZingLots</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Upload at least 5 high-quality photos for better engagement</li>
                  <li>• Set competitive starting prices to attract more bidders</li>
                  <li>• Respond to buyer questions within 2 hours for best results</li>
                  <li>• Schedule lots to end during peak hours (7-9 PM local time)</li>
                  <li>• Use detailed descriptions including dimensions and condition</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lots" className="space-y-4">
            <BulkLotManager />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seller Settings</CardTitle>
                <CardDescription>Manage your seller account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Payment Settings</h3>
                  <Button variant="outline">
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Stripe Account
                  </Button>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Notification Preferences</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Email me when I receive a bid</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">Email me when a lot sells</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">Daily performance summary</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Store Information</h3>
                  <Button variant="outline">Edit Store Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardSellerEnhanced;