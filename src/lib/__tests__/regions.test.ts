import { describe, it, expect } from 'vitest';
import { getStates, groupByLetter } from '@/lib/regions';

describe('regions adapters', () => {
  it('returns deduped, alphabetized states', () => {
    const states = getStates();
    const names = states.map(s => s.name);
    const sorted = [...names].sort((a,b)=>a.localeCompare(b));
    expect(names).toEqual(sorted);
    const codes = new Set(states.map(s => s.code));
    expect(codes.size).toBe(states.length);
  });
  it('groups states by initial letter', () => {
    const states = getStates();
    const grouped = groupByLetter(states);
    for (const [letter, arr] of Object.entries(grouped)) {
      for (const s of arr) expect(s.name.startsWith(letter)).toBe(true);
    }
  });
});

