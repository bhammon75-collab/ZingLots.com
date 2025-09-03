import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import Regions from '@/pages/regions';
import { HelmetProvider } from 'react-helmet-async';

expect.extend(toHaveNoViolations);

describe('Accessibility - Regions', () => {
  it('regions page passes axe', async () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter>
          <Regions />
        </MemoryRouter>
      </HelmetProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

