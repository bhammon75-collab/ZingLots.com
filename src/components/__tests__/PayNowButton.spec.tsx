import { describe, it, expect, vi, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { PayNowButton } from '@/components/PayNowButton'
import { __setClientForTests } from '@/lib/supabaseClient'

afterEach(() => { __setClientForTests(null as any); vi.restoreAllMocks(); })

describe('PayNowButton', () => {
  it('invokes checkout-create-session with orderId', async () => {
    const fakeInvoke = vi.fn().mockResolvedValue({ data: { url: 'https://example.test/checkout/sess_123' }, error: null })
    __setClientForTests({ functions: { invoke: fakeInvoke } } as any)

    const { getByRole } = render(<PayNowButton orderId={'ord_123'} subtotal={12.34} />)

    getByRole('button', { name: /pay now/i }).click()

    // allow async click handler to run
    await new Promise(r => setTimeout(r, 0))

    expect(fakeInvoke).toHaveBeenCalledWith('checkout-create-session', { body: { orderId: 'ord_123' } })
  })
})

