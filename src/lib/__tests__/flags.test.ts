import { describe, it, expect } from 'vitest';
import { FLAGS } from '@/lib/flags';

describe('feature flags', () => {
  it('exposes compare and watchlist flags', () => {
    expect(typeof FLAGS.ENABLE_COMPARE).toBe('boolean');
    expect(typeof FLAGS.ENABLE_WATCHLIST).toBe('boolean');
  });
});

