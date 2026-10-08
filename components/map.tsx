"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

/** Satellite map (Esri World Imagery) pointed at Politecnico di Milano. */
export function SatelliteMap() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: { remove: () => void } | null = null;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !ref.current) return;
      const m = L.map(ref.current, {
        center: [45.4784, 9.2272],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: true,
      });
      m.attributionControl.setPrefix(false);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 19, attribution: "© Esri" }
      ).addTo(m);
      L.marker([45.4784, 9.2272], {
        icon: L.divIcon({
          className: "",
          html: '<div style="width:14px;height:14px;border-radius:9999px;background:#00a3ff;border:3px solid #fff;box-shadow:0 0 12px rgba(0,163,255,0.9)"></div>',
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
      })
        .addTo(m)
        .bindPopup("Politecnico di Milano — Campus Leonardo");
      map = m;
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 z-0" />;
}
