import { Helmet } from "react-helmet-async";

export default function Disputes(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Disputes | ZingLots</title>
      </Helmet>
      <h1 className="text-2xl font-bold">Disputes</h1>
      <p className="mt-3 text-gray-700">If an issue arises, contact the seller first. Most issues resolve quickly.</p>
      <p className="mt-2 text-gray-700">If you need help, our team can review bid history and payment records.</p>
    </main>
  );
}

