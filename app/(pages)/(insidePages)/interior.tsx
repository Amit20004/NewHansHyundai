import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import axios from "axios";

const InteriorPage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const carName = segments[segments.length - 1]?.toLowerCase();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [interiorData, setInteriorData] = useState([]); // fetched data

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchInteriorData = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get("http://localhost:8000/api/car-int-gallery");
        if (response.data.success) {
          const filteredData = response.data.data.filter(
            (item) => item.car_name.toLowerCase() === carName
          );

          if (filteredData.length === 0) {
            setError(`No interior images found for car: ${carName}`);
          } else {
            setInteriorData(filteredData);
            setSelectedImage(filteredData[0]); // select first image by default
          }
        } else {
          setError("Failed to fetch data from server.");
        }
      } catch (err) {
        console.error("Error fetching interior data:", err);
        setError("Something went wrong while loading data.");
      } finally {
        setLoading(false);
      }
    };

    if (carName) {
      fetchInteriorData();
    }
  }, [carName]);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contentRef.current && !contentRef.current.contains(event.target)) {
        setShowContent(false);
      }
    };

    if (showContent) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showContent]);

  const handleImageClick = (img) => {
    setSelectedImage(img);
    setShowContent(true);
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <p className="text-gray-600">Loading interior images...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div
      className="w-full bg-[#f7f5f2] py-12 flex flex-col items-center mx-auto"
      style={{ maxWidth: "1397px" }}
    >
      {/* Heading */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Interior Design Highlights
        </h2>
        <p className="text-gray-600 text-sm">
          Click on any seat image to view more details.
        </p>
      </div>

      {/* Main Content Container */}
      <div className="w-full max-w-5xl relative px-4 overflow-hidden">
        <div
          className="flex flex-col md:flex-row items-center justify-center relative"
          ref={contentRef}
        >
          {/* Main Image */}
          <div
            className={`transition-all duration-700 ease-in-out flex justify-center items-center w-full md:w-[80%] ${
              showContent ? "md:translate-x-[-10%]" : ""
            }`}
          >
            {selectedImage && (
              <Image
                src={`http://localhost:8000/${selectedImage.image_url}`}
                alt="Interior"
                width={800}
                height={600}
                className="w-full max-w-md md:max-w-full h-auto cursor-pointer rounded"
                onClick={() => setShowContent(true)}
              />
            )}
          </div>

          {/* Desktop Side Panel */}
          <div
            className={`hidden md:block absolute top-0 right-0 bg-white w-[40%] h-full p-6 transition-all duration-700 ease-in-out z-10 ${
              showContent ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              className="absolute top-4 right-4 text-xl font-bold text-gray-600 hover:text-black"
              onClick={() => setShowContent(false)}
            >
              ×
            </button>
            {selectedImage && (
              <>
                <h2 className="text-2xl font-bold mb-4">
                  {selectedImage.car_name}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {selectedImage.description}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="mt-6 w-full flex overflow-x-auto gap-4 md:justify-center">
          {interiorData.map((img, idx) => (
            <Image
              key={idx}
              src={`http://localhost:8000/${img.image_url}`}
              alt={`Thumbnail ${idx}`}
              width={200}
              height={150}
              className="w-28 h-20 rounded-md object-cover cursor-pointer border border-gray-300 hover:border-black transition"
              onClick={() => handleImageClick(img)}
            />
          ))}
        </div>

        {/* Mobile Slide-Up Panel */}
        <div
          ref={contentRef}
          className={`md:hidden fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-xl p-5 transition-transform duration-500 ease-in-out z-50 ${
            showContent ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <button
            className="absolute top-3 right-5 text-2xl font-bold text-gray-600 hover:text-black"
            onClick={() => setShowContent(false)}
          >
            ×
          </button>
          {selectedImage && (
            <>
              <h2 className="text-xl font-bold mb-3 mt-4">
                {selectedImage.car_name}
              </h2>
              <p className="text-gray-700 text-sm">{selectedImage.description}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteriorPage;
