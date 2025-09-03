Test Summary — ZingLots.com

Date: 2025-09-02 (UTC)

Overview
- Test runner: Vitest (jsdom)
- Accessibility: jest-axe + axe-core
- Status: All tests passing; one known noisy console warning from legacy stubs

Suites
- Unit
  - bidIncrements: verifies increment ladder tiers across thresholds
  - flags: ensures env-driven booleans are exposed
  - regions: validates deduped, sorted states and A–Z grouping
- Components
  - Countdown: renders end date and ticking label; stable under fake timers
  - Header/Footer: brand text and essential links/hrefs
- Accessibility
  - Home page (ModernIndex): axe scan with IntersectionObserver mocked and button labels added

Key Fixes for Green Build
- Added IntersectionObserver mock in vitest.setup.ts
- FeaturedAuctionsMarquee: proper list/listitem structure; removed invalid role on anchor
- ModernIndex: labeled icon-only controls and normalized footer headings

Known Warnings (Non-failing)
- React Router future flag warnings in tests (harmless)
- Legacy BidPanel email stub emits HTTP 400 in background (caught; tests still pass)

Commands
- Run tests: npx vitest run
- Run a11y only: npx vitest run src/__a11y__/app.a11y.test.tsx

CI Notes
- jsdom lacks some browser APIs; vitest.setup.ts provides required mocks
- If Lighthouse CI is added later, include budgets for LCP and CLS
