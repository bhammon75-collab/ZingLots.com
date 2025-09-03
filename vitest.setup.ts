import '@testing-library/jest-dom';

// Polyfills/mocks for jsdom environment
if (!(global as any).IntersectionObserver) {
  class MockIntersectionObserver {
    callback: IntersectionObserverCallback;
    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
    takeRecords(): IntersectionObserverEntry[] { return []; }
  }
  (global as any).IntersectionObserver = MockIntersectionObserver as any;
}

