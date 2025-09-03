import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import "./styles/modern-design.css";

// Eagerly loaded core pages
import ModernIndex from "./pages/ModernIndex";
import ModernProductDetail from "./pages/ModernProductDetail";
import Browse from "./pages/Browse";
import NotFound from "./pages/NotFound";

// Lazy loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Categories = lazy(() => import("./pages/Categories"));
const Shows = lazy(() => import("./pages/Shows"));
const Category = lazy(() => import("./pages/Category"));
const SellerProfile = lazy(() => import("./pages/SellerProfile"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Invoice = lazy(() => import("./pages/Invoice"));
const DashboardBuyer = lazy(() => import("./pages/DashboardBuyer"));
const DashboardSeller = lazy(() => import("./pages/DashboardSeller"));
const Admin = lazy(() => import("./pages/Admin"));
const ReviewSellers = lazy(() => import("./pages/admin/ReviewSellers"));
const Discover = lazy(() => import("./pages/Discover"));
const QA = lazy(() => import("./pages/QA"));
const Login = lazy(() => import("./pages/Login"));
const AuctionRoom = lazy(() => import("./pages/AuctionRoom"));
const GoLive = lazy(() => import("./pages/seller/GoLive"));
const Live = lazy(() => import("./pages/Live"));
const SellerApply = lazy(() => import("./pages/sellers/Apply"));
const Help = lazy(() => import("./pages/Help"));
const PricingPage = lazy(() => import("./pages/pricing"));
const ExplorePage = lazy(() => import("./pages/explore"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Security = lazy(() => import("./pages/Security"));
const TrustVerified = lazy(() => import("./pages/trust/VerifiedAuctioneers"));
const TrustPayments = lazy(() => import("./pages/trust/Payments"));
const TrustLive = lazy(() => import("./pages/trust/LiveAuctions"));
const LegalTerms = lazy(() => import("./pages/legal/Terms"));
const LegalPrivacy = lazy(() => import("./pages/legal/Privacy"));
const LegalDisputes = lazy(() => import("./pages/legal/Disputes"));
const LegalLogistics = lazy(() => import("./pages/legal/Logistics"));

// B2B Marketplace Pages
const RegionPage = lazy(() => import("./pages/RegionPage"));
const Regions = lazy(() => import("./pages/Regions"));
const StatePage = lazy(() => import("./pages/StatePage"));
const Alerts = lazy(() => import("./pages/Alerts"));
const CreateLotPage = lazy(() => import("./pages/CreateLotPage"));
const QRScannerPage = lazy(() => import("./pages/QRScannerPage"));
const AuctionPage = lazy(() => import("./pages/AuctionPage"));

import AppShell from "@/components/layout/AppShell";
import { RouteErrorBoundary } from "./components/RouteErrorBoundary";

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

// Feature flags
const LIVE_SHOWS_ENABLED = import.meta.env?.VITE_FEATURE_LIVE_SHOWS === 'true';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <a href="#main" className="sr-only focus:not-sr-only fixed left-4 top-4 z-50 bg-white px-3 py-2 rounded shadow">
              Skip to content
            </a>
            <AppShell>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<ModernIndex />} />
                  <Route path="/classic" element={<Index />} />
                  
                  {/* B2B Marketplace Routes */}
                  <Route path="/r/:region" element={<RouteErrorBoundary><RegionPage /></RouteErrorBoundary>} />
                  <Route path="/sell/new" element={<CreateLotPage />} />
                  <Route path="/pickup/:lotId/scan" element={<QRScannerPage />} />
                  <Route path="/lot/:id" element={<ModernProductDetail />} />
                  <Route path="/classic-lot/:id" element={<ProductDetail />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/region-page" element={<RegionPage />} />
                  <Route path="/regions" element={<Regions />} />
                  <Route path="/state/:state" element={<StatePage />} />
                  <Route path="/alerts" element={<Alerts />} />
                  
                  {/* Legacy Routes (transitioning) */}
                  {import.meta.env.DEV && <Route path="/shows" element={<Shows />} />}
                  {import.meta.env.DEV && <Route path="/discover" element={<Discover />} />}
                  {import.meta.env.DEV && <Route path="/explore" element={<ExplorePage />} />}
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/seller/:id" element={<SellerProfile />} />
                  <Route path="/seller/apply" element={<SellerApply />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Invoice />} />
                  <Route path="/dashboard/buyer" element={<DashboardBuyer />} />
                  <Route path="/dashboard/seller" element={<DashboardSeller />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/admin/review-sellers" element={<ReviewSellers />} />
                  {import.meta.env.DEV && <Route path="/qa" element={<QA />} />}
                  <Route path="/login" element={<Login />} />
                  
                  {/* Fixed routes - auction detail and live room separated */}
                  <Route
                    path="/auction/:id"
                    element={
                      <RouteErrorBoundary>
                        <AuctionPage />
                      </RouteErrorBoundary>
                    }
                  />
                  
                  {/* Renamed live room path so it doesn't grab /auction/:id */}
                  <Route path="/live/:lotId" element={<AuctionRoom />} />
                  
                  <Route path="/auction/active" element={<DashboardBuyer />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  {/* Legal and Support Pages */}
                  {/* Trust & Legal */}
                  <Route path="/trust/verified-auctioneers" element={<TrustVerified />} />
                  <Route path="/trust/payments" element={<TrustPayments />} />
                  <Route path="/trust/live-auctions" element={<TrustLive />} />
                  <Route path="/legal/terms" element={<LegalTerms />} />
                  <Route path="/legal/privacy" element={<LegalPrivacy />} />
                  <Route path="/legal/disputes" element={<LegalDisputes />} />
                  <Route path="/legal/logistics" element={<LegalLogistics />} />
                  <Route path="/contact" element={<Help />} />
                  <Route path="/help/selling" element={<Help />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/sitemap" element={<Sitemap />} />
                  <Route path="/security" element={<Security />} />
                  
                  {/* Feature-flagged LiveKit routes */}
                  {LIVE_SHOWS_ENABLED && (
                    <>
                      <Route path="/live" element={<Live />} />
                      <Route path="/seller/live" element={<GoLive />} />
                    </>
                  )}
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AppShell>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
