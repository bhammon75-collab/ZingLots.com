import { describe, it, expect } from 'vitest'
import { computeProxyOutcome, ProxyBid } from '@/lib/bidding'

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

describe('Bidding concurrency simulation', () => {
  it('produces a single correct leader/price under 10+ simultaneous bids', async () => {
    const start = 50
    const bidders = Array.from({ length: 12 }).map((_, i) => ({
      bidderId: `B${i + 1}`,
      max: 50 + i * 10 + (i % 3 === 0 ? 15 : 0),
    }))

    const proxies: ProxyBid[] = []
    await Promise.all(
      bidders.map(({ bidderId, max }, idx) => new Promise<void>((resolve) => {
        const delay = randomInt(0, 20)
        setTimeout(() => {
          proxies.push({ bidderId, max, createdAt: Date.now() + idx })
          resolve()
        }, delay)
      }))
    )

    const out = computeProxyOutcome(start, proxies)
    // Derive expected outcome by deterministic sort
    const sorted = [...proxies].sort((a, b) => (b.max - a.max) || (a.createdAt - b.createdAt))
    const top = sorted[0]
    const second = sorted[1]
    expect(out.leaderId).toBe(top.bidderId)
    expect(out.displayPrice).toBeGreaterThanOrEqual(start)
    if (second) {
      expect(out.displayPrice).toBeLessThanOrEqual(top.max)
    }
  })
})

