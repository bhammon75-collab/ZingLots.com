import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSupabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

type NpbRow = {
  lot_id: string;
  lot_title: string;
  top_bidder_id: string | null;
  top_bid_amount: number | null;
  invoice_id: string | null;
  invoice_status: string | null;
};

export default function NPBPanel() {
  const sb = getSupabase();
  const { toast } = useToast();
  const [rows, setRows] = useState<NpbRow[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!sb) return;
      // Simplified: lots with status 'sold' but invoice still 'invoiced' after grace period
      const { data } = await sb
        .schema('app')
        .rpc('admin_list_npb_candidates');
      setRows((data as any) || []);
    })();
  }, [sb]);

  const remind = async (invoiceId: string | null) => {
    if (!sb || !invoiceId) return;
    setBusy(invoiceId);
    try {
      const { error } = await sb.functions.invoke('admin-npb-remind', { body: { invoice_id: invoiceId } });
      if (error) throw error;
      toast({ description: 'Reminder sent' });
    } catch (e: any) {
      toast({ description: e.message || 'Failed to send reminder' });
    } finally { setBusy(null); }
  };

  const cancel = async (invoiceId: string | null) => {
    if (!sb || !invoiceId) return;
    setBusy(invoiceId);
    try {
      const { error } = await sb.functions.invoke('admin-npb-cancel', { body: { invoice_id: invoiceId } });
      if (error) throw error;
      toast({ description: 'Invoice canceled' });
    } catch (e: any) {
      toast({ description: e.message || 'Failed to cancel' });
    } finally { setBusy(null); }
  };

  const offerToNext = async (lotId: string) => {
    if (!sb) return;
    setBusy(lotId);
    try {
      const { error } = await sb.functions.invoke('admin-offer-next', { body: { lot_id: lotId } });
      if (error) throw error;
      toast({ description: 'Offer sent to next highest bidder' });
    } catch (e: any) {
      toast({ description: e.message || 'Failed to offer' });
    } finally { setBusy(null); }
  };

  const filtered = rows.filter(r => !q || (r.lot_title || '').toLowerCase().includes(q.toLowerCase()) || (r.lot_id || '').toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input placeholder="Search lots" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid gap-2">
        {filtered.map(r => (
          <div key={r.lot_id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
            <div>
              <div className="font-medium">{r.lot_title || r.lot_id}</div>
              <div className="text-xs text-muted-foreground">Top: {r.top_bid_amount != null ? `$${Number(r.top_bid_amount).toFixed(2)}` : '—'}</div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={()=>remind(r.invoice_id)} disabled={!!busy} aria-disabled={!!busy}>Remind</Button>
              <Button variant="destructive" size="sm" onClick={()=>cancel(r.invoice_id)} disabled={!!busy} aria-disabled={!!busy}>Cancel</Button>
              <Button size="sm" onClick={()=>offerToNext(r.lot_id)} disabled={!!busy} aria-disabled={!!busy}>Offer Next</Button>
            </div>
          </div>
        ))}
        {!filtered.length && <div className="text-xs text-muted-foreground">No NPB candidates</div>}
      </div>
    </div>
  );
}

