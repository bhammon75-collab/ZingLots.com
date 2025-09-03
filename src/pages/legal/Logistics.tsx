import { Helmet } from "react-helmet-async";

export default function Logistics(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Logistics | ZingLots</title>
      </Helmet>
      <h1 className="text-2xl font-bold">Logistics</h1>
      <p className="mt-3 text-gray-700">Pickup/shipping is arranged directly between buyer and seller.</p>
      <p className="mt-2 text-gray-700">Sellers provide pickup windows and addresses; buyers coordinate transport as needed.</p>
    </main>
  );
}

