import { Helmet } from "react-helmet-async";

export default function LiveAuctions(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Live Auctions | ZingLots</title>
        <meta name="description" content="Bids are server-timestamped for fairness. If video lags, your bid time will not." />
      </Helmet>
      <h1 className="text-2xl font-bold">Live Auctions</h1>
      <p className="mt-3 text-gray-700">Bids are server-timestamped for fairness. If video lags, your bid time will not.</p>
      <p className="mt-2 text-gray-700">When bids arrive within the anti-snipe window, closing may extend to keep the auction fair.</p>
    </main>
  );
}

