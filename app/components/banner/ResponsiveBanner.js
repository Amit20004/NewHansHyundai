'use client'
import React, { useEffect, useState } from 'react';
import BreadCrumbs from '../BreadCrumbs';
import axios from 'axios';
import { usePathname } from 'next/navigation';

const ResponsiveBanner = () => {
  const [carBanner, setCarBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get the current pathname and extract the last part as slug
  const pathname = usePathname();
  const slug = pathname.split('/').pop(); // Gets the last part of URL
  console.log(slug);
  

  const normalizeSlug = (slug) => {
    if (!slug) return '';
    return decodeURIComponent(slug).toLowerCase().trim();
  };

  const fetchBannerBySlug = async () => {
    const normalizedSlug = normalizeSlug(slug);
    
    if (!normalizedSlug) {
      setError("No slug found in URL");
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching banner for slug:', normalizedSlug);
      const response = await axios.get(`http://localhost:8000/api/page-banner/slug/${encodeURIComponent(normalizedSlug)}`);
      console.log('API Response:', response.data);
      
      // Handle different response structures
      let bannerData = null;
      
      if (response.data.success) {
        if (typeof response.data.data === 'object' && response.data.data !== null) {
          // Correct structure: data contains the banner object
          bannerData = response.data.data;
        } else {
          // Incorrect structure: extract from root level (fallback)
          bannerData = {
            id: response.data.id,
            slug: response.data.slug,
            // Try both car_image and cat_image fields
            car_image: response.data.car_image || response.data.cat_image,
            created_at: response.data.created_at,
            updated_at: response.data.updated_at
          };
        }
        
        setCarBanner(bannerData);
        setError(null);
      } else {
        setError("Banner not found for this slug");
      }
    } catch (err) {
      console.error("Error fetching banner:", err);
      setError("No banner image found for this page");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerBySlug();
  }, [slug]); // Re-fetch when slug changes

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="animate-pulse bg-gray-200 w-full h-full"></div>
      </div>
    );
  }

  // If no banner found or error, don't show any banner
  if (error || !carBanner) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="w-full h-[100px] bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          {error || "No banner available"}
        </div>
        {/* Still show breadcrumbs even if no banner */}
        <div className="mt-4">
          <BreadCrumbs />
        </div>
      </div>
    );
  }

  // Get the correct image filename (handle both car_image and cat_image)
  const imageFilename = carBanner.car_image || carBanner.cat_image;
  const carImage = imageFilename 
    ? `http://localhost:8000/uploads/bannerImage/${imageFilename}`
    : null;

  const altText = carBanner.slug || "Page Banner";

  // If no image filename, don't show banner
  if (!imageFilename) {
    return (
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="w-full h-[100px] bg-gray-100 flex items-center justify-center text-gray-500 text-sm">
          No banner image available
        </div>
        <div className="mt-4">
          <BreadCrumbs />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1400px] mx-auto relative overflow-hidden shadow-sm sm:shadow-md">
      {/* Banner Image + Gradient Overlay */}
      <div className="relative w-full">
        <img
          src={carImage}
          alt={altText}
          className="w-full h-[180px] sm:h-[250px] md:h-[350px] lg:h-[450px] xl:h-[400px] object-cover object-center block"
          onError={(e) => {
            console.error('Image failed to load:', carImage);
            e.target.style.display = 'none';
            setError("Banner image failed to load");
          }}
          onLoad={() => {
            console.log('Banner image loaded successfully:', carImage);
          }}
        />
        {/* black-to-transparent gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent)",
          }}
        />
      </div>

      {/* BreadCrumbs Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="pointer-events-auto">
          <BreadCrumbs />
        </div>
      </div>

      {/* Debug info (remove in production) */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs p-1 rounded">
          Slug: {carBanner.slug}
        </div>
      )} */}
    </div>
  );
};

export default ResponsiveBanner;