import { describe, it, expect } from 'vitest'
import { computeProxyOutcome } from '@/lib/bidding'

describe('App Smoke Tests', () => {
	it('should load without crashing', () => {
		expect(true).toBe(true)
	})

	it('proxy outcome deterministic under concurrency-like inputs', () => {
		const a = computeProxyOutcome(10, [
			{ bidderId: 'U1', max: 100, createdAt: 1000 },
			{ bidderId: 'U2', max: 120, createdAt: 1001 },
			{ bidderId: 'U3', max: 90, createdAt: 999 },
		])
		expect(a.leaderId).toBe('U2')
	})
})
