'use client'
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";

const PerformancePage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const carName = segments[segments.length - 1]?.toLowerCase();
  const [data, setTabData] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTabData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/car-performance-engine");
        if (response.data.success) {
          const tabsData = response.data.data;
          console.log("performance data", tabsData);

          const filteredData = tabsData.filter(item => item.car_name.toLowerCase() === carName);

          if (filteredData.length > 0) {
            setTabData(filteredData);
            
            // Group by variant and use the first variant as default
            const groupedByVariant = groupByVariant(filteredData);
            const firstVariant = Object.keys(groupedByVariant)[0];
            setActiveTab(firstVariant);
            
            setError(null);
          } else {
            setError("No engine data found for this car.");
          }
        } else {
          setError("Failed to fetch car performance data.");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Server error while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTabData();
  }, [carName]);

  // Group data by car variant
  const groupByVariant = (data) => {
    return data.reduce((acc, item) => {
      if (!acc[item.car_variant]) {
        acc[item.car_variant] = [];
      }
      acc[item.car_variant].push(item);
      return acc;
    }, {});
  };

  const groupedData = groupByVariant(data);
  const variants = Object.keys(groupedData);
  const activeItems = groupedData[activeTab] || [];

  return (
    <div className="w-full bg-[#f7f5f2] py-12 flex flex-col items-center mx-auto" style={{ maxWidth: "1397px" }}>
      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-8">
        Engine Performance
      </h2>

      {/* Loading/Error States */}
      {loading && <p className="text-gray-600">Loading engine data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && variants.length > 0 && (
        <>
          {/* Tabs - Grouped by variant */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {variants.map((variant) => (
              <button
                key={variant}
                className={`px-6 py-3 font-medium  border-2 transition duration-300 ${
                  activeTab === variant
                    ? "bg-[#001E50] text-white border-[#001E50]"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(variant)}
              >
                {variant}
              </button>
            ))}
          </div>

          {activeItems.length > 0 && (
            <>
              {/* Main content area with variant title */}
              <div className="w-full max-w-5xl bg-white p-6 md:p-10  shadow-md">
                <h3 className="text-xl md:text-2xl font-semibold mb-8 text-center">
                  {activeTab}
                </h3>
                
                {/* Grid layout for multiple engines of the same variant */}
                <div className={`grid gap-8 ${activeItems.length > 1 ? 'md:grid-cols-2' : ''}`}>
                  {activeItems.map((item) => (
                    <div key={item.id} className="flex flex-col items-center">
                      {/* Engine Image */}
                      <div className="w-full max-w-md mb-6">
                        <Image
                          src={`http://localhost:8000/${item.image_url}`}
                          alt={item.tab_title}
                          width={600}
                          height={400}
                          className="w-full h-auto object-contain rounded"
                        />
                      </div>

                      {/* Engine Title */}
                      <h4 className="text-xl font-bold mb-4 text-center">{item.tab_title}</h4>
                      
                      {/* Short Description */}
                      <p className="text-lg text-gray-700 mb-6 text-center">{item.short_description}</p>
                      
                      {/* Specifications - Based on your example image */}
                      <div className="w-full mb-6">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="font-medium">Max power</span>
                          <span className="text-gray-700">84.4 kW</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="font-medium">Max torque</span>
                          <span className="text-gray-700">143.8 Nm</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="font-medium">Transmission</span>
                          <span className="text-gray-700">6-speed manual & intelligent automatic</span>
                        </div>
                      </div>
                      
                      {/* Long Description */}
                      <div className="text-gray-800 mt-4">
                        <p className="text-base leading-relaxed">{item.long_description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PerformancePage;