import { Helmet } from "react-helmet-async";

export default function Terms(){
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Terms | ZingLots</title>
        <meta name="description" content="ZingLots Terms and Marketplace Role" />
        <link rel="canonical" href="/terms" />
      </Helmet>
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-4">Terms</h1>
        <section className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-2">Marketplace Role</h2>
          <p className="text-sm text-muted-foreground">
            ZingLots operates as a listing and bidding platform only. We do not provide, arrange, broker, or guarantee transportation, packing, or storage services. All logistics are contracted between buyers and sellers at their sole discretion and risk.
          </p>
        </section>
      </main>
    </div>
  );
}