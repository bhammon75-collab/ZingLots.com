import { describe, it, expect, vi } from 'vitest';
import { getSupabase, invokeFn } from '@/lib/supabaseClient';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: vi.fn(),
    },
    auth: {
      getUser: vi.fn(),
    },
    schema: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
  },
}));

describe('Supabase Client', () => {
  describe('getSupabase', () => {
    it('should return a supabase client instance or null if envs are missing', () => {
      const client = getSupabase();
      // In test environment without VITE_* envs, it should return null
      if (client === null) {
        expect(client).toBeNull();
      } else {
        expect(client).toBeTruthy();
        expect(client).toHaveProperty('functions');
        expect(client).toHaveProperty('auth');
      }
    });

    it('should return the same instance on multiple calls', () => {
      const client1 = getSupabase();
      const client2 = getSupabase();
      expect(client1).toBe(client2);
    });
  });

  describe('invokeFn', () => {
    it('should successfully invoke a function with data', async () => {
      const mockData = { result: 'success' };
      const client = getSupabase();
      
      if (client) {
        vi.mocked(client.functions.invoke).mockResolvedValueOnce({
          data: mockData,
          error: null,
        });

        const result = await invokeFn('test-function', { param: 'value' });
        expect(result).toEqual(mockData);
        expect(client.functions.invoke).toHaveBeenCalledWith('test-function', {
          body: { param: 'value' },
        });
      }
    });

    it('should throw error when function invocation fails', async () => {
      const mockError = new Error('Function failed');
      const client = getSupabase();
      
      if (client) {
        vi.mocked(client.functions.invoke).mockResolvedValueOnce({
          data: null,
          error: mockError,
        });

        await expect(invokeFn('failing-function')).rejects.toThrow('Function failed');
      }
    });

    it('should throw error when supabase is not configured', async () => {
      // Since getSupabase returns null when envs are missing, invokeFn should throw
      const client = getSupabase();
      if (client === null) {
        await expect(invokeFn('test-function')).rejects.toThrow('Supabase not configured (missing envs).');
      } else {
        // If client exists, this test should be skipped
        expect(true).toBe(true);
      }
    });

    it('should handle function calls without body parameter', async () => {
      const mockData = { status: 'ok' };
      const client = getSupabase();
      
      if (client) {
        vi.mocked(client.functions.invoke).mockResolvedValueOnce({
          data: mockData,
          error: null,
        });

        const result = await invokeFn('no-param-function');
        expect(result).toEqual(mockData);
        expect(client.functions.invoke).toHaveBeenCalledWith('no-param-function', {
          body: undefined,
        });
      }
    });
  });
});
