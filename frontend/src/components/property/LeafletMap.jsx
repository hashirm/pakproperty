'use client';

import React, { useEffect, useRef } from 'react';

export const LeafletMap = ({
  properties = [],
  center = [31.5204, 74.3587],
  zoom = 6,
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      const L = (await import('leaflet')).default;

      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!isMounted || !mapContainerRef.current) return;

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const initialCenter =
        properties.length > 0 && properties[0].location?.coordinates
          ? [properties[0].location.coordinates.lat, properties[0].location.coordinates.lng]
          : center;

      const map = L.map(mapContainerRef.current).setView(initialCenter, zoom);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      const markersGroup = L.featureGroup();

      properties.forEach((prop) => {
        if (prop.location?.coordinates?.lat && prop.location?.coordinates?.lng) {
          const priceLabel = prop.displayPrice || `PKR ${prop.price.toLocaleString()}`;
          const propIcon = L.divIcon({
            className: 'price-pin',
            html: `<div style="
              background-color: ${prop.purpose === 'sale' ? '#059669' : '#2563eb'};
              color: white;
              padding: 4px 8px;
              border-radius: 8px;
              font-weight: 800;
              font-size: 11px;
              box-shadow: 0 4px 10px rgba(0,0,0,0.3);
              border: 2px solid white;
              white-space: nowrap;
              cursor: pointer;
            ">${priceLabel}</div>`,
            iconSize: [90, 30],
            iconAnchor: [45, 15],
          });

          const marker = L.marker(
            [prop.location.coordinates.lat, prop.location.coordinates.lng],
            { icon: propIcon }
          );

          marker.bindPopup(`
            <div style="font-family: sans-serif; width: 200px; padding: 4px;">
              <img src="${prop.featuredImage || prop.images?.[0]?.url}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 6px; margin-bottom: 6px;" />
              <div style="font-weight: 800; color: #059669; font-size: 14px; margin-bottom: 2px;">${priceLabel}</div>
              <div style="font-weight: 700; color: #1e293b; font-size: 12px; margin-bottom: 4px; line-height: 1.2;">${prop.title}</div>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">📍 ${prop.location.area}, ${prop.location.city}</div>
              <a href="/property/${prop._id}" style="display: block; text-align: center; background: #059669; color: white; padding: 4px 8px; border-radius: 6px; text-decoration: none; font-size: 11px; font-weight: bold;">View Details</a>
            </div>
          `);

          marker.addTo(markersGroup);
        }
      });

      markersGroup.addTo(map);

      if (properties.length > 1 && markersGroup.getLayers().length > 0) {
        map.fitBounds(markersGroup.getBounds().pad(0.1));
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, center, zoom]);

  return (
    <div className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
};
