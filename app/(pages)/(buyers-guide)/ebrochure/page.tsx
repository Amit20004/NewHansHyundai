"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner";
import ContactUs from '../../contact-us/page'
import toast from "react-hot-toast";

export default function BrochureGrid() {
  const [ebrochure, setEbrochure] = useState([]);
  const [activeBrochure, setActiveBrochure] = useState(null); // Track which brochure is active

  const fetchEbrochure = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/car-ebrochure-all");
      if (response.data.success) {
        setEbrochure(response.data.data);
        console.log("All ebrochure data:", response.data.data);
      } else {
        console.log("API call failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching ebrochure data:", err);
    }
  };

  useEffect(() => {
    fetchEbrochure();
  }, []);

  const handleDownload = async (brochure) => {
    try {
      const fileUrl = brochure.file_url.startsWith('http') 
        ? brochure.file_url 
        : `http://localhost:8000/${brochure.file_url}`;
      
      if (!fileUrl) {
        console.error("File URL missing for brochure:", brochure);
        toast.error("File not found");
        return;
      }

      const link = document.createElement("a");
      link.href = fileUrl;
      link.setAttribute("download", brochure.file_name || `${brochure.car_name}_brochure.pdf`);
      link.setAttribute("target", "_blank");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      console.log("Download started for:", brochure.car_name);
      toast.success("Download started");
    } catch (err) {
      console.error("Error during brochure download:", err);
      toast.error("Download failed");
    }
  };

  const handlePreview = (brochure) => {
    const fileUrl = brochure.file_url.startsWith('http') 
      ? brochure.file_url 
      : `http://localhost:8000/${brochure.file_url}`;
      
    if (!fileUrl) {
      console.error("File URL missing for brochure:", brochure);
      toast.error("File not found");
      return;
    }
    window.open(fileUrl, "_blank");
  };

  const handleImageClick = (brochure, e) => {
    // Only for mobile screens
    if (window.innerWidth < 640) {
      e.preventDefault();
      e.stopPropagation();
      
      // If clicking the same brochure, close it. Otherwise, open new one.
      if (activeBrochure === brochure.id) {
        setActiveBrochure(null);
      } else {
        setActiveBrochure(brochure.id);
      }
    }
  };

  const handleDownloadClick = (brochure, e) => {
    e.stopPropagation();
    handleDownload(brochure);
    setActiveBrochure(null); // Close after download
  };

  const handlePreviewClick = (brochure, e) => {
    e.stopPropagation();
    handlePreview(brochure);
    setActiveBrochure(null); // Close after preview
  };

  return (
    <>
      <ResponsiveBanner />

      <div className="space-y-6 mt-5 sm:space-y-8 max-w-[1400px] w-full mx-auto my-10">
        {/* Brochure Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 w-full max-w-[1250px] mx-auto">
          {ebrochure.map((brochure) => (
            <div
              key={brochure.id}
              className="group relative transition-all duration-300 hover:scale-105 overflow-hidden"
            >
              <div className="relative aspect-[4/4] overflow-hidden group">
                <img
                  src={brochure.image_url ? (brochure.image_url.startsWith('http') 
                    ? brochure.image_url 
                    : `http://localhost:8000/${brochure.image_url}`) : "/placeholder-car.png"}
                  alt={`${brochure.car_name} brochure cover`}
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105 cursor-pointer"
                  onError={(e) => {
                    e.target.src = "/placeholder-car.png";
                  }}
                  onClick={(e) => handleImageClick(brochure, e)}
                />

                {/* Light Sweep */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-500 ease-out pointer-events-none"
                  style={{
                    transform: "translateX(-100%) rotate(15deg)",
                    animation: "sweep 1s forwards"
                  }}
                ></div>

                <span
                  className="absolute max-w-full top-2 sm:top-3 left-0 sm:left-0 bg-[#0000006b] italic text-white text-md font-bold px-5 py-1"
                  style={{
                    clipPath: "polygon(5% 0px, 100% 0px, 95% 100%, 0 100%)"
                  }}
                >
                  {brochure.car_name}
                </span>

                {/* Download Button - Show on hover (desktop) or when active (mobile) */}
                <button
                  className={`absolute top-3 right-5 w-7 h-7 rounded-full text-gray-800 
                            sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 flex items-center justify-center shadow-md 
                            hover:shadow-lg hover:ring-2 hover:ring-white 
                            hover:ring-offset-2 hover:ring-offset-gray-800 cursor-pointer
                            ${activeBrochure === brochure.id ? 'opacity-100' : 'opacity-0 sm:opacity-0'}`}
                  onClick={(e) => handleDownloadClick(brochure, e)}
                  aria-label="Download brochure"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </button>

                {/* Preview Button - Show only on mobile when active */}
                {activeBrochure === brochure.id && (
                  <button
                    className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-300 cursor-pointer z-10"
                    onClick={(e) => handlePreviewClick(brochure, e)}
                  >
                    View PDF
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* No Data */}
        {ebrochure.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-sm sm:text-base">
              No brochures found.
            </p>
          </div>
        )}
      </div>

      <ContactUs/>
    </>
  );
}