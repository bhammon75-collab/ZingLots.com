import { Helmet } from "react-helmet-async";

export default function Payments(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Payments | ZingLots</title>
        <meta name="description" content="Card payments via Stripe. PCI DSS compliant. We never store card data." />
      </Helmet>
      <h1 className="text-2xl font-bold">Payments</h1>
      <p className="mt-3 text-gray-700">Card payments via Stripe. PCI DSS compliant. We never store card data.</p>
      <p className="mt-2 text-gray-700">Invoices and receipts are provided for every transaction. Disputes are handled promptly.</p>
    </main>
  );
}

