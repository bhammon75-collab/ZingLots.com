import { describe, it, expect } from 'vitest';
import { stepFor, nextMinimum, INCREMENTS, computeProxyOutcome, shouldExtend } from '@/lib/bidding';

describe('Bidding Math', () => {
  describe('stepFor', () => {
    it('should return correct step for prices under $100', () => {
      expect(stepFor(50)).toBe(5);
      expect(stepFor(99)).toBe(5);
      expect(stepFor(0)).toBe(5);
    });

    it('should return correct step for prices $100-$500', () => {
      expect(stepFor(100)).toBe(10);
      expect(stepFor(250)).toBe(10);
      expect(stepFor(499)).toBe(10);
    });

    it('should return correct step for prices $500-$1000', () => {
      expect(stepFor(500)).toBe(25);
      expect(stepFor(750)).toBe(25);
      expect(stepFor(999)).toBe(25);
    });

    it('should return correct step for prices $1000-$5000', () => {
      expect(stepFor(1000)).toBe(50);
      expect(stepFor(2500)).toBe(50);
      expect(stepFor(4999)).toBe(50);
    });

    it('should return correct step for prices $5000-$10000', () => {
      expect(stepFor(5000)).toBe(100);
      expect(stepFor(7500)).toBe(100);
      expect(stepFor(9999)).toBe(100);
    });

    it('should return correct step for prices over $10000', () => {
      expect(stepFor(10000)).toBe(250);
      expect(stepFor(25000)).toBe(250);
      expect(stepFor(100000)).toBe(250);
    });

    it('should handle edge cases at boundaries', () => {
      // Just under boundaries
      expect(stepFor(99.99)).toBe(5);
      expect(stepFor(499.99)).toBe(10);
      expect(stepFor(999.99)).toBe(25);
      expect(stepFor(4999.99)).toBe(50);
      expect(stepFor(9999.99)).toBe(100);
      
      // At boundaries
      expect(stepFor(100)).toBe(10);
      expect(stepFor(500)).toBe(25);
      expect(stepFor(1000)).toBe(50);
      expect(stepFor(5000)).toBe(100);
      expect(stepFor(10000)).toBe(250);
    });
  });

  describe('nextMinimum', () => {
    it('should return starting bid when current price is null', () => {
      expect(nextMinimum(null, 50)).toBe(50);
      expect(nextMinimum(undefined, 100)).toBe(100);
    });

    it('should return starting bid when current price is null or undefined', () => {
      expect(nextMinimum(null, 25)).toBe(25);
      expect(nextMinimum(undefined, 75)).toBe(75);
    });

    it('should calculate correct next minimum for different price ranges', () => {
      // Under $100 (step: $5)
      expect(nextMinimum(50, 10)).toBe(55);
      expect(nextMinimum(95, 10)).toBe(100);
      
      // $100-$500 (step: $10)
      expect(nextMinimum(150, 10)).toBe(160);
      expect(nextMinimum(490, 10)).toBe(500);
      
      // $500-$1000 (step: $25)
      expect(nextMinimum(600, 10)).toBe(625);
      expect(nextMinimum(975, 10)).toBe(1000);
      
      // $1000-$5000 (step: $50)
      expect(nextMinimum(1500, 10)).toBe(1550);
      expect(nextMinimum(4950, 10)).toBe(5000);
      
      // $5000-$10000 (step: $100)
      expect(nextMinimum(6000, 10)).toBe(6100);
      expect(nextMinimum(9900, 10)).toBe(10000);
      
      // Over $10000 (step: $250)
      expect(nextMinimum(15000, 10)).toBe(15250);
      expect(nextMinimum(50000, 10)).toBe(50250);
    });

    it('should handle boundary crossings correctly', () => {
      // Moving from $95 to $100 changes step from $5 to $10
      expect(nextMinimum(95, 10)).toBe(100);
      expect(nextMinimum(100, 10)).toBe(110); // Now using $10 step
      
      // Moving from $495 to $500 changes step from $10 to $25  
      expect(nextMinimum(495, 10)).toBe(505);
      expect(nextMinimum(500, 10)).toBe(525); // Now using $25 step
      
      // Moving from $995 to $1000 changes step from $25 to $50
      expect(nextMinimum(995, 10)).toBe(1020);
      expect(nextMinimum(1000, 10)).toBe(1050); // Now using $50 step
    });

    it('should ignore starting bid when current price exists', () => {
      // Starting bid should not affect calculation when current price exists
      expect(nextMinimum(100, 999999)).toBe(110);
      expect(nextMinimum(500, 1)).toBe(525);
      expect(nextMinimum(1000, 50)).toBe(1050);
    });
  });

  describe('INCREMENTS configuration', () => {
    it('should have correct increment structure', () => {
      expect(INCREMENTS).toHaveLength(6);
      expect(INCREMENTS[0]).toEqual({ upTo: 100, step: 5 });
      expect(INCREMENTS[1]).toEqual({ upTo: 500, step: 10 });
      expect(INCREMENTS[2]).toEqual({ upTo: 1000, step: 25 });
      expect(INCREMENTS[3]).toEqual({ upTo: 5000, step: 50 });
      expect(INCREMENTS[4]).toEqual({ upTo: 10000, step: 100 });
      expect(INCREMENTS[5]).toEqual({ upTo: Infinity, step: 250 });
    });

    it('should have ascending upTo values', () => {
      for (let i = 1; i < INCREMENTS.length - 1; i++) {
        expect(INCREMENTS[i].upTo).toBeGreaterThan(INCREMENTS[i - 1].upTo);
      }
    });

    it('should have ascending step values', () => {
      for (let i = 1; i < INCREMENTS.length; i++) {
        expect(INCREMENTS[i].step).toBeGreaterThan(INCREMENTS[i - 1].step);
      }
    });
  });

  describe('Proxy bidding outcome', () => {
    it('first proxy sets display to start price and leads', () => {
      const out = computeProxyOutcome(50, [
        { bidderId: 'A', max: 100, createdAt: 1 }
      ]);
      expect(out.leaderId).toBe('A');
      expect(out.displayPrice).toBe(50);
    });
    it('second proxy raises to second+increment but not above top max', () => {
      const out = computeProxyOutcome(10, [
        { bidderId: 'A', max: 150, createdAt: 1 },
        { bidderId: 'B', max: 120, createdAt: 2 }
      ]);
      // increment at 120 is $10 per INCREMENTS ($100-$500)
      expect(out.leaderId).toBe('A');
      expect(out.displayPrice).toBe(130);
    });
    it('tie on max prefers earlier createdAt', () => {
      const out = computeProxyOutcome(10, [
        { bidderId: 'A', max: 200, createdAt: 1 },
        { bidderId: 'B', max: 200, createdAt: 2 }
      ]);
      expect(out.leaderId).toBe('A');
    });
    it('never decreases below previous display', () => {
      const out = computeProxyOutcome(10, [
        { bidderId: 'A', max: 200, createdAt: 1 },
      ], 80);
      expect(out.displayPrice).toBe(80);
    });
  });

  describe('Anti-snipe window', () => {
    it('extends when inside final 120 seconds and under cap', () => {
      expect(shouldExtend(30, 0)).toBe(true);
      expect(shouldExtend(120, 4)).toBe(true);
      expect(shouldExtend(121, 0)).toBe(false);
      expect(shouldExtend(60, 5)).toBe(false);
    });
  });
});
