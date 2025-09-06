import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Disputes(){
  return (
    <main id="main" className="max-w-3xl mx-auto px-4 py-8">
      <Helmet>
        <title>Disputes & Issue Resolution | ZingLots</title>
        <meta name="description" content="How to open a dispute on ZingLots, what evidence to include, timelines, and possible outcomes." />
        <link rel="canonical" href="/legal/disputes" />
      </Helmet>

      <header className="mb-6">
        <h1 className="text-3xl font-bold">Disputes & Issue Resolution</h1>
        <p className="mt-2 text-gray-600 text-sm">Last updated: 2025-09-06 • Contact: <a className="underline" href="mailto:support@zinglots.com">support@zinglots.com</a></p>
      </header>

      <section className="prose prose-neutral max-w-none">
        <p>
          We aim to resolve issues quickly and fairly. Most problems are solved directly between buyer and seller. When needed, ZingLots will
          review evidence and make a decision.
        </p>

        <h2>When to open a dispute</h2>
        <ul>
          <li>Item is <strong>not as described</strong> (wrong model/specs, undisclosed damage).</li>
          <li>Item is <strong>DOA</strong> or materially defective and this was <strong>not disclosed</strong>.</li>
          <li><strong>Missing items</strong> from a listed lot.</li>
          <li><strong>Failed pickup</strong> due to seller no-show or refusal after payment.</li>
        </ul>
        <blockquote>
          <p><strong>Not eligible:</strong> buyer’s remorse, expected wear consistent with listing, late pickup by buyer, or issues disclosed in the description/photos.</p>
        </blockquote>

        <h2>Timelines</h2>
        <ul>
          <li><strong>Contact seller first</strong> within <strong>48 hours</strong> of pickup/delivery.</li>
          <li>If unresolved, <strong>open a dispute within 7 days</strong> of pickup/delivery.</li>
          <li>ZingLots reviews typical cases within <strong>3–5 business days</strong> after full evidence is received.</li>
        </ul>

        <h2>What to include (evidence)</h2>
        <ul>
          <li>Photos/video showing the issue (include <strong>serial numbers</strong> where applicable).</li>
          <li>The listing URL and lot number.</li>
          <li>Pickup/delivery proof (bill of lading, signed receipt, courier confirmation).</li>
          <li>Messages showing your attempt to resolve with the other party.</li>
        </ul>

        <h2>Possible outcomes</h2>
        <ul>
          <li><strong>Full refund</strong> (with return)</li>
          <li><strong>Partial refund</strong> (keep item)</li>
          <li><strong>No refund</strong> (insufficient evidence or condition matches listing)</li>
          <li><strong>Relist/credit</strong> by mutual agreement</li>
        </ul>
        <p>Refunds are issued by the original payment method when possible.</p>

        <h2>Non-payment & late pickup</h2>
        <p>
          <strong>Buyer non-payment</strong>: bids may be canceled, account restricted, and the lot relisted. Buyer’s premium may still be owed per Terms.
          <br />
          <strong>Late pickup</strong>: sellers may charge reasonable storage/handling fees if stated in the listing; chronic late pickups can lead to account limits.
        </p>

        <h2>Seller responsibilities</h2>
        <ul>
          <li>Accurately represent items (photos, specs, known defects).</li>
          <li>Be available for pickup within stated windows.</li>
          <li>Provide required paperwork (titles, manuals, keys) if promised.</li>
        </ul>

        <h2>Buyer responsibilities</h2>
        <ul>
          <li>Read the full listing and inspect on pickup when allowed.</li>
          <li>Bring appropriate transport, equipment, and personnel.</li>
          <li>Meet pickup deadlines communicated in the listing.</li>
        </ul>

        <h2>How we decide</h2>
        <p>
          ZingLots weighs listing accuracy, disclosed conditions, evidence quality, timing, and prior account history. Our decision may limit future access for abusive behavior.
        </p>
      </section>

      <aside className="mt-8 rounded-md border p-4 bg-gray-50">
        <p className="text-sm text-gray-700">
          Related: <Link className="underline" to="/help/non-payment-and-pickup">Non-payment & Pickup Deadlines</Link>
        </p>
      </aside>
    </main>
  );
}

