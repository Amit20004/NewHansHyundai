"use client";
import CarColorChange from "../../components/CarColorChange";
import Image from "next/image";
import CarGallerySection from "../../components/CarGallerySection";
import Button from "../../components/ui/Button";
import ParallaxSection from "../../components/ParllaxSection";
import axios from "axios";
import React, { useEffect, useState } from "react"
import DataNotFound from '../../components/error/DataNotFound'
import { usePathname } from 'next/navigation';

export default function HighlightsPage() {
  const pathname = usePathname(); // e.g., "/car/creta"
  const segments = pathname.split('/');
  const carName = segments[segments.length - 1]?.toLowerCase();

  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  // const [isMobile, setIsMobile] = useState(false);
  const [aboutData, setAboutData] = useState([]);
  const [tabContent, setTabContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(""); // Use string for better error display

  // Fetch about data
  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/inside-about-us");
        if (response.data.success) {
          const allData = response.data.data;
          const filtered = allData.filter(item => item.car_name.toLowerCase() === carName);

          if (filtered.length > 0) {
            setAboutData(filtered);
          } else {
            setError("No about data found for this car.");
          }
        } else {
          setError("Failed to fetch about section.");
        }
      } catch (err) {
        console.error("Error fetching about section data:", err);
        setError("Server error while fetching about section.");
      }
    };

    fetchAboutData();
  }, [carName]);

  // Fetch highlight tabs data
  useEffect(() => {
    const fetchTabData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/highlight-tabs");
        if (response.data.success) {
          const tabsData = response.data.data;
          const filteredData = tabsData.filter(item => item.car_name.toLowerCase() === carName);

          if (filteredData.length > 0) {
            setTabContent(filteredData);
          } else {
            setError("No highlight tabs found for this car.");
          }
        } else {
          setError("Failed to fetch highlight tabs.");
        }
      } catch (err) {
        console.error("Error fetching tab content:", err);
        setError("Server error while fetching tab data.");
      } finally {
        setLoading(false); // Set loading false only after both fetches
      }
    };

    fetchTabData();
  }, [carName]);

  // Responsive check
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return <DataNotFound msg={error} />;
  }

  return (
    <div>
      {/* About Section */}
      <section className="bg-white text-gray-900 py-3 sm:py-10 w-full mx-auto max-w-[1400px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Image */}
            <div className="flex-1 w-full">
              <Image
              width={100} height={100} quality={100} unoptimized={true}
                src={`http://localhost:8000/${aboutData[0]?.image_url}`}
                alt="Car Detailing"
                className="object-cover w-full h-full max-h-[285px]"
              />
            </div>
            {/* Text */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="uppercase tracking-widest text-3xl font-semibold text-blue-800">
                  {aboutData[0]?.section_title}
                </span>
                <h2 className="!text-2xl md:text-4xl font-bold mt-2 leading-snug">
                  {aboutData[0]?.heading}
                </h2>
              </div>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">
                {aboutData[0]?.description}
              </p>
              <Button btnName={"Read More"} />
            </div>
          </div>
        </div>
      </section>

      <CarColorChange />

      {/* Tabs Section */}
      <div className="w-full flex justify-center mt-12 py-5 bg-gray-200 mx-auto">
        <div className="w-full sm:w-[90%] md:w-[60%] max-w-[1000px] text-center">
          {/* Tabs */}
          <div className="flex sm:flex-wrap flex-nowrap sm:justify-center sm:overflow-visible overflow-x-auto gap-2 mb-4 no-scrollbar">
            {tabContent.map((tab, index) => (
              <button
                key={index}
                onMouseEnter={() => setSelectedTabIndex(index)}
                className={`text-sm font-semibold px-4 py-2 rounded whitespace-nowrap transition-all duration-200 hover:bg-[#001e50] hover:text-white ${selectedTabIndex === index ? "bg-[#001e50] text-white" : "text-black"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Image and Caption */}
          <div className="mt-4 w-full">
            <Image
            width={100} height={100} quality={100} unoptimized={true}
              src={`http://localhost:8000/${tabContent[selectedTabIndex]?.image_url}`}
              alt={tabContent[selectedTabIndex]?.label}
              className="w-full max-h-[1000px] object-cover rounded"
            />
            <p className="mt-4 font-semibold text-base sm:text-xl">
              {tabContent[selectedTabIndex]?.caption}
            </p>
          </div>
        </div>
      </div>
            <ParallaxSection bgImage={"https://images.pexels.com/photos/12353734/pexels-photo-12353734.jpeg"} />

      <CarGallerySection />
    </div>
  );
}
