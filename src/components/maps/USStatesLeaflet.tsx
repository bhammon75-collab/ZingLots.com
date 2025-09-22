import { memo, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FIPS_TO_STATE } from "@/lib/stateFips";

// Lazy import of react-leaflet to avoid SSR issues and large bundle on first paint
let MapContainer: any, TileLayer: any, GeoJSONLayer: any;
const ensureLeaflet = async () => {
  if (!MapContainer) {
    const mod = await import("react-leaflet");
    MapContainer = mod.MapContainer;
    TileLayer = mod.TileLayer;
    GeoJSONLayer = mod.GeoJSON;
  }
};

// CSS is imported globally in main.tsx

type USStatesLeafletProps = {
  className?: string;
};

export default memo(function USStatesLeaflet({ className }: USStatesLeafletProps) {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [usStates, setUsStates] = useState<any | null>(null);

  useEffect(() => {
    let cancelled = false;
    ensureLeaflet().then(() => {
      if (!cancelled) setReady(true);
    });
    // Load TopoJSON and convert to GeoJSON
    (async () => {
      try {
        const topojson: any = await import("topojson-client");
        const { default: states } = await import("us-atlas/states-10m.json");
        const geo = topojson.feature(states, states.objects.states);
        // Enrich properties with name and postal from FIPS
        if (geo && geo.type === "FeatureCollection") {
          for (const f of geo.features as any[]) {
            const fips = String(f?.id || f?.properties?.STATEFP || "").padStart(2, "0");
            const meta = FIPS_TO_STATE[fips];
            if (meta) {
              f.properties = {
                ...f.properties,
                name: meta.name,
                postal: meta.code,
              };
            }
          }
        }
        if (!cancelled) setUsStates(geo as any);
      } catch (e) {
        // Silently fail and leave null; parent can decide fallback UI
        console.error("Failed to load US states map data", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const bounds = useMemo(() => {
    // Continental US bounds with padding; Leaflet lat/lng
    return [[24.396308, -124.848974], [49.384358, -66.885444]] as any; // [southWest, northEast]
  }, []);

  const onEachFeature = (_feature: any, layer: any) => {
    const props: any = _feature?.properties || {};
    const name: string = props?.name || props?.NAME || "";
    const code: string = props?.postal || props?.STUSPS || props?.abbr || "";
    const codeLower = (code || name).toString().toLowerCase();
    layer.on({
      click: () => {
        const slugFromName = (name || codeLower).toString().toLowerCase().replace(/\s+/g, "-");
        navigate(`/state/${slugFromName}`);
      },
      mouseover: (e: any) => {
        e.target.setStyle({ weight: 2, color: "#2563eb", fillOpacity: 0.25 });
      },
      mouseout: (e: any) => {
        e.target.setStyle({ weight: 1, color: "#9ca3af", fillOpacity: 0.15 });
      },
    });
    if (name) {
      layer.bindTooltip(name, { sticky: true, opacity: 0.9, direction: "center" });
    }
  };

  if (!ready || !usStates) {
    return (
      <div className={"w-full h-96 rounded-xl border bg-white flex items-center justify-center " + (className || "")}>
        <div className="text-sm text-gray-500">Loading map…</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer bounds={bounds} className="w-full h-96 rounded-xl border overflow-hidden">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <GeoJSONLayer
          data={usStates}
          style={() => ({ color: "#9ca3af", weight: 1, fillColor: "#60a5fa", fillOpacity: 0.15 })}
          onEachFeature={onEachFeature}
        />
      </MapContainer>
    </div>
  );
});

