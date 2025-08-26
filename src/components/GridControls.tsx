import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ---------- Types ----------
export type SortKey = "endingSoon" | "newest" | "priceAsc" | "priceDesc";

export type Filters = {
  categoryIds?: string[];         // multi-select by id
  radiusMiles?: number | "any";   // Any | 25 | 50 | 100 | 250
  shippingOffered?: boolean | null; // null => any, true => only listings where seller offers shipping
  pickupPreferred?: boolean | null; // null => any, true => only listings where seller prefers pickup
  priceMin?: number | null;
  priceMax?: number | null;
  shippingNotes?: string;         // free-text search within seller shipping notes
};

export type CategoryOption = { id: string; label: string };

type Props = {
  sort: SortKey;
  onSortChange: (k: SortKey) => void;
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  categories?: CategoryOption[];  // supply your real categories
  className?: string;
  offsetTop?: number;             // sticky offset in px (header height). Default 64.
};

export default function GridControls({
  sort,
  onSortChange,
  filters,
  onFiltersChange,
  categories = [],
  className,
  offsetTop = 64,
}: Props) {
  const [open, setOpen] = useState(false);

  // Keep a draft while drawer is open; apply on "Apply Filters"
  const [draft, setDraft] = useState<Filters>(filters);
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.label));
    return map;
  }, [categories]);

  function toggleCategory(id: string) {
    setDraft((d) => {
      const next = new Set(d.categoryIds ?? []);
      next.has(id) ? next.delete(id) : next.add(id);
      return { ...d, categoryIds: Array.from(next) };
    });
  }

  function applyFilters() {
    // Coerce any empty strings to undefined; clamp price bounds
    const clean: Filters = {
      ...draft,
      shippingNotes: draft.shippingNotes?.trim() ? draft.shippingNotes.trim() : undefined,
      priceMin:
        draft.priceMin !== null && draft.priceMin !== undefined && !Number.isNaN(draft.priceMin)
          ? Math.max(0, draft.priceMin)
          : null,
      priceMax:
        draft.priceMax !== null && draft.priceMax !== undefined && !Number.isNaN(draft.priceMax)
          ? Math.max(0, draft.priceMax)
          : null,
    };
    onFiltersChange(clean);
    setOpen(false);
  }

  function resetFilters() {
    const blank: Filters = {
      categoryIds: [],
      radiusMiles: "any",
      shippingOffered: null,
      pickupPreferred: null,
      priceMin: null,
      priceMax: null,
      shippingNotes: "",
    };
    setDraft(blank);
    onFiltersChange(blank);
    setOpen(false);
  }

  return (
    <div
      className={cn(
        "sticky z-40 bg-white/90 backdrop-blur border-b border-slate-200",
        className
      )}
      style={{ top: offsetTop }}
      role="region"
      aria-label="Sorting and filters"
    >
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor="sort-select">
            Sort results
          </label>
          <Select defaultValue={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
            <SelectTrigger id="sort-select" className="w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="endingSoon">Ending soon</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="priceAsc">Price ↑</SelectItem>
              <SelectItem value="priceDesc">Price ↓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filters (drawer on mobile/desktop) */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="min-w-24">Filters</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>

            <div className="space-y-6 py-4">
              {/* Categories (multi) */}
              <section>
                <div className="text-sm font-medium mb-2">Category</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {categories.length === 0 && (
                    <div className="text-sm text-slate-500">No categories available</div>
                  )}
                  {categories.map((cat) => {
                    const checked = (draft.categoryIds ?? []).includes(cat.id);
                    return (
                      <label
                        key={cat.id}
                        className={cn(
                          "flex items-center gap-2 rounded-lg border px-3 py-2 cursor-pointer",
                          checked ? "border-slate-900" : "border-slate-300 hover:border-slate-400"
                        )}
                      >
                        <input
                          type="checkbox"
                          className="h-4 w-4"
                          checked={checked}
                          onChange={() => toggleCategory(cat.id)}
                        />
                        <span className="text-sm">{cat.label}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* Location radius */}
              <section>
                <label htmlFor="radius" className="text-sm font-medium mb-2 block">
                  Location radius
                </label>
                <select
                  id="radius"
                  className="w-full h-10 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  value={String(draft.radiusMiles ?? "any")}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDraft((d) => ({
                      ...d,
                      radiusMiles: v === "any" ? "any" : Number(v),
                    }));
                  }}
                >
                  <option value="any">Any</option>
                  <option value="25">≤ 25 miles</option>
                  <option value="50">≤ 50 miles</option>
                  <option value="100">≤ 100 miles</option>
                  <option value="250">≤ 250 miles</option>
                </select>
              </section>

              {/* Seller logistics flags */}
              <section>
                <div className="text-sm font-medium mb-2">Seller logistics (as stated by seller)</div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!draft.shippingOffered}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, shippingOffered: e.target.checked ? true : null }))
                      }
                    />
                    <span className="text-sm">Shipping offered by seller</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4"
                      checked={!!draft.pickupPreferred}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, pickupPreferred: e.target.checked ? true : null }))
                      }
                    />
                    <span className="text-sm">Pickup preferred</span>
                  </label>
                </div>
              </section>

              {/* Price range */}
              <section>
                <div className="text-sm font-medium mb-2">Price range</div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label htmlFor="priceMin" className="sr-only">Min price</label>
                    <input
                      id="priceMin"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="$ min"
                      className="w-full h-10 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      value={draft.priceMin ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          priceMin: e.target.value === "" ? null : Number(e.target.value.replace(/[\^\d]/g, "")),
                        }))
                      }
                    />
                  </div>
                  <div className="flex-1">
                    <label htmlFor="priceMax" className="sr-only">Max price</label>
                    <input
                      id="priceMax"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="$ max"
                      className="w-full h-10 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      value={draft.priceMax ?? ""}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          priceMax: e.target.value === "" ? null : Number(e.target.value.replace(/[^\d]/g, "")),
                        }))
                      }
                    />
                  </div>
                </div>
              </section>

              {/* Shipping notes */}
              <section>
                <label htmlFor="shippingNotes" className="text-sm font-medium mb-2 block">
                  Shipping notes (keyword)
                </label>
                <input
                  id="shippingNotes"
                  placeholder="e.g., palletized, liftgate, freight, UPS"
                  className="w-full h-10 rounded-lg border border-slate-300 px-3 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  value={draft.shippingNotes ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, shippingNotes: e.target.value }))}
                />
              </section>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button className="flex-1" onClick={applyFilters}>
                  Apply Filters
                </Button>
                <Button type="button" variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Subtitle (context, NOT legal) */}
      <div className="mx-auto max-w-7xl px-4 pb-3 -mt-1">
        <p className="text-xs text-slate-600">
          Business marketplace. Use Sort and Filters to find what you need quickly.
        </p>
      </div>
    </div>
  );
}