// Link checker utility to verify all routes are working

export const allRoutes = [
  // Main pages
  { path: '/', name: 'Home' },
  { path: '/classic', name: 'Classic Home' },
  { path: '/browse', name: 'Browse' },
  { path: '/discover', name: 'Discover' },
  { path: '/explore', name: 'Explore' },
  { path: '/categories', name: 'Categories' },
  { path: '/pricing', name: 'Pricing' },
  { path: '/help', name: 'Help' },
  { path: '/contact', name: 'Contact' },
  
  // Regional pages
  { path: '/r/seattle', name: 'Seattle Region' },
  { path: '/r/tacoma', name: 'Tacoma Region' },
  { path: '/r/portland', name: 'Portland Region' },
  { path: '/r/los-angeles', name: 'Los Angeles Region' },
  { path: '/r/san-francisco', name: 'San Francisco Region' },
  { path: '/r/chicago', name: 'Chicago Region' },
  { path: '/r/detroit', name: 'Detroit Region' },
  { path: '/r/new-york', name: 'New York Region' },
  { path: '/r/boston', name: 'Boston Region' },
  { path: '/r/philadelphia', name: 'Philadelphia Region' },
  { path: '/r/houston', name: 'Houston Region' },
  { path: '/r/dallas', name: 'Dallas Region' },
  { path: '/r/atlanta', name: 'Atlanta Region' },
  { path: '/r/miami', name: 'Miami Region' },
  { path: '/r/phoenix', name: 'Phoenix Region' },
  { path: '/regions', name: 'All Regions' },
  
  // Seller pages
  { path: '/seller/apply', name: 'Seller Apply' },
  { path: '/dashboard/seller', name: 'Seller Dashboard' },
  { path: '/sell/new', name: 'Create New Lot' },
  { path: '/seller/live', name: 'Go Live' },
  { path: '/help/selling', name: 'Selling Guide' },
  
  // Buyer pages
  { path: '/dashboard/buyer', name: 'Buyer Dashboard' },
  { path: '/auction/active', name: 'Active Auctions' },
  { path: '/cart', name: 'Cart' },
  
  // Auth pages
  { path: '/login', name: 'Login' },
  { path: '/login?mode=register', name: 'Register' },
  
  // Legal pages
  { path: '/terms', name: 'Terms of Service' },
  { path: '/privacy', name: 'Privacy Policy' },
  { path: '/accessibility', name: 'Accessibility' },
  { path: '/sitemap', name: 'Sitemap' },
  { path: '/security', name: 'Security' },
  
  // Admin pages
  { path: '/admin', name: 'Admin Panel' },
  { path: '/admin/review-sellers', name: 'Review Sellers' },
];

// Check if a route is defined in App.tsx
export function checkRoute(path: string): boolean {
  // Remove query parameters for checking
  const basePath = path.split('?')[0];
  
  // Dynamic routes that should work
  const dynamicRoutes = [
    /^\/r\/[^/]+$/,           // Regional pages
    /^\/lot\/[^/]+$/,         // Lot details
    /^\/category\/[^/]+$/,    // Category pages
    /^\/seller\/[^/]+$/,      // Seller profiles
    /^\/product\/[^/]+$/,     // Product details
    /^\/auction\/[^/]+$/,     // Auction rooms
    /^\/pickup\/[^/]+\/scan$/ // Pickup QR scan
  ];
  
  // Check if it matches any dynamic route
  for (const pattern of dynamicRoutes) {
    if (pattern.test(basePath)) {
      return true;
    }
  }
  
  // Check static routes
  const staticRoutes = [
    '/', '/classic', '/browse', '/discover', '/explore',
    '/categories', '/pricing', '/help', '/contact',
    '/regions', '/region-page',
    '/seller/apply', '/dashboard/seller', '/sell/new', '/seller/live',
    '/dashboard/buyer', '/auction/active', '/cart',
    '/login', '/terms', '/privacy', '/accessibility', '/sitemap', '/security',
    '/admin', '/admin/review-sellers', '/qa', '/shows', '/live'
  ];
  
  return staticRoutes.includes(basePath);
}

// Get all broken links
export function findBrokenLinks(): string[] {
  const broken: string[] = [];
  
  for (const route of allRoutes) {
    if (!checkRoute(route.path)) {
      broken.push(`${route.name}: ${route.path}`);
    }
  }
  
  return broken;
}