import { Helmet } from 'react-helmet-async'
import PricingCalculator from '@/components/pricing/PricingCalculator'
import { CONFIG } from '@/config/pricing'

export default function PricingPage() {
  const isPromo = CONFIG.mode === 'buyer_premium';
  
  return (
    <>
      <Helmet>
        <title>Pricing - ZingLots</title>
        <meta name="description" content="Transparent auction fees with buyer's premium model. Low fees for buyers and sellers." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Pricing</h1>
          <p className="text-muted-foreground mb-8">
            Transparent auction fees with our buyer's premium model - common in auctions, 
            applied to the winning bid with a minimum of ${CONFIG.bpMin}/lot.
          </p>

          {/* Promo Banner */}
          {isPromo && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Limited Time Promo Pricing</h3>
                  <p className="text-green-800 text-sm mt-1">
                    Buyer's Premium: {Math.round(CONFIG.bpPromo * 100)}% (min ${CONFIG.bpMin}) • 
                    Card Processing: {Math.round(CONFIG.cardPct * 100)}% • 
                    Seller Fee: {Math.round(CONFIG.sellerPromo * 100)}%
                  </p>
                  <p className="text-green-700 text-xs mt-2">
                    During our promotional period, sellers pay no fees!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Calculator */}
          <div className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Fee Calculator</h2>
            <PricingCalculator />
          </div>

          {/* How it Works */}
          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4">How Our Pricing Works</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">For Buyers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Buyer's Premium:</strong> {Math.round(CONFIG.bpPromo * 100)}% of winning bid 
                      (minimum ${CONFIG.bpMin}/lot) - standard in auction houses
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Card Processing:</strong> Up to {Math.round(CONFIG.cardPct * 100)}% for payment processing
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Shipping:</strong> Actual shipping costs (if applicable)
                    </span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">For Sellers</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Promo Period:</strong> {Math.round(CONFIG.sellerPromo * 100)}% seller fee - 
                      list and sell for free!
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>No Hidden Fees:</strong> What you see is what you get
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>
                      <strong>Fast Payouts:</strong> Receive funds quickly after sale
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="border-t pt-8 mt-8">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">What is a Buyer's Premium?</h3>
                <p className="text-sm text-muted-foreground">
                  A buyer's premium is a fee charged to the winning bidder, calculated as a percentage 
                  of the winning bid amount. This is standard practice in auction houses worldwide.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Why is there a minimum fee?</h3>
                <p className="text-sm text-muted-foreground">
                  The ${CONFIG.bpMin} minimum ensures we can cover basic operational costs for processing 
                  each transaction, regardless of the item value.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Are taxes included?</h3>
                <p className="text-sm text-muted-foreground">
                  No, taxes are calculated separately based on your location and will be added at checkout 
                  where applicable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}