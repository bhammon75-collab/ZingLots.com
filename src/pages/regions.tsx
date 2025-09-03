import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getStates, groupByLetter, type StateInfo } from "@/lib/regions";
import { getRegionMetrics, type RegionMetrics } from "@/lib/regionsMetrics";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { analytics } from "@/lib/analytics";

const Regions = () => {
  const [email, setEmail] = useState("");
  const states = useMemo(() => getStates(), []);
  const grouped = useMemo(() => groupByLetter(states), [states]);
  const letters = useMemo(() => Object.keys(grouped).sort(), [grouped]);
  const metrics = useMemo<RegionMetrics | null>(() => getRegionMetrics(), []);

  const siteKey = (import.meta as any)?.env?.VITE_HCAPTCHA_SITE_KEY as string | undefined;
  const [token, setToken] = useState<string | null>(null);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = /.+@.+\..+/.test(email);
    if (!valid) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (siteKey && !token) {
      toast.error("Please complete the captcha");
      return;
    }
    try {
      const res = await fetch("/functions/v1/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token }),
      });
      if (!res.ok) throw new Error("Request failed");
      const body = await res.json();
      if (body?.ok) {
        toast.success("You're on the list. We'll email you when we launch nearby.");
        analytics.track({ category: 'Engagement', action: 'waitlist_submit', label: email });
        setEmail("");
        setToken(null);
      } else throw new Error("Bad response");
    } catch {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>All Regions | ZingLots</title>
        <meta name="description" content="Browse all supported ZingLots regions and find surplus near you." />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Surplus Auctions Near You</h1>
          <p className="text-gray-600 mt-2">Browse business equipment in major US markets.</p>
        </header>

        {/* Optional metrics bar */}
        {metrics && (
          <div className="mb-4 rounded-xl border bg-white p-4 flex flex-wrap items-center gap-4 text-sm">
            <div><span className="font-semibold">{metrics.totalAuctions.toLocaleString()}</span> auctions</div>
            <div className="opacity-50">•</div>
            <div><span className="font-semibold">{metrics.markets.toLocaleString()}</span> markets</div>
            <div className="opacity-50">•</div>
            <div><span className="font-semibold">{metrics.businesses.toLocaleString()}</span> businesses</div>
            <span className="ml-auto inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700">Updated hourly</span>
          </div>
        )}

        {/* Sticky A–Z bar */}
        <div className="sticky top-0 z-10 bg-gray-50 py-2">
          <div className="flex flex-wrap gap-2 text-sm">
            {letters.map((ltr) => (
              <a key={ltr} href={`#group-${ltr}`} className="text-gray-600 hover:text-gray-900 underline-offset-2 hover:underline">
                {ltr}
              </a>
            ))}
          </div>
        </div>

        {/* Grouped states */}
        <div className="mt-4 space-y-8">
          {letters.map((ltr) => (
            <section key={ltr} id={`group-${ltr}`} aria-labelledby={`heading-${ltr}`}>
              <h2 id={`heading-${ltr}`} className="mb-3 text-xl font-semibold text-gray-900">{ltr}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped[ltr].map((s: StateInfo) => (
                  <Link
                    key={s.code}
                    to={`/state/${s.code.toLowerCase()}`}
                    className="block rounded-xl border p-5 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
                  >
                    <div className="text-lg font-semibold">{s.name}</div>
                    {typeof s.markets === "number" && typeof s.auctions === "number" ? (
                      <div className="text-neutral-700 text-sm mt-1">{s.markets} markets • {s.auctions} active</div>
                    ) : (
                      <div className="text-neutral-500 text-sm mt-1">Explore markets</div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Waitlist form */}
        <section className="mt-10 rounded-xl border bg-white p-5">
          <h3 className="text-lg font-semibold">Get notified when we launch your region</h3>
          <p className="text-sm text-gray-600 mb-3">We’ll only email about regional launches. Unsubscribe anytime.</p>
          <form onSubmit={handleWaitlist} className="flex flex-col sm:flex-row gap-3">
            <Input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" required aria-label="Email address" />
            <Button type="submit" className="bg-red-600 text-white hover:bg-red-700">Join Waitlist</Button>
          </form>
          {siteKey && (
            <div className="mt-3">
              {/* Minimal hCaptcha widget placeholder: integrate real widget in production */}
              <button type="button" className="rounded border px-3 py-1 text-sm" onClick={()=>setToken(Math.random().toString(36).slice(2))} aria-label="Simulate captcha">
                I'm not a robot (simulate)
              </button>
              {token && <span className="ml-2 text-xs text-green-600">verified</span>}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Regions;

