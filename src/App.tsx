import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import ModernIndex from "./pages/ModernIndex";
import ModernProductDetail from "./pages/ModernProductDetail";
import Browse from "./pages/Browse";
import Categories from "./pages/Categories";
import NotFound from "./pages/NotFound";
import Shows from "./pages/Shows";
import Category from "./pages/Category";
import SellerProfile from "./pages/SellerProfile";
import ProductDetail from "./pages/ProductDetail";
import Invoice from "./pages/Invoice";
import DashboardBuyer from "./pages/DashboardBuyer";
import DashboardSeller from "./pages/DashboardSeller";
import Admin from "./pages/Admin";
import ReviewSellers from "./pages/admin/ReviewSellers";
import Discover from "./pages/Discover";
import QA from "./pages/QA";
import Login from "./pages/Login";
import AuctionRoom from "./pages/AuctionRoom";
import GoLive from "./pages/seller/GoLive";
import Live from "./pages/Live";
import SellerApply from "./pages/sellers/Apply";
import Help from "./pages/Help";
import PricingPage from "./pages/pricing";
import ExplorePage from "./pages/explore";
import Accessibility from "./pages/Accessibility";
import Sitemap from "./pages/Sitemap";
import Security from "./pages/Security";
import "./styles/modern-design.css";

// B2B Marketplace Pages
import RegionPage from "./pages/RegionPage";
import CreateLotPage from "./pages/CreateLotPage";
import QRScannerPage from "./pages/QRScannerPage";

const queryClient = new QueryClient();

// Feature flags
const LIVE_SHOWS_ENABLED = (import.meta as any)?.env?.VITE_FEATURE_LIVE_SHOWS === 'true';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<ModernIndex />} />
              <Route path="/classic" element={<Index />} />
              
              {/* B2B Marketplace Routes */}
              <Route path="/r/:regionSlug" element={<RegionPage />} />
              <Route path="/sell/new" element={<CreateLotPage />} />
              <Route path="/pickup/:lotId/scan" element={<QRScannerPage />} />
              <Route path="/lot/:id" element={<ModernProductDetail />} />
              <Route path="/classic-lot/:id" element={<ProductDetail />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/region-page" element={<RegionPage />} />
              <Route path="/regions" element={<RegionPage />} />
              
              {/* Legacy Routes (transitioning) */}
              <Route path="/shows" element={<Shows />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/explore" element={<ExplorePage />} />
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
              <Route path="/qa" element={<QA />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auction/:lotId" element={<AuctionRoom />} />
              <Route path="/auction/active" element={<DashboardBuyer />} />
              <Route path="/help" element={<Help />} />
              <Route path="/pricing" element={<PricingPage />} />
              {/* Legal and Support Pages */}
              <Route path="/terms" element={<div className="p-6">Terms coming soon.</div>} />
              <Route path="/privacy" element={<div className="p-6">Privacy Policy coming soon.</div>} />
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
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
