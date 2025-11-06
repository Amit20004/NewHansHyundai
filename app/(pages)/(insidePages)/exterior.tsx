"use client";
import { useState, useEffect, useRef } from "react";
import mainImage from "../../assets/interiorImages/seatInterior.jpg";
import Image from "next/image";
// import Button from "@/app/components/ui/Button";
import '../../css/Exterior.css';
import axios from "axios";
import { usePathname } from "next/navigation";

export default function ExteriorPage() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const carName = segments[segments.length - 1]?.toLowerCase();
  
  const [viewsData, setViewsData] = useState([]);
  const [carGallery, setCarGallery] = useState([]);
  const [showContent, setShowContent] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  // const [isMobile, setIsMobile] = useState(false);
  const [selectedImage, setSelectedImage] = useState({
    image_url: mainImage,
    car_name: "Default Car",
    description: "Default description"
  });
  const [loading, setLoading] = useState({
    views: true,
    gallery: true
  });
  const [error, setError] = useState({
    views: null,
    gallery: null
  });

  const contentRef = useRef(null);

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

  useEffect(() => {
    const fetchViewsData = async () => {
      try {
        setLoading(prev => ({...prev, views: true}));
        setError(prev => ({...prev, views: null}));
        
        const response = await axios.get("http://localhost:8000/api/exterior-views");
        if (response.data.success) {
          const filteredData = response.data.data.filter(
            item => item.car_name.toLowerCase() === carName
          );
          
          if (filteredData.length === 0) {
            setError(prev => ({...prev, views: `No exterior views found for ${carName}`}));
          } else {
            setViewsData(filteredData);
            setSelectedTab(0);
          }
        }
      } catch (err) {
        console.error("Error fetching exterior views:", err);
        setError(prev => ({...prev, views: "Failed to load exterior views"}));
      } finally {
        setLoading(prev => ({...prev, views: false}));
      }
    };

    if (carName) {
      fetchViewsData();
    }
  }, [carName]);

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        setLoading(prev => ({...prev, gallery: true}));
        setError(prev => ({...prev, gallery: null}));
        
        const response = await axios.get("http://localhost:8000/api/car-ext-gallery");
        if (response.data.success) {
          const filteredData = response.data.data.filter(
            item => item.car_name.toLowerCase() === carName
          );
          console.log("filtereddata",filteredData);
          
          
          if (filteredData.length > 0) {
            setCarGallery(filteredData);
            setSelectedImage(filteredData[0]);
          } else {
            setError(prev => ({...prev, gallery: `No gallery images found for ${carName}`}));
            setSelectedImage({
              image_url: mainImage,
              car_name: carName.charAt(0).toUpperCase() + carName.slice(1),
              description: "No description available"
            });
          }
        }
      } catch (err) {
        console.error("Error fetching car exterior gallery:", err);
        setError(prev => ({...prev, gallery: "Failed to load gallery images"}));
      } finally {
        setLoading(prev => ({...prev, gallery: false}));
      }
    };

    if (carName) {
      fetchGalleryData();
    }
  }, [carName]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {/* Tabs Section */}
      <div className="w-full flex justify-center mt-12 py-5 bg-gray-200 mx-auto">
        <div className="w-full sm:w-[90%] md:w-[60%] max-w-[1000px] text-center">
          {loading.views ? (
            <div className="text-center py-4">Loading exterior views...</div>
          ) : error.views ? (
            <div className="text-center py-4 text-red-500">{error.views}</div>
          ) : viewsData.length > 0 ? (
            <>
              <div className="flex justify-around sm:flex-wrap flex-nowrap sm:justify-around lg:justify-between sm:overflow-visible overflow-x-auto gap-2 mb-4 no-scrollbar">
                {viewsData.map((tab, index) => (
                  <button
                    key={index}
                    onMouseEnter={() => setSelectedTab(index)}
                    className={`text-sm font-semibold px-4 py-2  whitespace-nowrap transition-all duration-200 hover:bg-[#001e50] hover:text-white ${selectedTab === index ? "bg-[#001e50] text-white" : "text-black"}`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 w-full">
                <Image
                width={100} height={100} quality={100} unoptimized={true} 
                  src={`http://localhost:8000/${viewsData[selectedTab]?.img_url}`}
                  alt={viewsData[selectedTab]?.label || "Car view"}
                  className="w-full max-h-[1000px] object-cover rounded"
                  
                />
                <p className="mt-4 font-semibold text-base sm:text-xl">
                  {viewsData[selectedTab]?.caption || ""}
                </p>
              </div>
            </>
          ) : null}
        </div>
      </div>

      <br/>
      <br/>

      <div className="w-full bg-[#f7f5f2] py-3 sm:py-12 flex flex-col items-center mx-auto" style={{maxWidth:"1397px"}}>
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
          {loading.gallery ? (
            <div className="text-center py-8">Loading gallery images...</div>
          ) : error.gallery ? (
            <div className="text-center py-8 text-red-500">{error.gallery}</div>
          ) : (
            <>
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
                  <Image
                    src={`http://localhost:8000/${selectedImage.image_url}`}
                    alt="Selected Interior"
                    className="w-full max-w-md md:max-w-full h-auto cursor-pointer"
                    onClick={() => setShowContent(true)}
                    width={800}
                    height={100}
                  />
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
                  <h2 className="text-2xl font-bold mb-2">{selectedImage.car_name}</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedImage.description}</p>
                </div>
              </div>

              {/* Thumbnails */}
              {carGallery.length > 0 && (
                <div className="mt-6 w-full flex overflow-x-auto gap-4 md:justify-center">
                  {carGallery.map((img, idx) => (
                    <div key={idx} className="flex-shrink-0">
                      <Image
                        src={`http://localhost:8000/${img.image_url}`}
                        alt={`Thumbnail ${idx}`}
                       width={100} height={100} quality={100} unoptimized={true}
                        className="w-28 h-20 rounded-md object-cover cursor-pointer border border-gray-300 hover:border-black transition"
                        onClick={() => {
                          setSelectedImage(img);
                          setShowContent(true);
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Mobile Slide-Up Panel */}
          <div
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
            <h2 className="text-2xl font-bold mb-2">{selectedImage.car_name}</h2>
            <p className="text-gray-700 leading-relaxed">{selectedImage.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}