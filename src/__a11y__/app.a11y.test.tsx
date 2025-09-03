import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import ModernIndex from '@/pages/ModernIndex';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

expect.extend(toHaveNoViolations);

describe('Accessibility', () => {
  it('Home has no critical axe violations', async () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter>
          <ModernIndex />
        </MemoryRouter>
      </HelmetProvider>
    );
    const results = await axe(container, {
      rules: {
        // Keep fast; ignore color-contrast in CI smoke
        'color-contrast': { enabled: false },
      },
    });
    expect(results).toHaveNoViolations();
  });
});

