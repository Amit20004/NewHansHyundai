'use client';
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import axios from 'axios';
import { useRouter } from "next/navigation";
import ContactUs from "../../contact-us/page";
import { Award } from "lucide-react";
import Image from "next/image";

export default function ServiceOffers() {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const heroSectionRef = useRef(null);
  const router = useRouter();

  // ✅ Fetch Car Services from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/api/car-service-offers");

        // Transform data like your car offers logic
        const transformedData = response.data.data.flatMap(service =>
          service.variants.map(variant => ({
            id: variant.id,
            name: service.car_name,
            price: variant.price,
            img: variant.images?.main,
            mainImg: variant.images?.main,
            description: variant.details?.description,
            badge: "SERVICE DEAL",
            badgeColor: "bg-green-400",
            features: Array.isArray(variant.features)
              ? variant.features.map(feature => ({
                  duration: feature.duration || "3 Years",
                  title: feature.title || "",
                  description: feature.description || feature.title || ""
                }))
              : [],
            subtitle: variant.details?.heading || "",
          }))
        );

        setServices(transformedData);
        if (transformedData.length > 0) setSelectedService(transformedData[0]);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // ✅ Scroll to selected service in hero
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setTimeout(() => {
      heroSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // ✅ Know More → navigate to /{service.slug}
  const handleKnowMore = (service) => {
    const slug = service.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${slug}`);
  };

  // ✅ Request Service → navigate to /book-service
  const handleRequestService = () => {
    router.push("/book-service");
  };

  // =================== UI ===================
  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl">Loading services...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-xl text-red-500">Error: {error}</div>;
  if (!selectedService) return <div className="min-h-screen flex items-center justify-center text-xl">No services available</div>;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white mx-auto max-w-[1397px] w-full sales-main-section">
        
        {/* ✅ Hero Section */}
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
            <div className="grid lg:grid-cols-2 gap-4 items-center">
              <div className="text-white space-y-2">
                <h1 className="text-5xl font-bold">{selectedService.name}</h1>
                <p className="text-sm text-gray-200 max-w-lg">{selectedService.description}</p>

                <ul className="space-y-2">
                  {selectedService.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="flex items-baseline bg-blue-900 text-white px-2 py-2 min-w-[50px] justify-center">
                        <span className="text-xl font-bold">{feature.duration?.split(" ")[0]}</span>
                        <span className="text-sm ml-1">{feature.duration?.split(" ")[1]}</span>
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
                    <span className="font-medium tracking-wide">Offer Price:</span>
                  </div>
                  <div className="flex items-center text-[#FF073A] font-bold text-4xl">
                    <span className="text-[1.7rem] font-[400] mt-2">₹</span>
                    <span className="px-1 text-[1.7rem] font-[400]">{selectedService.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <motion.img
                src={selectedService.img || "/placeholder.svg"}
                alt={selectedService.name}
                className="relative z-10 w-full h-auto rounded-2xl transition-transform duration-700 ease-out"
                initial={{ opacity: 0, x: 300, scale: 0.7 }}
                animate={{ opacity: 1, x: 0, scale: [0.7, 1.05, 1] }}
                transition={{ duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
              />
            </div>
          </div>
        </motion.section>

        {/* ✅ Services Grid */}
        <section className="bg-gray-50 border-b shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold text-black mb-4">Premium Services</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg overflow-hidden ${
                    selectedService.id === service.id
                      ? "ring-2 ring-blue-500 scale-[1.02]"
                      : "hover:shadow-md"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    <Image
                    width={100} height={100} quality={100} unoptimized={true} 
                      src={service.mainImg || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-[250px] object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                    <div
                      className={`absolute top-3 left-3 ${service.badgeColor} text-black px-2 py-1 rounded-full text-xs font-semibold flex items-center`}
                    >
                      <Award className="h-3 w-3 mr-1" />
                      {service.badge}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-black">{service.name}</h3>
                      <div className="text-lg font-bold text-black">
                        ₹{service.price.toLocaleString()}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      <button
                        className="flex-1 bg-[#002844] text-white font-semibold text-sm py-2 px-3 rounded hover:bg-gray-600 transition-colors"
                        onClick={handleRequestService}
                      >
                        Request Service
                      </button>
                      <button
                        className="flex-1 bg-[#002844] text-white font-semibold text-sm py-2 px-3 rounded hover:bg-gray-600 transition-colors"
                        onClick={() => handleKnowMore(service)}
                      >
                        Know More
                      </button>
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
