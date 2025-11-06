'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Facility {
  icon: string;
  name: string;
}

interface LocationData {
  page_heading: string;
  page_content: string;
  main_image: string;
  address: string;
  hours: string;
  contact: string;
  facilities: Facility[];
  gallery_images: string[];
  map_url: string;
  type:string;
}

const Location = () => {
  const params = useParams<{ type: string; slug: string }>();
const type = params?.type;
const slug = params?.slug;


  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    setLoading(true);
    setError(null);
axios.get(`http://localhost:8000/api/detailed-locations/${type}/${slug}`)
  .then(res => {
    if (res.data && res.data.success) {
      setLocationData(res.data.data); // ✅ only assign the location object
    } else {
      setError('No location data found.');
    }
    setLoading(false);
  })
  .catch(() => {
    setError('Failed to fetch location data');
    setLoading(false);
  });

  }, [slug]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!locationData) return <p className="text-center mt-10">Location not found</p>;

  const {
    page_heading,
    page_content,
    main_image,
    address,
    hours,
    contact,
    facilities,
    gallery_images,
    map_url
  } = locationData;

  if (
    !page_heading || !page_content || !main_image || !address || !hours || !contact ||
    !facilities || !gallery_images || !map_url
  ) {
    return <p className="text-center mt-10">Incomplete location data</p>;
  }

  return (
    <>
      {/* <ResponsiveBanner /> */}
      <div className="w-full mx-auto max-w-[1400px] bg-gray-50">

        {/* Header Section */}
        <section className="relative text-white sm:py-16 py-6 px-4 flex flex-col md:flex-row items-center justify-center gap-8 max-w-screen-xl mx-auto">
          <div className="md:w-1/2">
            <h1 className="sm:!text-5xl text-3xl md:text-7xl text-black font-bold mb-8 relative z-10 custom-stroke leading-15">
              {page_heading}
            </h1>
            <p className="text-lg leading-relaxed whitespace-pre-line">
              {page_content}
            </p>
          </div>

          <div className="md:w-1/2 relative z-0">
            <Image
            width={100} height={100} quality={100} unoptimized={true}
              src={main_image}
              alt={page_heading}
              className="w-full h-full object-cover shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
        </section>

        {/* Info Cards Section */}
        <div className="container mx-auto px-4 sm:mb-16 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

            <div className="bg-white sm:p-6 p-2 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold mb-4">Our Location</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Strategically located in the heart of the city. Easy access to public transportation.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold mb-4">Getting Here</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Multiple transportation options available. Parking facilities on-site.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200 text-center">
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                24/7 customer support available. Multiple contact channels.
              </p>
            </div>
          </div>
        </div>

        {/* Location Details Section */}
        <div className="container mx-auto  px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-t border-gray-200">
            <div>
              <h4 className="font-semibold text-black mb-2 text-center">Address</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line text-center">{address}</p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2 text-center">Hours</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line text-center">{hours}</p>
            </div>
            <div>
              <h4 className="font-semibold text-black mb-2 text-center">Contact</h4>
              <p className="text-sm text-gray-600 whitespace-pre-line text-center">{contact}</p>
            </div>
          </div>
          <div className="max-w-full mx-auto bg-white border-t h-80 border-gray-200 shadow">
            <iframe
              src={map_url}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
              className="border-0"
            />
          </div>
        </div>

        {/* Facilities Section */}
        <section
          className="w-full sm:py-16 py-4"
          style={{ background: "linear-gradient(to bottom, #1f2937 30%, #e5e7eb 30%)" }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Facilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 sm:gap-8 gap-3">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center bg-white p-6  shadow-lg hover:scale-105 transition-transform duration-300"
                >
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                   src={facility.icon} alt={facility.name} className="w-16 h-16 mb-4 object-contain" />
                  <p className="text-lg font-semibold text-gray-800">{facility.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section
          className="w-full sm:py-16 py-4 z-0"
          style={{ background: "linear-gradient(to bottom, #1f2937 30%, #e5e7eb 30%)" }}
        >
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Our Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {gallery_images.map((src, index) => (
                <div
                  key={index}
                  className="relative w-full overflow-hidden rounded-sm shadow-lg"
                >
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={src}
                    alt={`Gallery Image ${index + 1}`}
                  
                    className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </>
  );
};

export default Location;
