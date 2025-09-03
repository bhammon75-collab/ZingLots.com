import { Helmet } from "react-helmet-async";

export default function Privacy(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Privacy Policy | ZingLots</title>
      </Helmet>
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-gray-700">We only collect data needed to operate auctions and improve the product.</p>
      <p className="mt-2 text-gray-700">We do not sell personal data. Card details never touch our servers.</p>
    </main>
  );
}

