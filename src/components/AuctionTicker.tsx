import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabaseClient';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  Clock, 
  Gavel, 
  AlertCircle,
  Zap
} from 'lucide-react';

interface TickerItem {
  id: string;
  type: 'bid' | 'ending' | 'new' | 'sold';
  title: string;
  lotId: string;
  amount?: number;
  timeLeft?: string;
  timestamp: Date;
}

export default function AuctionTicker() {
  const [items, setItems] = useState<TickerItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const supabase = getSupabase();

  useEffect(() => {
    if (!supabase) return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel('auction-ticker')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'app',
          table: 'bids'
        },
        (payload) => {
          // New bid received
          handleNewBid(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'app',
          table: 'lots',
          filter: 'status=eq.sold'
        },
        (payload) => {
          // Lot sold
          handleLotSold(payload.new);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'app',
          table: 'lots'
        },
        (payload) => {
          // New lot listed
          handleNewLot(payload.new);
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    // Fetch initial recent activity
    fetchRecentActivity();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const fetchRecentActivity = async () => {
    if (!supabase) return;

    try {
      // Get recent bids
      const { data: recentBids } = await supabase
        .from('bids')
        .select(`
          id,
          amount,
          created_at,
          lot:lots(id, title)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentBids) {
        const bidItems: TickerItem[] = recentBids.map(bid => ({
          id: `bid-${bid.id}`,
          type: 'bid',
          title: `New bid on "${bid.lot?.title || 'Unknown'}"`,
          lotId: bid.lot?.id || '',
          amount: bid.amount,
          timestamp: new Date(bid.created_at)
        }));

        setItems(prev => [...bidItems, ...prev].slice(0, 20));
      }
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    }
  };

  const handleNewBid = async (bid: any) => {
    if (!supabase) return;

    // Fetch lot details
    const { data: lot } = await supabase
      .from('lots')
      .select('id, title')
      .eq('id', bid.lot_id)
      .single();

    if (lot) {
      const newItem: TickerItem = {
        id: `bid-${bid.id}-${Date.now()}`,
        type: 'bid',
        title: `New bid on "${lot.title}"`,
        lotId: lot.id,
        amount: bid.amount,
        timestamp: new Date()
      };

      setItems(prev => [newItem, ...prev].slice(0, 20));
    }
  };

  const handleLotSold = (lot: any) => {
    const newItem: TickerItem = {
      id: `sold-${lot.id}-${Date.now()}`,
      type: 'sold',
      title: `"${lot.title}" has been sold!`,
      lotId: lot.id,
      amount: lot.current_price,
      timestamp: new Date()
    };

    setItems(prev => [newItem, ...prev].slice(0, 20));
  };

  const handleNewLot = (lot: any) => {
    const newItem: TickerItem = {
      id: `new-${lot.id}-${Date.now()}`,
      type: 'new',
      title: `New listing: "${lot.title}"`,
      lotId: lot.id,
      timestamp: new Date()
    };

    setItems(prev => [newItem, ...prev].slice(0, 20));
  };

  const getIcon = (type: TickerItem['type']) => {
    switch (type) {
      case 'bid':
        return <Gavel className="h-4 w-4" />;
      case 'ending':
        return <Clock className="h-4 w-4" />;
      case 'new':
        return <Zap className="h-4 w-4" />;
      case 'sold':
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: TickerItem['type']) => {
    switch (type) {
      case 'bid':
        return 'bg-blue-500';
      case 'ending':
        return 'bg-orange-500';
      case 'new':
        return 'bg-green-500';
      case 'sold':
        return 'bg-purple-500';
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <Card className="auction-ticker">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Live Activity
          </h3>
          {isConnected && (
            <Badge variant="outline" className="text-xs">
              <span className="h-2 w-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
              Live
            </Badge>
          )}
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No recent activity
            </p>
          ) : (
            items.map((item) => (
              <Link
                key={item.id}
                to={`/lot/${item.lotId}`}
                className="block p-2 rounded hover:bg-muted transition-colors"
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1 rounded ${getTypeColor(item.type)} text-white`}>
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {item.amount && (
                        <span className="font-medium">
                          {formatAmount(item.amount)}
                        </span>
                      )}
                      <span>{getTimeAgo(item.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </Card>
  );
}