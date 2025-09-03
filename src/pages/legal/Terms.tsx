import { Helmet } from "react-helmet-async";

export default function Terms(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Terms of Service | ZingLots</title>
      </Helmet>
      <h1 className="text-2xl font-bold">Terms of Service</h1>
      <p className="mt-3 text-gray-700">These terms govern participation in auctions on ZingLots.com.</p>
      <p className="mt-2 text-gray-700">By using the platform, you agree to bidding rules, payment timelines, and pickup logistics set by sellers.</p>
    </main>
  );
}

