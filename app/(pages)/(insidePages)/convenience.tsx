import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
// import speedometer from "../../assets/convenience/speedometer.jpg";
// import charging from "../../assets/convenience/charging.jpg";
import "../../css/ConveniencePage.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import axios from "axios";

// const features = [
//   {
//     title: "Digital Instrument Cluster",
//     content: "Track real-time driving info, fuel economy, and trip data with enhanced clarity.",
//     image: speedometer,
//   },
//   {
//     title: "Wireless Phone Charger",
//     content: "Charge your phone on the go without tangled wires or clutter.",
//     image: charging,
//   },
// ];

const ConveniencePage = () => {
  const [activeIndex, setActiveIndex] = useState(null);
     const pathname = usePathname();
    const segments = pathname.split("/");
    const carName = segments[segments.length - 1]?.toLowerCase();
  const [error,setError]=useState(true);
  const [loading, setLoading]=useState(true);
  const [convenience, setConvenience]=useState([]);

  useEffect(() => {
      const fetchTabData = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/car-convenience-feature");
          if (response.data.success) {
            const tabsData = response.data.data;
            const filteredData = tabsData.filter(item => item.car_name.toLowerCase() === carName);
  
            if (filteredData.length > 0) {
              setConvenience(filteredData);
              // setActiveTab(filteredData[0].car_variant); // set first tab as default
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
    if(loading)
    {
      return <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading convenience features...</p>
    </div>;
    }
    if(error)
      {
      return <div className="flex justify-center items-center h-64">
      <p className="text-red-500">{error}</p>
    </div>;
      }
    


  const toggleFeature = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
  <>
       <div className="safety-container bg-[#f7f5f2] w-full mx-auto" style={{maxWidth:"1397px"}}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">Key Convenience Features</h2>
      <div className="accordion">
        {convenience.map((item, index) => (
          <div key={index} className="accordion-item">
            <div className="accordion-header" onClick={() => toggleFeature(index)}>
              <span>{item.title}</span>
              <div className="right-section">
                <span className="badge">
                  <ShieldCheck size={14} className="icon" />
                  {item.car_name}
                </span>
                {activeIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            {activeIndex === index && (
              <div className="accordion-content">
                <p className="mb-2">{item.content}</p>
                {item.image && (
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000/${item.image}`}
                    alt={item.title}
                    className="accordion-image mx-auto"
                    onError={(e) => (e.target.style.display = "none")}
                    // width={100}
                    // height={100}
                  />
                )}
              </div>

            )}
          </div>
        ))}
      </div>
    </div>

  </>
  );
};

export default ConveniencePage;
