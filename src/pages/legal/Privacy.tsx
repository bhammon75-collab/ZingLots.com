import { Helmet } from "react-helmet-async";

export default function Privacy(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Privacy Policy | ZingLots</title>
      </Helmet>
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <p className="mt-3 text-gray-700">We only collect data needed to operate auctions and improve the product. We do not sell personal data. Card details never touch our servers.</p>
      <h2 className="mt-6 font-semibold text-lg">Analytics</h2>
      <p className="mt-2 text-gray-700">We use privacy-friendly analytics to understand feature usage. You can opt out at any time by declining cookies in the consent bar. When declined, analytics are disabled.</p>
      <h2 className="mt-6 font-semibold text-lg">Your Choices</h2>
      <ul className="list-disc pl-5 text-gray-700 mt-2">
        <li>Use the cookie bar to Accept or Decline analytics.</li>
        <li>Contact support to request data export or deletion.</li>
      </ul>
    </main>
  );
}

