import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { getSupabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type SellerApp = {
  id: string
  user_id: string | null
  full_name: string
  email: string
  status: 'new' | 'approved' | 'rejected' | 'waitlist'
  doc_paths?: string[]
  created_at: string
}

export default function ReviewSellers() {
  const sb = getSupabase()
  const [rows, setRows] = useState<SellerApp[]>([])
  const [q, setQ] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      if (!sb) return
      const { data, error } = await sb
        .schema('app')
        .from('seller_applications')
        .select('id,user_id,full_name,email,status,doc_paths,created_at')
        .order('created_at', { ascending: false })
      if (!error) setRows((data as any) || [])
    })()
  }, [sb])

  const setStatus = async (userId: string | null, status: 'approved' | 'rejected' | 'waitlist') => {
    if (!sb || !userId) return
    setBusy(true)
    try {
      // update application status
      await sb.schema('app').from('seller_applications').update({ status }).eq('user_id', userId)
      // set KYB on sellers via RPC
      if (status === 'approved') {
        await sb.rpc('app.set_seller_kyc', { p_user: userId, p_status: 'verified' })
      }
      setRows(r => r.map(x => x.user_id === userId ? { ...x, status: status } : x))
    } finally { setBusy(false) }
  }

  const filtered = rows.filter(r => !q || r.full_name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()))

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Review Sellers | Admin</title></Helmet>
      <main className="container mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Review Seller Applications</h1>
        <div className="flex gap-2 items-center">
          <Input placeholder="Search by name or email" value={q} onChange={(e)=>setQ(e.target.value)} />
        </div>
        <div className="grid gap-3">
          {filtered.map(r => (
            <div key={r.id} className="rounded-lg border bg-card p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{r.full_name} <span className="text-muted-foreground text-xs">({r.email})</span></div>
                <div className="text-xs text-muted-foreground">Submitted {new Date(r.created_at).toLocaleString()} · Status: {r.status}</div>
                {!!r.doc_paths?.length && (
                  <div className="mt-1 text-xs">Docs: {r.doc_paths.join(', ')}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" disabled={busy} onClick={()=>setStatus(r.user_id, 'rejected')}>Reject</Button>
                <Button disabled={busy} onClick={()=>setStatus(r.user_id, 'approved')}>Approve</Button>
              </div>
            </div>
          ))}
          {!filtered.length && <div className="text-sm text-muted-foreground">No applications.</div>}
        </div>
      </main>
    </div>
  )
}

