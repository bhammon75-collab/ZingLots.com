import { Helmet } from "react-helmet-async";
import ZingNav from "@/components/ZingNav";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { DEMO_LOTS } from "@/data/demo";
import { getCategoryBySlugOrAlias, canonicalizeCategorySlug, getSlugForCategoryName } from "@/data/categories";
import LotCard from "@/components/LotCard";
import type { LotItem } from "@/components/LotCard";

const Category = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const canonicalSlug = canonicalizeCategorySlug(slug) || undefined;
  const cat = getCategoryBySlugOrAlias(slug || null) || undefined;
  const title = cat?.name ?? "Category";
  const sub = searchParams.get("sub") || undefined;
  const lots: LotItem[] = DEMO_LOTS.filter((l) => {
    const lotSlug = getSlugForCategoryName(l.category);
    return canonicalSlug ? lotSlug === canonicalSlug : false;
  });

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title} | ZingLots</title>
        <meta name="description" content={`Bid on ${title} lots on ZingLots.`} />
        <link rel="canonical" href={`/category/${canonicalSlug || slug || ''}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": `Auctions in ${title}`,
            "itemListElement": (lots ?? []).map((it: LotItem, i: number) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://www.zinglots.com/product/${it.id}`,
              "name": it.title
            }))
          })}
        </script>
      </Helmet>
      <ZingNav />
      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-2 text-muted-foreground">Browse active and upcoming lots.</p>
        {cat?.children?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {cat.children.map((child) => {
              const active = sub === child.slug;
              return (
                <Link
                  key={child.slug}
                  to={`/category/${cat.slug}?sub=${encodeURIComponent(child.slug)}`}
                  className={`px-3 py-1.5 rounded-full border text-sm ${active ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}
                >
                  {child.name}
                </Link>
              );
            })}
          </div>
        ) : null}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lots.map((item) => (
            <Link to={`/lot/${item.id}`} key={item.id} aria-label={item.title}>
              <LotCard item={item} />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Category;
