import '@testing-library/jest-dom';

// JSDOM polyfills for libraries that depend on browser-only APIs
if (typeof window !== 'undefined') {
  const ensureMatchMedia = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const original = window.matchMedia as undefined | ((q: string) => MediaQueryList);
    // Replace with a stable implementation that exposes legacy addListener/removeListener
    // and modern addEventListener/removeEventListener to satisfy both implementations.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.matchMedia = (query: string) => {
      const base = typeof original === 'function' ? original(query) : undefined;
      const mql: MediaQueryList = {
        matches: base?.matches ?? false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList;
      return mql;
    };
  };
  ensureMatchMedia();
}

