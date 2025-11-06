import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "../../css/SpecificationPage.css";
import Image from "next/image";
import { usePathname } from "next/navigation";
import axios from "axios";

const SpecificationsPage = () => {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const carName = segments[segments.length - 1]?.toLowerCase();

  const [specs, setSpecs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchSpecifications = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(
          `http://localhost:8000/api/car-specifications/${encodeURIComponent(carName)}`
        );
        
        if (response.data.success) {
          setSpecs(response.data.data);
          setError(null);
        } else {
          setError("Failed to fetch car specifications.");
        }
      } catch (err) {
        console.error("Error fetching specifications:", err);
        setError("Server error while fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (carName && carName !== "specifications") {
      fetchSpecifications();
    } else {
      setLoading(false);
      setError("No car specified in URL");
    }
  }, [carName, pathname]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">Loading specifications...</p>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-red-500">{error}</p>
    </div>;
  }

  if (specs.length === 0) {
    return <div className="flex justify-center items-center h-64">
      <p className="text-gray-500">No specifications found for this car.</p>
    </div>;
  }

  return (
    <div className="specifications-container mx-auto w-full bg-[#f7f5f2]" style={{ maxWidth: "1397px" }}>
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800">
        Specifications
      </h2>

      <div className="accordion">
        {specs.map((item, index) => (
          <div key={item.id || index} className="accordion-item">
            <div className="accordion-header" onClick={() => toggleItem(index)}>
              <span>{item.title}</span>
              <div className="right-section">
                {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </div>

            {openIndex === index && (
              <div className="accordion-content">
                <div
                  className="spec-details"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />

                {item.image && (
                  <Image
                    src={`http://localhost:8000${item.image}`}
                    alt={item.title}
                    className="accordion-image"
                    onError={(e) => {
                      console.error("Image failed to load:", item.image);
                      e.target.style.display = "none";
                    }}
                    width={600}
                    height={300}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="certification-text">
        *As certified by Test Agency under rule 115 of CMVR, 1989 under standard test conditions. <br />
        ^Bluetooth is a registered trademark of Bluetooth SIG. <br />
        **For more details on airbags refer to the owner&apos;s manual.
      </p>
    </div>
  );
};

export default SpecificationsPage;