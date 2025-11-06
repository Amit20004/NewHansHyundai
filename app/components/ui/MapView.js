'use client'
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// interface Location {
//   id: string;
//   name: string;
//   type: 'sales' | 'service';
//   coordinates: [number, number];
//   address: string;
//   phone: string;
//   hours: string;
// }

// interface MapViewProps {
//   locations: Location[];
//   selectedType?: 'sales' | 'service' | 'all';
// }

const MapView = ({ locations, selectedType = 'all' }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // For demo purposes, using a placeholder token - users should replace with their own
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN_HERE';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-74.006, 40.7128], // Default to NYC
      zoom: 10,
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Filter locations based on selected type
    const filteredLocations = selectedType === 'all' 
      ? locations 
      : locations.filter(loc => loc.type === selectedType);

    // Add markers for filtered locations
    filteredLocations.forEach(location => {
      const el = document.createElement('div');
      el.className = `w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer ${
        location.type === 'sales' ? 'bg-automotive-blue' : 'bg-automotive-accent'
      }`;

      const marker = new mapboxgl.Marker(el)
        .setLngLat(location.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-automotive-dark">${location.name}</h3>
              <p class="text-sm text-gray-600 mt-1">${location.address}</p>
              <p class="text-sm text-gray-600">${location.phone}</p>
              <p class="text-sm text-gray-600">${location.hours}</p>
            </div>
          `)
        )
        .addTo(map.current);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (filteredLocations.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      filteredLocations.forEach(location => {
        bounds.extend(location.coordinates);
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [locations, selectedType]);

  return (
    <div className="relative w-full h-96 bg-gray-400  overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2  shadow-lg">
        <p className="text-sm text-automotive-dark font-medium">
          Please replace with your Mapbox token
        </p>
      </div>
    </div>
  );
};

export default MapView;