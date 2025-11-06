'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LocationCard from '../../components/ui/LocationCard';
import MapView from '../../components/ui/MapView';
import { Car, Wrench, MapPin } from 'lucide-react';
import ResponsiveBanner from '../../components/banner/ResponsiveBanner';

type Location = {
  id: string;
  name: string;
  type: 'sales' | 'service';
  coordinates: [number, number];
  address: string;
  phone: string;
  hours: string;
};

const Locations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'sales' | 'service'>('all');

  useEffect(() => {
axios.get('http://localhost:8000/api/locations')
  .then(response => {
    if(response.data.success) {
      const mappedLocations = response.data.data.map((loc) => ({
        ...loc,
        coordinates: [loc.longitude, loc.latitude], // make sure order is [lng, lat] if your Map expects it
      }));
      setLocations(mappedLocations);
    } else {
      setError('Failed to load locations');
    }
    setLoading(false);
  })
  .catch(() => {
    setError('Failed to fetch locations');
    setLoading(false);
  });


  }, []);

  const salesLocations = locations.filter(loc => loc.type === 'sales');
  const serviceLocations = locations.filter(loc => loc.type === 'service');

  if (loading) return <div className="p-8 text-center">Loading locations...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  return (
    <>
      <ResponsiveBanner />
      <div className="bg-background mx-auto max-w-[1400px] w-full">

        {/* Tabs Navigation */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-2 bg-automotive-silver overflow-hidden mb-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all ${
                activeTab === 'all' ? 'bg-[#00408F] text-white' : 'bg-gray-200 text-automotive-dark'
              }`}
            >
              <MapPin className="w-4 h-4" />
              All Locations
            </button>
            <button
              onClick={() => setActiveTab('sales')}
              className={`py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all ${
                activeTab === 'sales' ? 'bg-[#00408F] text-white' : 'bg-gray-200 text-automotive-dark'
              }`}
            >
              <Car className="w-4 h-4" />
              Sales Centers
            </button>
            <button
              onClick={() => setActiveTab('service')}
              className={`py-3 px-4 flex items-center justify-center gap-2 font-medium transition-all ${
                activeTab === 'service' ? 'bg-[#00408F] text-white' : 'bg-gray-200 text-automotive-dark'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Service Centers
            </button>
          </div>

          {/* Map Section */}
          <div className="mb-12">
            <h2 className="!text-2xl font-semibold text-automotive-dark mb-6">Find Us on the Map</h2>
            <MapView
              locations={locations}
              selectedType={activeTab}
            />
          </div>

          {/* Tab Content */}
          {activeTab === 'all' && (
            <div className="space-y-12">
              <div>
                <h3 className="!text-xl font-semibold text-automotive-dark mb-4 flex items-center gap-2">
                  <Car className="w-5 h-5 text-automotive-blue" />
                  Sales Centers
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {salesLocations.map(location => (
                    <LocationCard key={location.id} {...location} type='sales' />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="!text-xl font-semibold text-automotive-dark mb-4 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-automotive-accent" />
                  Service Centers
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {serviceLocations.map(location => (
                    <LocationCard key={location.id} {...location} type='services' />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="grid md:grid-cols-2 gap-6">
              {salesLocations.map(location => (
                <LocationCard key={location.id} {...location} type='sales' />
              ))}
            </div>
          )}

          {activeTab === 'service' && (
            <div className="grid md:grid-cols-2 gap-6">
              {serviceLocations.map(location => (
                <LocationCard key={location.id} {...location} type='services' />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Locations;
