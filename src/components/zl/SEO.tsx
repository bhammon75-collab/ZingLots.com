import { Helmet } from 'react-helmet-async';

export function SEO({
  title,
  description,
  canonical,
  jsonLd,
}: {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: object;
}) {
  const json = jsonLd ? JSON.stringify(jsonLd) : null;
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {json && <script type="application/ld+json">{json}</script>}
    </Helmet>
  );
}