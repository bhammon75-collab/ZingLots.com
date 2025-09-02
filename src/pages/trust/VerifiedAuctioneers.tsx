import { Helmet } from "react-helmet-async";

export default function VerifiedAuctioneers(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Verified Auctioneers | ZingLots</title>
        <meta name="description" content="All auctions are managed by verified businesses with proven track records." />
      </Helmet>
      <h1 className="text-2xl font-bold">Verified Auctioneers</h1>
      <p className="mt-3 text-gray-700">All auctions are managed by verified businesses with proven track records.</p>
      <p className="mt-2 text-gray-700">We review seller identity, business history, and compliance to keep bidding fair and transparent.</p>
    </main>
  );
}

