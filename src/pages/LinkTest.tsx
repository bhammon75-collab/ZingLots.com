import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

const LinkTest = () => {
  const linkGroups = {
    'Main Navigation': [
      { path: '/', label: 'Home' },
      { path: '/discover', label: 'Discover' },
      { path: '/explore', label: 'Explore/Trending' },
      { path: '/browse', label: 'Browse All' },
      { path: '/categories', label: 'Categories' },
      { path: '/pricing', label: 'Pricing' },
      { path: '/help', label: 'Help & Contact' },
    ],
    'Regional Pages': [
      { path: '/r/seattle', label: 'Seattle' },
      { path: '/r/tacoma', label: 'Tacoma' },
      { path: '/r/portland', label: 'Portland' },
      { path: '/r/los-angeles', label: 'Los Angeles' },
      { path: '/r/san-francisco', label: 'San Francisco' },
      { path: '/r/chicago', label: 'Chicago' },
      { path: '/r/detroit', label: 'Detroit' },
      { path: '/r/new-york', label: 'New York' },
      { path: '/r/boston', label: 'Boston' },
      { path: '/r/philadelphia', label: 'Philadelphia' },
      { path: '/r/houston', label: 'Houston' },
      { path: '/r/dallas', label: 'Dallas' },
      { path: '/r/atlanta', label: 'Atlanta' },
      { path: '/r/miami', label: 'Miami' },
      { path: '/r/phoenix', label: 'Phoenix' },
      { path: '/regions', label: 'All Regions' },
    ],
    'Seller Pages': [
      { path: '/seller/apply', label: 'Apply to Sell' },
      { path: '/dashboard/seller', label: 'Seller Dashboard' },
      { path: '/sell/new', label: 'Create New Lot' },
      { path: '/seller/live', label: 'Go Live' },
      { path: '/help/selling', label: 'Selling Guide' },
    ],
    'Buyer Pages': [
      { path: '/dashboard/buyer', label: 'Buyer Dashboard' },
      { path: '/auction/active', label: 'My Bids' },
      { path: '/cart', label: 'Cart/Invoice' },
    ],
    'Auth Pages': [
      { path: '/login', label: 'Login' },
      { path: '/login?mode=register', label: 'Register' },
    ],
    'Footer Links': [
      { path: '/terms', label: 'Terms of Service' },
      { path: '/privacy', label: 'Privacy Policy' },
      { path: '/accessibility', label: 'Accessibility' },
      { path: '/sitemap', label: 'Sitemap' },
      { path: '/security', label: 'Security' },
      { path: '/contact', label: 'Contact Us' },
    ],
    'Admin Pages': [
      { path: '/admin', label: 'Admin Panel' },
      { path: '/admin/review-sellers', label: 'Review Sellers' },
    ],
  };

  // Test dynamic routes with sample IDs
  const dynamicRoutes = [
    { path: '/lot/test-123', label: 'Sample Lot Detail' },
    { path: '/category/restaurant-equipment', label: 'Sample Category' },
    { path: '/seller/seller-123', label: 'Sample Seller Profile' },
    { path: '/product/prod-123', label: 'Sample Product' },
    { path: '/auction/auction-123', label: 'Sample Auction Room' },
  ];

  return (
    <div className="min-h-screen bg-background">
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Link Verification Test Page</h1>
        <p className="text-muted-foreground mb-8">
          Click any link below to test if it's working. All links should navigate without showing a 404 error.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(linkGroups).map(([groupName, links]) => (
            <Card key={groupName}>
              <CardHeader>
                <CardTitle className="text-lg">{groupName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {links.map(link => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                    >
                      <span className="text-sm">{link.label}</span>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dynamic Routes (Examples)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dynamicRoutes.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted transition-colors"
                  >
                    <span className="text-sm">{link.label}</span>
                    <Badge variant="outline" className="text-xs">Dynamic</Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click each link above to verify it navigates correctly</li>
              <li>Green checkmarks indicate the route is defined in the application</li>
              <li>If you see a 404 page, the route needs to be fixed</li>
              <li>Regional pages should show location-specific content</li>
              <li>Dynamic routes use sample IDs for testing</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkTest;