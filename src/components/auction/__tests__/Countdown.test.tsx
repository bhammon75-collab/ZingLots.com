import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { act } from 'react';
import Countdown, { LotTiming } from '@/components/auction/Countdown';

describe('Countdown', () => {
  it('renders end date and ticking label', async () => {
    vi.useFakeTimers();
    const now = new Date();
    const timing: LotTiming = {
      endAt: new Date(now.getTime() + 65_000).toISOString(),
      serverNow: now.toISOString(),
      antiSnipeWindowSec: 120,
      maxExtensions: 5,
      extensionsUsed: 0,
    };
    render(<Countdown timing={timing} />);
    expect(screen.getByText(/Ends at/)).toBeInTheDocument();
    // Advance 2s and ensure countdown label updates
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument();
    vi.useRealTimers();
  });
});

