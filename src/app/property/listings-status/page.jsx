"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

const STATUS = {
  pending: {
    label: "Pending Verification",
    tone: "text-amber-500 border-amber-500 bg-amber-500/10",
    help: "Admin is reviewing the listing details and photos.",
  },
  verified: {
    label: "Approved & Live",
    tone: "text-green-500 border-green-500 bg-green-500/10",
    help: "This property is now visible to buyers or tenants.",
  },
  rejected: {
    label: "Rejected",
    tone: "text-red-500 border-red-500 bg-red-500/10",
    help: "This listing was not approved. Contact support before submitting again.",
  },
};

export default function ListingStatusPage() {
  const [dark, setDark] = useState(true);
  const [tracking, setTracking] = useState("");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [hasUserToken, setHasUserToken] = useState(false);

  const fetchListings = useCallback(async (nextTracking = "") => {
    setLoading(true);
    setLoaded(false);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({ mine: "true" });
      if (nextTracking.trim()) params.set("tracking", nextTracking.trim());

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/properties?${params.toString()}`, { headers, cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setListings(data.data || []);
      } else {
        setListings([]);
        setError(data.error || "Could not load listing status.");
      }
    } catch {
      setListings([]);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const sync = () => setDark(html.classList.contains("dark-mode"));
    const obs = new MutationObserver(sync);
    obs.observe(html, { attributes: true, attributeFilter: ["class"] });
    sync();

    const params = new URLSearchParams(window.location.search);
    const trackingParam = params.get("tracking") || "";
    const token = localStorage.getItem("token");
    setHasUserToken(Boolean(token));
    if (trackingParam) {
      setTracking(trackingParam);
      fetchListings(trackingParam);
    } else if (token) {
      fetchListings("");
    }

    return () => obs.disconnect();
  }, [fetchListings]);

  const bg = dark ? "bg-black text-white" : "bg-zinc-50 text-zinc-900";
  const card = dark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200";
  const muted = dark ? "text-zinc-500" : "text-zinc-400";
  const input = dark ? "bg-zinc-900 border-zinc-700 text-white placeholder-zinc-600" : "bg-white border-zinc-300 text-zinc-900 placeholder-zinc-400";

  return (
    <main className={`min-h-screen font-serif ${bg}`}>
      <section className={`pt-24 pb-10 px-4 border-b ${dark ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-100"}`}>
        <div className="max-w-4xl mx-auto">
          <p className="text-[var(--brand-blue)] text-[9px] font-black uppercase tracking-[0.45em] mb-2">Property Listing Status</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Track Your Property</h1>
          <p className={`mt-3 text-xs max-w-xl leading-relaxed ${muted}`}>
            Check whether your submitted sale or rental property is pending, approved, or rejected.
          </p>
        </div>
      </section>

      <section className="px-4 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className={`border p-5 ${card}`}>
            <label className={`block text-[9px] font-black uppercase tracking-widest mb-2 ${muted}`}>Tracking ID</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className={`flex-1 px-4 py-3 border text-sm outline-none ${input}`}
                placeholder="PROP-..."
                value={tracking}
                onChange={(e) => setTracking(e.target.value.toUpperCase())}
              />
              <button
                onClick={() => fetchListings(tracking)}
                disabled={loading || (!tracking.trim() && !hasUserToken)}
                className="px-6 py-3 bg-[var(--brand-blue)] text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
              >
                {loading ? "Checking..." : hasUserToken && !tracking.trim() ? "Load My Listings" : "Check Status"}
              </button>
            </div>
            {hasUserToken && (
              <p className={`mt-3 text-[10px] font-bold ${muted}`}>
                Signed-in users can leave Tracking ID empty to load listings submitted from their account.
              </p>
            )}
            {error && <p className="mt-3 text-xs font-bold text-red-500">{error}</p>}
          </div>

          {loaded && listings.length === 0 && !error && (
            <div className={`border p-8 text-center ${card}`}>
              <p className={`text-xs font-black uppercase tracking-widest ${muted}`}>No listings found for this tracking id.</p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {listings.map((property) => {
              const status = STATUS[property.status] || STATUS.pending;
              const cover = Array.isArray(property.images) && property.images.length ? property.images[0] : "/placeholder.jpg";
              return (
                <article key={property.id} className={`border overflow-hidden ${card}`}>
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr]">
                    <img src={cover} alt="" className="h-44 md:h-full w-full object-cover" onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }} />
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className={`text-[9px] font-black uppercase tracking-widest ${muted}`}>Tracking ID: {property.tracking_token}</p>
                          <h2 className="mt-1 text-lg font-black uppercase tracking-tight">{property.title}</h2>
                          <p className={`mt-1 text-xs font-bold ${muted}`}>{property.location} · {property.listing_type === "rent" ? "Rent" : "Sale"}</p>
                        </div>
                        <span className={`px-3 py-1 border text-[9px] font-black uppercase tracking-widest ${status.tone}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className={`mt-4 text-xs leading-relaxed ${muted}`}>{status.help}</p>
                      <div className={`mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[10px] ${muted}`}>
                        <p><span className="font-black uppercase">Price</span><br />₹{property.price}</p>
                        <p><span className="font-black uppercase">Type</span><br />{property.type}</p>
                        <p><span className="font-black uppercase">Submitted</span><br />{new Date(property.created_at).toLocaleDateString("en-IN")}</p>
                        <p><span className="font-black uppercase">Updated</span><br />{new Date(property.updated_at || property.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      {property.status === "verified" && (
                        <Link href={`/property/details/${property.id}`} className="inline-block mt-5 px-4 py-2 bg-[var(--brand-blue)] text-black text-[9px] font-black uppercase tracking-widest">
                          View Live Listing
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
