import { Helmet } from "react-helmet-async";
import ZingNav from "@/components/ZingNav";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminNpbPanel from "@/components/admin/NPBPanel";
import { Link } from "react-router-dom";

interface PayoutRow { id: string; order_id: string; seller_id: string; amount: number; status: string; }

const Admin = () => {
  const [payouts, setPayouts] = useState<PayoutRow[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [lots, setLots] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [q, setQ] = useState<string>("");
  const [impersonateId, setImpersonateId] = useState<string>("");

  const refresh = async () => {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.schema('app').from('payouts').select('id, order_id, seller_id, amount, status').eq('status', 'pending').order('created_at', { ascending: false });
    setPayouts((data as any) || []);
    // Lightweight search sources
    const { data: usersData } = await sb.schema('app').from('profiles').select('id, display_name, handle, role').limit(200);
    setUsers((usersData as any) || []);
    const { data: lotsData } = await sb.schema('app').from('lots').select('id, title, status, winner_id').order('created_at', { ascending: false }).limit(200);
    setLots((lotsData as any) || []);
    const { data: auditData } = await sb.schema('app').from('audit_logs').select('id, table_name, action, actor_id, created_at').order('created_at', { ascending: false }).limit(100);
    setAudits((auditData as any) || []);
  };

  useEffect(() => { refresh(); }, []);

  const settle = async (orderId: string) => {
    const sb = getSupabase();
    if (!sb) return;
    await sb.functions.invoke('admin-settle', { body: { orderId } });
    await refresh();
  };

  const filteredUsers = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return users;
    return users.filter(u => (u.display_name || '').toLowerCase().includes(needle) || (u.handle || '').toLowerCase().includes(needle) || (u.id || '').toLowerCase().includes(needle));
  }, [q, users]);

  const filteredLots = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return lots;
    return lots.filter(l => (l.title || '').toLowerCase().includes(needle) || (l.id || '').toLowerCase().includes(needle));
  }, [q, lots]);

  const setAdminImpersonate = async () => {
    const sb = getSupabase();
    if (!sb || !impersonateId) return;
    try {
      await sb.functions.invoke('admin-impersonate-set', { body: { user_id: impersonateId } });
      // Read-only impersonation cookie will be set by edge; UI can show banner via nav
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Admin | ZingLots</title>
        <meta name="description" content="Verify sellers, manage disputes, and platform settings." />
        <link rel="canonical" href="/admin" />
      </Helmet>
      <ZingNav />
      <main className="container mx-auto grid gap-6 px-4 py-10">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <Tabs defaultValue="payouts">
          <TabsList>
            <TabsTrigger value="payouts">Payouts</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="kyb">KYB</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="npb">NPB</TabsTrigger>
            <TabsTrigger value="risk">Risk</TabsTrigger>
            <TabsTrigger value="audit">Audit</TabsTrigger>
          </TabsList>
          <TabsContent value="payouts">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold">Pending Payouts</h2>
              <div className="space-y-2 mt-2">
                {payouts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending payouts.</p>
                ) : payouts.map(p => (
                  <div key={p.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                    <div>
                      <div className="font-medium">Order {p.order_id.slice(0,8)}…</div>
                      <div className="text-muted-foreground">Seller {p.seller_id.slice(0,8)}… · Amount ${Number(p.amount).toFixed(2)}</div>
                    </div>
                    <Button onClick={() => settle(p.order_id)}>Settle Payout</Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="search">
            <div className="rounded-lg border bg-card p-6 space-y-3">
              <div className="flex items-center gap-2">
                <Input placeholder="Search users/lots" value={q} onChange={(e)=>setQ(e.target.value)} />
                <input className="rounded-md border bg-background px-3 py-2" placeholder="Impersonate user id (read-only)" value={impersonateId} onChange={(e)=>setImpersonateId(e.target.value)} />
                <Button variant="outline" onClick={setAdminImpersonate}>Impersonate</Button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border p-3">
                  <h3 className="font-semibold text-sm mb-2">Users</h3>
                  <div className="space-y-2 max-h-80 overflow-auto">
                    {filteredUsers.map(u => (
                      <div key={u.id} className="text-sm">
                        <div className="font-medium">{u.display_name || u.handle || u.id.slice(0,8)}</div>
                        <div className="text-muted-foreground text-xs">{u.id} · {u.role}</div>
                      </div>
                    ))}
                    {!filteredUsers.length && <div className="text-xs text-muted-foreground">No users</div>}
                  </div>
                </div>
                <div className="rounded-md border p-3">
                  <h3 className="font-semibold text-sm mb-2">Lots</h3>
                  <div className="space-y-2 max-h-80 overflow-auto">
                    {filteredLots.map(l => (
                      <div key={l.id} className="text-sm">
                        <div className="font-medium">{l.title || l.id.slice(0,8)}</div>
                        <div className="text-muted-foreground text-xs">{l.id} · {l.status}</div>
                      </div>
                    ))}
                    {!filteredLots.length && <div className="text-xs text-muted-foreground">No lots</div>}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="kyb">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold">Review Sellers (KYB)</h2>
              <p className="text-sm text-muted-foreground mb-3">Approve or reject seller applications.</p>
              <Link className="underline text-sm" to="/admin/review-sellers">Open review panel →</Link>
            </div>
          </TabsContent>
          <TabsContent value="disputes">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold">Disputes & Refunds</h2>
              <p className="text-sm text-muted-foreground">Timers, evidence, resolutions, and refunds.</p>
            </div>
          </TabsContent>
          <TabsContent value="npb">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold">Non-Paying Bidders (NPB)</h2>
              <p className="text-sm text-muted-foreground mb-3">Send reminders, cancel invoices, and offer to the next highest bidder.</p>
              {/* Lazy import to avoid circulars */}
              <AdminNpbPanel />
            </div>
          </TabsContent>
          <TabsContent value="risk">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold">Risk Tools</h2>
              <p className="text-sm text-muted-foreground">Flag counterfeit risk and ban accounts if needed.</p>
            </div>
          </TabsContent>
          <TabsContent value="audit">
            <div className="rounded-lg border bg-card p-6">
              <h2 className="font-semibold">Audit Logs</h2>
              <p className="text-sm text-muted-foreground mb-3">Read-only trail of sensitive changes.</p>
              <div className="max-h-80 overflow-auto text-xs">
                {audits.map(a => (
                  <div key={a.id} className="grid grid-cols-4 gap-2 border-b py-1">
                    <div>{new Date(a.created_at).toLocaleString()}</div>
                    <div>{a.table_name}</div>
                    <div>{a.action}</div>
                    <div className="truncate">{a.actor_id}</div>
                  </div>
                ))}
                {!audits.length && <div className="text-muted-foreground">No audit entries.</div>}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
