import LotCard from "@/components/zl/LotCard";
import LotGrid from "@/components/zl/LotGrid";
import { AuctionHeader } from "@/components/zl/AuctionHeader";
import { SEO } from "@/components/zl/SEO";

export default function AuctionsPage() {
  // Mock data for demonstration
  const lots = [
    {
      id: "1",
      image: "/placeholder.svg",
      title: "Professional Power Tools Collection",
      location: "Seattle, WA",
      currentBid: 125,
      bidCount: 8,
      endsInHuman: "2h 45m"
    },
    {
      id: "2",
      image: "/placeholder.svg",
      title: "Vintage Office Furniture Set",
      location: "Portland, OR",
      currentBid: 89,
      bidCount: 3,
      endsInHuman: "1d 12h"
    },
    {
      id: "3", 
      image: "/placeholder.svg",
      title: "Restaurant Equipment Lot",
      location: "Tacoma, WA",
      currentBid: 350,
      bidCount: 15,
      endsInHuman: "4h 20m"
    }
  ];

  // Prepare JSON-LD data for SEO
  const jsonLdItems = lots.map((lot, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "url": `https://www.zinglots.com/lots/${lot.id}`,
    "name": lot.title
  }));

  return (
    <>
      <SEO 
        title="All Auctions | ZingLots" 
        description="Browse active auctions. Bid on tools, equipment, and more with transparent pricing and local pickup."
        canonical="https://www.zinglots.com/auctions"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": jsonLdItems
        }}
      />
      <AuctionHeader title="All Auctions" />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <LotGrid>
          {lots.map(lot => (
            <LotCard
              key={lot.id}
              image={lot.image}
              title={lot.title}
              location={lot.location}
              currentBid={`$${lot.currentBid}`}
              bids={lot.bidCount}
              endsIn={lot.endsInHuman}
            />
          ))}
        </LotGrid>
      </main>
    </>
  );
}