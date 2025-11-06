"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Btn from "../../../components/ui/Button";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import axios from "axios";
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner";
import ContactUs from "../../contact-us/page";
import Image from "next/image";

const PriceListingPage = () => {
  const [carPrice, setCarPrice] = useState([]);
  const [selectedImages, setSelectedImages] = useState({});
  const [selectedModel, setSelectedModel] = useState("All Models");
  const [selectedFuel, setSelectedFuel] = useState("All Fuel Types");
  const [selectedTransmission, setSelectedTransmission] = useState("All Transmissions");
  const [selectedVariant, setSelectedVariant] = useState("All Variants");

  const [showVariantAlert, setShowVariantAlert] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showFuelDropdown, setShowFuelDropdown] = useState(false);
  const [showTransmissionDropdown, setShowTransmissionDropdown] = useState(false);
  const [showVariantDropdown, setShowVariantDropdown] = useState(false);

  const [filterOptions, setFilterOptions] = useState({
    models: ["All Models"],
    fuelTypes: ["All Fuel Types"],
    transmissions: ["All Transmissions"],
    variantsData: { "All Fuel Types": ["All Variants"] },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filtersResponse = await axios.get("http://localhost:8000/api/vehicle-filters");
        if (filtersResponse.data.success) {
          setFilterOptions(filtersResponse.data.data);
        }

        const carsResponse = await axios.get("http://localhost:8000/api/vehicles");
        if (carsResponse.data.success) {
          // ✅ Fix image URLs
          const carsWithFixedImages = carsResponse.data.data.map((car) => ({
            ...car,
            images: (car.images || []).map((img) =>
              img.startsWith("http")
                ? img
                : `http://localhost:8000/${img.replace(/^\/+/, "")}`
            ),
          }));
          setCarPrice(carsWithFixedImages);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  const getVariants = () => {
    return filterOptions.variantsData[selectedFuel] || filterOptions.variantsData["All Fuel Types"];
  };

  const filteredCars = carPrice.filter((car) => {
    const carFuelType = car.fuelType || car.fuel_type || "";
    const normalizedCarFuel = carFuelType.toString().toLowerCase().trim();
    const normalizedSelectedFuel = selectedFuel.toString().toLowerCase().trim();

    const carVariant = car.variant || "";
    const carModel = car.model || "";
    const carTransmission = car.transmission || "";

    return (
      (selectedModel === "All Models" || carModel === selectedModel) &&
      (selectedFuel === "All Fuel Types" || normalizedCarFuel === normalizedSelectedFuel) &&
      (selectedTransmission === "All Transmissions" || carTransmission === selectedTransmission) &&
      (selectedVariant === "All Variants" || selectedVariant.includes(carVariant))
    );
  });

  const clearFilters = () => {
    setSelectedModel("All Models");
    setSelectedFuel("All Fuel Types");
    setSelectedTransmission("All Transmissions");
    setSelectedVariant("All Variants");
  };

  return (
    <>
      <ResponsiveBanner />
      <div
        className="min-h-screen bg-gray-50 w-full mx-auto xl:mt-10 md:mt-5"
        style={{ maxWidth: "1397px" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#05141f] mb-8 text-center">Car Price Listing</h1>
          {/* Filter Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {/* Model Filter */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-3 text-left"
              >
                <span>{selectedModel}</span>
                {showModelDropdown ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {showModelDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-y-auto"
                >
                  {filterOptions.models.map(model => (
                    <div
                      key={model}
                      onClick={() => {
                        setSelectedModel(model);
                        setShowModelDropdown(false);
                      }}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${selectedModel === model ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      {model}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Fuel Type Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowFuelDropdown(!showFuelDropdown);
                  setSelectedVariant('All Variants');
                }}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-3 text-left"
              >
                <span>{selectedFuel}</span>
                {showFuelDropdown ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {showFuelDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200"
                >
                  {filterOptions.fuelTypes.map(fuel => (
                    <div
                      key={fuel}
                      onClick={() => {
                        setSelectedFuel(fuel);
                        setShowFuelDropdown(false);
                      }}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${selectedFuel === fuel ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      {fuel}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Transmission Filter */}
            <div className="relative">
              <button
                onClick={() => setShowTransmissionDropdown(!showTransmissionDropdown)}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-3 text-left"
              >
                <span>{selectedTransmission}</span>
                {showTransmissionDropdown ? <FiChevronUp /> : <FiChevronDown />}
              </button>
              {showTransmissionDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200"
                >
                  {filterOptions.transmissions.map(trans => (
                    <div
                      key={trans}
                      onClick={() => {
                        setSelectedTransmission(trans);
                        setShowTransmissionDropdown(false);
                      }}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${selectedTransmission === trans ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      {trans}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Variant Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  if (selectedFuel === 'All Fuel Types') {
                    setShowVariantDropdown(false);
                    setShowVariantAlert(true);
                    setTimeout(() => setShowVariantAlert(false), 3000);
                  } else {
                    setShowVariantDropdown(!showVariantDropdown);
                  }
                }}
                className="w-full flex justify-between items-center bg-white border border-gray-300 rounded-md px-4 py-3 text-left"
              >
                <span>{selectedVariant}</span>
                {showVariantDropdown ? <FiChevronUp /> : <FiChevronDown />}
              </button>

              {showVariantDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border border-gray-200 max-h-60 overflow-y-auto"
                >
                  {getVariants().map(variant => (
                    <div
                      key={variant}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setShowVariantDropdown(false);
                      }}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${selectedVariant === variant ? 'bg-blue-50 text-blue-600' : ''}`}
                    >
                      {variant}
                    </div>
                  ))}
                </motion.div>
              )}

              {showVariantAlert && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-500 text-sm mt-2"
                >
                  Please select a Fuel Type first!
                </motion.p>
              )}
            </div>
          </div>
          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              {filteredCars.length} {filteredCars.length === 1 ? "Car" : "Cars"} Found
            </p>
            <Btn onClick={clearFilters} btnName="Clear All Filters" />
          </div>

          {/* Cars List */}
          <div className="space-y-6">
            {filteredCars.map((car, index) => (
              <motion.div
                key={`${car.model}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Section */}
                  <div className="md:w-1/2 p-4 flex flex-col">
                    <div className="w-full h-64 md:h-[400px] overflow-hidden rounded-md bg-gray-100">
                      {car.images && car.images.length > 0 ? (
                        <Image
                        width={100} height={100} quality={100} unoptimized={true}
                          src={selectedImages[car.model] || car.images[0]}
                          alt={car.model}
                          className="w-full h-full object-cover"
                          loading={index < 3 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Image not available
                        </div>
                      )}
                    </div>

                    {/* Thumbnails */}
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                      {car.images?.map((img, imgIndex) => (
                        <button
                          key={`${car.model}-thumb-${imgIndex}`}
                          onClick={() =>
                            setSelectedImages((prev) => ({ ...prev, [car.model]: img }))
                          }
                          className={`flex-shrink-0 w-20 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                            selectedImages[car.model] === img
                              ? "border-blue-500 ring-2 ring-blue-200"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Image
                          width={100} height={100} quality={100} unoptimized={true}
                            src={img}
                            alt={`${car.model} ${imgIndex + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="md:w-1/2 p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{car.model}</h3>
                        <p className="text-gray-500">{car.variant}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-red-600">{car.price}</p>
                        <p className="text-sm text-gray-500">Model Year: {car.launchDate}</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {car.fuelType}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {car.transmission}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 line-clamp-3">{car.description}</p>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {car.features?.map((feature, i) => (
                          <li key={`${car.model}-feature-${i}`} className="flex items-start">
                            <svg
                              className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
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
                          </li>
                        ))}
                      </ul>
                      <div className="mt-12 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          <p>EMI from ₹15,000/month</p>
                        </div>
                        <div className="relative right-2">
                          <Btn btnName={"View More"} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No cars found matching your filters.</p>
              <Btn onClick={clearFilters} btnName="Clear All Filters" />
            </div>
          )}
        </div>
      </div>
      <ContactUs />
    </>
  );
};

export default PriceListingPage;
