import { useEffect, useRef, useState } from 'react'
import { getSupabase } from '@/lib/supabaseClient'

import type { LotStatus } from '@/types/auction'

interface State {
  status?: LotStatus
  endsAt?: string | null
  topBid?: number | null
  reserveMet?: boolean
  highBidder?: string | null
  highBidderId?: string | null
  extendedPing?: number
}

// Properly typed Supabase query responses instead of generic casting
interface LotData {
  status: LotStatus
  ends_at: string | null
  reserve_met: boolean
  current_price: number | null
  high_bidder: string | null
  high_bidder_id: string | null
}

interface BidData {
  amount: number
}

// Properly typed Postgres realtime payloads
interface PostgresChangePayload<T = Record<string, unknown>> {
  new: T
  old?: T
  eventType: 'INSERT' | 'UPDATE' | 'DELETE'
}

interface LotUpdatePayload {
  status: LotStatus
  ends_at: string | null
  reserve_met: boolean
  current_price: number | null
  high_bidder: string | null
  high_bidder_id: string | null
}

interface BidInsertPayload {
  amount: number
  lot_id: string
}

// Type guard functions for safe type checking
function isValidLotData(data: unknown): data is LotData {
  if (!data || typeof data !== 'object') return false;
  const lot = data as Record<string, unknown>;
  
  return (
    typeof lot.status === 'string' &&
    (lot.ends_at === null || typeof lot.ends_at === 'string') &&
    typeof lot.reserve_met === 'boolean' &&
    (lot.current_price === null || typeof lot.current_price === 'number') &&
    (lot.high_bidder === null || typeof lot.high_bidder === 'string') &&
    (lot.high_bidder_id === null || typeof lot.high_bidder_id === 'string')
  );
}

function isValidBidData(data: unknown): data is BidData {
  if (!data || typeof data !== 'object') return false;
  const bid = data as Record<string, unknown>;
  
  return typeof bid.amount === 'number';
}

export function useLotRealtime(lotId: string) {
  const [state, setState] = useState<State>({})
  const lastEndsAtRef = useRef<string | null>(null)

  useEffect(() => {
    const sb = getSupabase()
    if (!sb || !lotId) return
    let mounted = true

    ;(async () => {
      const { data: lot } = await sb.schema('app')
        .from('lots')
        .select('status, ends_at, reserve_met, current_price, high_bidder, high_bidder_id')
        .eq('id', lotId).maybeSingle()
      const { data: top } = await sb.schema('app')
        .from('bids').select('amount').eq('lot_id', lotId)
        .order('amount', { ascending: false }).limit(1).maybeSingle()

      if (!mounted) return
      
      // Use type guards instead of unsafe casting
      const lotData = isValidLotData(lot) ? lot : null;
      const topBid = isValidBidData(top) ? top : null;
      
      setState({
        status: lotData?.status,
        endsAt: lotData?.ends_at ?? null,
        reserveMet: !!(lotData?.reserve_met),
        topBid: topBid?.amount ?? lotData?.current_price ?? null,
        highBidder: lotData?.high_bidder ?? null,
        highBidderId: lotData?.high_bidder_id ?? null,
      })
      lastEndsAtRef.current = lotData?.ends_at ?? null
    })()

    const ch = sb.channel(`lot-${lotId}`)
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'app', table: 'lots', filter: `id=eq.${lotId}` },
        (payload: PostgresChangePayload<LotUpdatePayload>) => {
          const ends = payload.new.ends_at
          const prev = lastEndsAtRef.current
          lastEndsAtRef.current = ends ?? null
          setState(s => ({
            ...s,
            status: payload.new.status,
            endsAt: ends,
            reserveMet: !!payload.new.reserve_met,
            topBid: typeof payload.new.current_price === 'number' ? Number(payload.new.current_price) : s.topBid,
            highBidder: payload.new.high_bidder ?? s.highBidder,
            highBidderId: payload.new.high_bidder_id ?? s.highBidderId,
            extendedPing: (prev && ends && new Date(ends).getTime() > new Date(prev).getTime()) ? Date.now() : s.extendedPing
          }))
        })
      .on('postgres_changes',
        { event: 'INSERT', schema: 'app', table: 'bids', filter: `lot_id=eq.${lotId}` },
        (payload: PostgresChangePayload<BidInsertPayload>) => {
          const amount = Number(payload.new.amount)
          setState(s => ({ ...s, topBid: Math.max(s.topBid ?? 0, amount) }))
        })
      .subscribe()

    return () => { mounted = false; sb.removeChannel(ch) }
  }, [lotId])

  return state
}