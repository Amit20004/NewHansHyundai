'use client';

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PriceListingPage() {
  const [cars, setCars] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch cars from backend
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/vehicles");
        const data = await res.json();
        if (data.success) {
          setCars(data.data);
          
          // Initialize selected images for each car
          const initialSelectedImages = {};
          data.data.forEach(car => {
            const images = [car.main_img, car.img1, car.img2, car.img3].filter(Boolean);

            if (images.length > 0) {
              initialSelectedImages[car.id] = images[0];
            }
          });
          
          setSelectedImages(initialSelectedImages);
        }
      } catch (err) {
        console.error("Failed to fetch cars:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleImageSelect = (carId, imgPath) => {
    setSelectedImages(prev => ({
      ...prev,
      [carId]: imgPath
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading cars...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {cars.map((car) => {
        const images = [car.main_img, car.img1, car.img2, car.img3].filter(Boolean);
        const selectedImage = selectedImages[car.id] || images[0];
        
        return (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex flex-col md:flex-row">
              {/* Image Section */}
              <div className="md:w-1/2 p-4 flex flex-col">
                {/* Main Image */}
                <div className="w-full">
                  {selectedImage ? (
                    <div className="relative w-full h-64 md:h-[400px]">
                      <Image
                        src={`http://localhost:8000/${selectedImage}`}
                        alt={car.model}
                        fill
                        className="object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = "/placeholder-car.jpg";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-64 md:h-[400px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                      No Image Available
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex flex-row mt-3 gap-2 overflow-x-auto">
                    {images.map((img, index) => (
                      <div 
                        key={`${car.id}-thumb-${index}`} 
                        className="flex-shrink-0 w-24 h-16 cursor-pointer"
                        onClick={() => handleImageSelect(car.id, img)}
                      >
                        <Image
                          src={`http://localhost:8000/${img}`}
                          alt={`Thumbnail ${index + 1}`}
                          width={96}
                          height={64}
                          className={`rounded-md border-2 ${
                            selectedImage === img ? "border-blue-500" : "border-gray-300"
                          } w-full h-full object-cover`}
                          onError={(e) => {
                            e.target.src = "/placeholder-car.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="md:w-1/2 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">{car.model}</h4>
                    <p className="text-gray-500">{car.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-medium text-[#FF073A]">
                      ₹{car.price?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-500">Model Year: {car.launchDate || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {car.fuel_type || car.fuelType || 'N/A'}
                  </span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {car.transmission || 'N/A'}
                  </span>
                </div>

                <p className="text-gray-700 mb-4">{car.description || 'No description available.'}</p>

                <div className="mb-6">
                  <h5 className="font-medium text-gray-900 mb-2">Key Features:</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {car.features ? (
                      typeof car.features === 'string' ? 
                        car.features.split(',').map((feature, index) => (
                          <div key={`${car.id}-feature-${index}`} className="flex items-center">
                            <svg
                              className="h-4 w-4 text-green-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 text-sm">{feature.trim()}</span>
                          </div>
                        ))
                      : 
                        car.features.map((feature, index) => (
                          <div key={`${car.id}-feature-${index}`} className="flex items-center">
                            <svg
                              className="h-4 w-4 text-green-500 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500">No features listed.</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm">
                    <p>EMI starts at ₹{car.price ? Math.round(car.price / 60).toLocaleString('en-IN') : 'N/A'}/month</p>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    View More
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}