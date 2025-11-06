import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import "../../css/SafetyPage.css";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";
const SafetyPage = () => {
    const pathname = usePathname();
    const segments = pathname.split("/");
    const carName = segments[segments.length - 1]?.toLowerCase();
  const [openIndex, setOpenIndex] = useState(null);
  const [error,setError]=useState(true);
  // const [loading, setLoading]=useState(true);
  const [safetyItems, setSafetyItems]=useState([]);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
      const fetchTabData = async () => {
        try {
          const response = await axios.get("http://localhost:8000/api/car-safety-security");
          if (response.data.success) {
            const tabsData = response.data.data;
            const filteredData = tabsData.filter(item => item.car_name.toLowerCase() === carName);
  
            if (filteredData.length > 0) {
              setSafetyItems(filteredData);
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
          // setLoading(false);
        }
      };
  
      fetchTabData();
    }, [carName]);

    if(error)
    {
      return <div className="flex justify-center items-center h-64">
      <p className="text-red-500">{error}</p>
    </div>;
    }
    

  return (
  <>
    <div className="safety-container bg-[#f7f5f2] w-full mx-auto" style={{maxWidth:"1397px"}}>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">Safety & Security</h2>
      <div className="accordion">
        {safetyItems.map((item, index) => (
          <div key={index} className="accordion-item">
            <div className="accordion-header" onClick={() => toggleItem(index)}>
              <span>{item.title}</span>
              <div className="right-section">
                <span className="badge">
                  <ShieldCheck size={14} className="icon" />
                  {item.car_name}
                </span>
                {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>
            {openIndex === index && (
              <div className="accordion-content">
                <p className="mb-2">{item.description}</p>
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

export default SafetyPage;
