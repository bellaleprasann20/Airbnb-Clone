import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { IndianRupee } from 'lucide-react';

const PropertyMap = ({ properties = [], center }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // Use your MapTiler key from .env (rename the variable in .env to VITE_MAPTILER_KEY)
  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // "Basic-v2-Light" gives the exact Airbnb minimalist look
      style: `https://api.maptiler.com/maps/basic-v2-light/style.json?key=${maptilerKey}`,
      center: center ? [center.lng, center.lat] : [78.9629, 20.5937], // [lng, lat]
      zoom: properties.length > 0 ? 10 : 4,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
  }, [maptilerKey, center, properties.length]);

  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers if you want to refresh them
    const existingMarkers = document.querySelectorAll('.map-price-tag');
    existingMarkers.forEach(m => m.remove());

    properties.forEach((property) => {
      // Create custom HTML element for the price tag marker
      const el = document.createElement('div');
      el.className = 'map-price-tag';
      el.innerHTML = `₹${property.pricePerNight?.toLocaleString('en-IN')}`;

      // Create the marker
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([Number(property.location.lng), Number(property.location.lat)])
        .addTo(map.current);

      // Add click listener to show our own "InfoWindow" (Popup)
      el.addEventListener('click', () => {
        setSelectedProperty(property);
        map.current.flyTo({
          center: [property.location.lng, property.location.lat],
          zoom: 14,
          speed: 0.8
        });
      });
    });
  }, [properties]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-xl overflow-hidden border border-gray-200">
      <div ref={mapContainer} className="absolute inset-0" />

      {/* Custom Info Window Overlay (Cleaner than default popups) */}
      {selectedProperty && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 w-64 bg-white rounded-xl shadow-2xl border p-2 animate-in fade-in slide-in-from-bottom-5">
          <button 
            onClick={() => setSelectedProperty(null)}
            className="absolute -top-2 -right-2 bg-white border rounded-full p-1 shadow-md hover:bg-gray-100"
          >
            ✕
          </button>
          <img 
            src={selectedProperty.images?.[0]} 
            className="rounded-lg h-32 w-full object-cover mb-2" 
            alt="Property" 
          />
          <div className="px-1 pb-1">
            <p className="font-bold text-sm truncate text-gray-900">{selectedProperty.title}</p>
            <p className="text-xs text-gray-600 flex items-center mt-1">
              <IndianRupee size={12} className="mr-0.5" /> 
              <span className="font-bold text-gray-900">{selectedProperty.pricePerNight}</span> / night
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyMap;