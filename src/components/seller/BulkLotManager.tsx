import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getSupabase } from '@/lib/supabaseClient';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Copy, 
  Archive,
  Play,
  Pause,
  DollarSign,
  Package,
  Filter,
  Download,
  Upload
} from 'lucide-react';

interface Lot {
  id: string;
  title: string;
  category: string;
  status: string;
  current_price: number;
  start_price: number;
  ends_at: string | null;
  bid_count: number;
  created_at: string;
}

export default function BulkLotManager() {
  const [selectedLots, setSelectedLots] = useState<Set<string>>(new Set());
  const [lots, setLots] = useState<Lot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  const supabase = getSupabase();

  const fetchLots = async () => {
    if (!supabase) return;
    
    setIsLoading(true);
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;
      
      if (!userId) return;

      let query = supabase
        .from('lots')
        .select(`
          id,
          title,
          category,
          status,
          current_price,
          start_price,
          ends_at,
          created_at,
          bids:bids(count)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(100);

      if (error) throw error;

      setLots(data?.map(lot => ({
        ...lot,
        bid_count: lot.bids?.[0]?.count || 0
      })) || []);
    } catch (error) {
      console.error('Error fetching lots:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch lots'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedLots(new Set(lots.map(lot => lot.id)));
    } else {
      setSelectedLots(new Set());
    }
  };

  const handleSelectLot = (lotId: string, checked: boolean) => {
    const newSelected = new Set(selectedLots);
    if (checked) {
      newSelected.add(lotId);
    } else {
      newSelected.delete(lotId);
    }
    setSelectedLots(newSelected);
  };

  const executeBulkAction = async () => {
    if (selectedLots.size === 0) {
      toast({
        variant: 'destructive',
        title: 'No lots selected',
        description: 'Please select at least one lot to perform bulk action'
      });
      return;
    }

    if (!bulkAction) {
      toast({
        variant: 'destructive',
        title: 'No action selected',
        description: 'Please select a bulk action to perform'
      });
      return;
    }

    setIsLoading(true);
    try {
      const selectedIds = Array.from(selectedLots);

      switch (bulkAction) {
        case 'delete':
          if (confirm(`Are you sure you want to delete ${selectedIds.length} lots?`)) {
            const { error } = await supabase!
              .from('lots')
              .delete()
              .in('id', selectedIds);
            
            if (error) throw error;
            
            toast({
              title: 'Success',
              description: `Deleted ${selectedIds.length} lots`
            });
          }
          break;

        case 'archive':
          const { error: archiveError } = await supabase!
            .from('lots')
            .update({ status: 'void' })
            .in('id', selectedIds);
          
          if (archiveError) throw archiveError;
          
          toast({
            title: 'Success',
            description: `Archived ${selectedIds.length} lots`
          });
          break;

        case 'activate':
          const { error: activateError } = await supabase!
            .from('lots')
            .update({ status: 'running' })
            .in('id', selectedIds);
          
          if (activateError) throw activateError;
          
          toast({
            title: 'Success',
            description: `Activated ${selectedIds.length} lots`
          });
          break;

        case 'pause':
          const { error: pauseError } = await supabase!
            .from('lots')
            .update({ status: 'queued' })
            .in('id', selectedIds);
          
          if (pauseError) throw pauseError;
          
          toast({
            title: 'Success',
            description: `Paused ${selectedIds.length} lots`
          });
          break;

        case 'duplicate':
          // Fetch full lot data for duplication
          const { data: lotsToClone, error: fetchError } = await supabase!
            .from('lots')
            .select('*')
            .in('id', selectedIds);
          
          if (fetchError) throw fetchError;
          
          // Create duplicates
          const duplicates = lotsToClone?.map(lot => ({
            ...lot,
            id: undefined,
            title: `${lot.title} (Copy)`,
            status: 'queued',
            created_at: undefined,
            updated_at: undefined
          }));
          
          if (duplicates && duplicates.length > 0) {
            const { error: insertError } = await supabase!
              .from('lots')
              .insert(duplicates);
            
            if (insertError) throw insertError;
            
            toast({
              title: 'Success',
              description: `Duplicated ${selectedIds.length} lots`
            });
          }
          break;

        default:
          toast({
            variant: 'destructive',
            title: 'Unknown action',
            description: 'The selected action is not recognized'
          });
      }

      // Refresh lots and clear selection
      await fetchLots();
      setSelectedLots(new Set());
      setBulkAction('');
    } catch (error) {
      console.error('Error executing bulk action:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to execute bulk action'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const exportLots = () => {
    const selectedData = lots.filter(lot => selectedLots.has(lot.id));
    const dataToExport = selectedData.length > 0 ? selectedData : lots;
    
    const csv = [
      ['ID', 'Title', 'Category', 'Status', 'Start Price', 'Current Price', 'Bids', 'Ends At', 'Created At'],
      ...dataToExport.map(lot => [
        lot.id,
        lot.title,
        lot.category,
        lot.status,
        lot.start_price,
        lot.current_price,
        lot.bid_count,
        lot.ends_at || '',
        lot.created_at
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lots_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Export complete',
      description: `Exported ${dataToExport.length} lots to CSV`
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      running: { variant: 'default', className: 'bg-green-500' },
      queued: { variant: 'secondary', className: 'bg-yellow-500' },
      sold: { variant: 'default', className: 'bg-blue-500' },
      unsold: { variant: 'secondary', className: 'bg-gray-500' },
      void: { variant: 'destructive', className: '' }
    };
    
    const config = variants[status] || { variant: 'secondary', className: '' };
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Lot Management</CardTitle>
        <CardDescription>
          Manage multiple lots at once with bulk actions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters and Actions */}
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <Input
              placeholder="Search lots..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="queued">Queued</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
                <SelectItem value="unsold">Unsold</SelectItem>
                <SelectItem value="void">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchLots} variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedLots.size > 0 && (
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <span className="text-sm font-medium">
                {selectedLots.size} lot{selectedLots.size !== 1 ? 's' : ''} selected
              </span>
              <Select value={bulkAction} onValueChange={setBulkAction}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select bulk action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activate">
                    <div className="flex items-center">
                      <Play className="h-4 w-4 mr-2" />
                      Activate
                    </div>
                  </SelectItem>
                  <SelectItem value="pause">
                    <div className="flex items-center">
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </div>
                  </SelectItem>
                  <SelectItem value="duplicate">
                    <div className="flex items-center">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </div>
                  </SelectItem>
                  <SelectItem value="archive">
                    <div className="flex items-center">
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </div>
                  </SelectItem>
                  <SelectItem value="delete">
                    <div className="flex items-center text-red-600">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={executeBulkAction} disabled={!bulkAction}>
                Execute
              </Button>
              <Button variant="outline" onClick={exportLots}>
                <Download className="h-4 w-4 mr-2" />
                Export Selected
              </Button>
            </div>
          )}
        </div>

        {/* Lots Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedLots.size === lots.length && lots.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Bids</TableHead>
                <TableHead>Ends At</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </TableCell>
                </TableRow>
              ) : lots.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No lots found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                lots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLots.has(lot.id)}
                        onCheckedChange={(checked) => handleSelectLot(lot.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lot.title}</TableCell>
                    <TableCell>{lot.category}</TableCell>
                    <TableCell>{getStatusBadge(lot.status)}</TableCell>
                    <TableCell>
                      ${((lot.current_price || lot.start_price) / 100).toFixed(2)}
                    </TableCell>
                    <TableCell>{lot.bid_count}</TableCell>
                    <TableCell>
                      {lot.ends_at 
                        ? new Date(lot.ends_at).toLocaleDateString()
                        : '-'
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}