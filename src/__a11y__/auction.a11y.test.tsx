import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuctionPage from '@/pages/AuctionPage';
import { HelmetProvider } from 'react-helmet-async';

expect.extend(toHaveNoViolations);

describe('Accessibility - AuctionPage', () => {
  it('auction page passes axe', async () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/auction/test"]}>
          <Routes>
            <Route path="/auction/:id" element={<AuctionPage />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

