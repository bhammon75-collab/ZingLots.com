module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      settings: {
        preset: 'mobile',
      },
    },
    assert: {
      assertions: {
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.05 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
      },
    },
  },
};

