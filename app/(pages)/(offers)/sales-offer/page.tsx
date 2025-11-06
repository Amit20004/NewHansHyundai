'use client'
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { useRouter } from "next/navigation"; // ✅ Import router
import ContactUs from '../../contact-us/page';
import {
  Award,
} from "lucide-react";

export default function Component() {
  const [carOffers, setCarOffers] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const heroSectionRef = useRef(null);
  // const [animate, setAnimate] = useState(false);
  const router = useRouter(); // ✅ Initialize router

  useEffect(() => {
    const fetchCarOffers = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/car-offers');

        // ✅ Transform API data into usable format
        const transformedData = response.data.data.flatMap(model =>
          model.variants.map(variant => ({
            id: variant.id,
            name: model.car_name,
            price: variant.price,
            mainImg: variant.images.main,
            img: variant.images.main,
            description: variant.details.description,
            badge: "PREMIUM DEAL",
            badgeColor: "bg-yellow-500",
            features: Array.isArray(variant.features)
              ? variant.features.map(feature => ({
                  duration: feature.duration || "3 Years",
                  title: feature.title || "",
                  description: feature.description || feature.title || ""
                }))
              : [],
            subtitle: variant.details.heading,
          }))
        );

        setCarOffers(transformedData);
        setSelectedCar(transformedData[0]);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching car offers:', err);
      } finally {
        setLoading(false);
        setAnimate(true);
      }
    };

    fetchCarOffers();
  }, []);

  // ✅ Handle Car Select Scroll
  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setTimeout(() => {
      heroSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  // ✅ Handle "Know More" Navigation
  const handleKnowMore = (carName) => {
    const slug = carName.toLowerCase().replace(/\s+/g, "-"); // e.g. Hyundai Creta → hyundai-creta
    router.push(`/${slug}`);
  };

  // ✅ Handle "Request a Test Drive"
  const handleTestDrive = () => {
    router.push("/test-drive");
  };

  // ✅ Handle "Download Brochure"
  const handleDownloadBrochure = async (carName) => {
    try {
      const carSlug = carName.toLowerCase().replace(/\s+/g, "-");
      const response = await axios.get(`http://localhost:8000/api/car-ebrochure-all/${carSlug}`);

      if (response.data.success && response.data.data?.file_url) {
        const brochure = response.data.data;
        const fileLink = brochure.file_url.startsWith("http")
          ? brochure.file_url
          : `http://localhost:8000/${brochure.file_url.replace(/^\//, "")}`;

        const link = document.createElement("a");
        link.href = fileLink;
        link.setAttribute("download", brochure.file_name || `${brochure.car_name}_brochure.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert("Brochure not found for this car.");
      }
    } catch (error) {
      console.error("Error downloading brochure:", error);
      alert("Failed to download brochure. Please try again later.");
    }
  };

  // =================== UI SECTION ======================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="!text-xl">Loading car offers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="!text-xl text-red-500">Error loading car offers: {error}</div>
      </div>
    );
  }

  if (!selectedCar || carOffers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="!text-xl">No car offers available</div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white mx-auto max-w-[1397px] w-full sales-main-section">
        
        {/* Hero Section */}
        <motion.section
          ref={heroSectionRef}
          className="relative overflow-hidden bg-gradient-to-r to-gray-700/10 from-[#032a7e] mt-5 pl-5 py-5"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="container mx-auto px-4 py-2 relative z-10">
            <div className="grid lg:grid-cols-2 gap-4 items-center hero-section">
              <div className="text-white space-y-2">
                <h1 className="text-5xl font-bold leading-tight">{selectedCar.name}</h1>
                <p className="text-sm text-gray-200 max-w-lg">{selectedCar.description}</p>

                <ul className="space-y-2">
                  {selectedCar.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex items-baseline bg-blue-900 text-white px-2 py-2 min-w-[50px] justify-center">
                        <span className="!text-xl font-bold">
                          {feature.duration?.split(' ')[0] || ''}
                        </span>
                        <span className="text-sm font-medium ml-1">
                          {feature.duration?.split(' ')[1] || ''}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white">{feature.title}</h3>
                        <p className="text-xs text-gray-200">{feature.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center space-x-3 mt-4">
                  <div className="bg-gradient-to-r from-[#FF073A] to-[#FF4E50] text-white px-2 py-1 shadow-md">
                    <span className="font-medium tracking-wide">Exciting Offers: upto</span>
                  </div>
                  <div className="flex items-center text-[#FF073A] font-bold text-4xl space-x-1 mb-2">
                    <span className="text-[1.7rem] font-[400] mt-2">₹</span>
                    <div className="relative">
                      <span className="px-1 text-[1.7rem] font-[400]">
                        {selectedCar.price.toLocaleString()}
                      </span>
                      <div className="absolute left-0 right-0 bottom-0 h-0.5 bg-[#FF073A] rounded-full"></div>
                    </div>
                    <span className="text-lg">*</span>
                  </div>
                </div>
              </div>

              <motion.img
                src={selectedCar.img || "/placeholder.svg"}
                alt={selectedCar.name}
                width="100%"
                height="90%"
                className="relative z-10 w-full h-auto rounded-2xl transition-transform duration-700 ease-out"
                initial={{ opacity: 0, x: 300, scale: 0.7 }}
                animate={{ opacity: 1, x: 0, scale: [0.7, 1.05, 1] }}
                transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
              />
            </div>
          </div>
        </motion.section>

        {/* Car Selection Section */}
        <section className="bg-gray-50 border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black">Premium Car Offers</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {carOffers.map((car) => (
                <div
                  key={car.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden ${
                    selectedCar.id === car.id
                      ? "ring-2 ring-blue-500 transform scale-[1.02]"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => handleCarSelect(car)}
                >
                  <div className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={car.mainImg || "/placeholder.svg"}
                        alt={car.name}
                        className="w-full h-[250px] object-contain object-center transition-transform duration-300 hover:scale-105"
                      />
                      <div className={`absolute top-3 left-3 ${car.badgeColor} text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center`}>
                        <Award className="h-3 w-3 mr-1" />
                        {car.badge}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg text-black">{car.name}</h3>
                        <div className="text-lg font-bold text-black">₹{car.price.toLocaleString()}</div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <button
                          onClick={() => handleTestDrive()}
                          className="flex-1 bg-[#002844] text-white font-semibold text-sm py-2 px-3 rounded hover:bg-gray-600 transition-colors"
                        >
                          Request a Test Drive
                        </button>
                        <button
                          onClick={() => handleDownloadBrochure(car.name)}
                          className="flex-1 bg-[#002844] text-white font-semibold text-sm py-2 px-3 rounded hover:bg-gray-600 transition-colors"
                        >
                          Download Brochure
                        </button>
                        <button
                          onClick={() => handleKnowMore(car.name)}
                          className="flex-1 bg-[#002844] text-white font-semibold text-sm py-2 px-3 rounded hover:bg-gray-600 transition-colors"
                        >
                          Know More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <ContactUs />
    </>
  );
}
