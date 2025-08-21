import { describe, it, expect, vi, afterEach } from 'vitest'
import { placeBidRPC } from '@/lib/bidding'

vi.mock('@/lib/supabaseClient', () => {
  const rpc = vi.fn().mockResolvedValue({ data: { ok: true, current_amount: 100, winner_id: 'u1', new_ends_at: null, reserve_met: false }, error: null })
  return { getSupabase: () => ({ rpc }) }
})

describe('placeBidRPC', () => {
  afterEach(() => vi.resetAllMocks())

  it('calls app.place_bid with the right payload', async () => {
    const res = await placeBidRPC({ lot_id: 'L1', offered: 50, max: 75 })
    expect(res.ok).toBe(true)
  })
})

