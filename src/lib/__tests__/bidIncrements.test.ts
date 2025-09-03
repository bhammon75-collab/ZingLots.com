import { describe, it, expect } from 'vitest';
import { getIncrementForPrice } from '@/lib/bidIncrements';

describe('getIncrementForPrice', () => {
  it('uses $1 steps up to $100', () => {
    expect(getIncrementForPrice(0)).toBe(1);
    expect(getIncrementForPrice(100)).toBe(1);
  });
  it('uses $5 steps up to $500', () => {
    expect(getIncrementForPrice(101)).toBe(5);
    expect(getIncrementForPrice(500)).toBe(5);
  });
  it('uses $10 steps up to $1000', () => {
    expect(getIncrementForPrice(750)).toBe(10);
    expect(getIncrementForPrice(1000)).toBe(10);
  });
  it('uses $25 steps up to $5000', () => {
    expect(getIncrementForPrice(2000)).toBe(25);
    expect(getIncrementForPrice(5000)).toBe(25);
  });
  it('uses $50 steps up to $10000', () => {
    expect(getIncrementForPrice(7500)).toBe(50);
    expect(getIncrementForPrice(10000)).toBe(50);
  });
  it('uses $100 steps above $10000', () => {
    expect(getIncrementForPrice(10001)).toBe(100);
    expect(getIncrementForPrice(25000)).toBe(100);
  });
});

