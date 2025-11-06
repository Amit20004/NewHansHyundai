// src/pages/HomeFeatures.js
"use client";
import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "./ui/Button";
import axios from "axios";
import { useRouter } from "next/navigation";

const HomeFeatures = ({ carCarouselRef }) => {
  const [introSection, setIntroSection] = useState(null);
  const [statsSection, setStatsSection] = useState(null);
  const [serviceData, setServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const totalItems = serviceData.length;
  const [locations, setLocations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate=useRouter();
const scrollToCarousel = () => {
  if (!carCarouselRef.current) return;

  const targetPosition = carCarouselRef.current.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 1000; // 👈 duration in ms (slower if you increase)
  let start = null;

  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = timestamp - start;
    const percent = Math.min(progress / duration, 1);
    window.scrollTo(0, startPosition + distance * percent);

    if (progress < duration) {
      requestAnimationFrame(step);
    }
  };

  requestAnimationFrame(step);
};



  // Auto-change every 4 seconds
  useEffect(() => {
    if (locations.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % locations.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [locations]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/home-about/locations")
      .then((res) => {
        setLocations(res.data.data); // your backend sends { section, data }
      })
      .catch((err) => {
        console.error("Error fetching locations:", err);
      });
  }, []);
  // Auto slider for services
  useEffect(() => {
    if (totalItems > 0) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % totalItems);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [totalItems]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/fetch-home-car-service"
        );
        const formatted = res.data.data.map((service) => ({
          ...service,
          points:
            typeof service.points === "string"
              ? JSON.parse(service.points)
              : service.points,
        }));
        setServiceData(formatted);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, []);

  // Fetch intro section
  useEffect(() => {
    const fetchIntro = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/home-about/intro"
        );
        setIntroSection(res.data.data[0]); // only one expected
        console.log("intro", res.data.data[0]);
      } catch (err) {
        console.error("Error fetching intro:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIntro();
  }, []);

  // Fetch stats section
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8000/api/home-about/stats"
        );
        setStatsSection(res.data.data);
        console.log("stats", res.data.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-white text-gray-800 mx-auto overflow-hidden home-feature mt-0">
      {/* Hero Section */}
      <motion.section
        className="relative flex items-center justify-center text-center py-3 sm:py-8 px-4 overflow-hidden bg-[#013566]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">
            Hans Hyundai <br />
            <span className="heading">
              <h2>Showroom & Service Centers</h2>
            </span>
          </h1>
          <p className="text-lg md:text-md text-white/90 max-w-3xl mx-auto mb-3 feature_p1">
            Hyundai Sales, Service & Support – All in One Place.
          </p>
         <motion.button
        className="bg-white text-[#013566] font-semibold py-1 px-4 rounded-sm hover:bg-gray-100 transition"
        onClick={scrollToCarousel}
      >
        Explore Hyundai Models
      </motion.button>
        </motion.div>
      </motion.section>

      {/* About Section */}
      <motion.section className="py-4 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Intro Content */}
          <motion.div>
            {introSection && (
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#013566] mb-2">
                  {introSection.heading}
                </h3>
                <p className="text-gray-700 mb-3">{introSection.content}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {statsSection &&
                statsSection.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="bg-white px-4 py-2 rounded-sm shadow-sm border border-gray-100"
                  >
                    <div className="text-[#013566] text-2xl font-bold mb-1">
                      {stat.value}
                    </div>
                    <h6 className="font-medium !text-gray-800 text-sm">
                      {stat.title}
                    </h6>
                  </motion.div>
                ))}
            </div>
          </motion.div>

          {/* Location (Static for now, you will change later) */}
          <motion.div className="bg-[#013566] h-[225px] text-white p-6 rounded-sm shadow-md flex flex-col justify-between">
            <h5 className="!text-2xl font-bold mb-4">
              Our Presence Across Delhi
            </h5>

            <div className="relative flex-1 mt-2">
              <AnimatePresence
               mode="wait">
                {locations.length > 0 && (
                  <motion.div
                    key={locations[currentIndex].id}
                    className="absolute inset-0 flex items-start rounded-md"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white p-1.5 rounded-sm mr-3 mt-0.5">
                      📍
                    </div>
                    <div>
                      <h6 className="!font-semibold">
                        {locations[currentIndex].name}
                      </h6>
                      <p className="!text-white text-sm">
                        {locations[currentIndex].address}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section className="py-2 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#013566] mb-2">
              {serviceData[0]?.main_heading}
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {serviceData[0]?.main_content}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-2">
            {serviceData.map((service, index) => (
              <motion.button
                key={index}
                className={`px-4 py-2 text-sm font-medium transition ${
                  current === index
                    ? "bg-[#013566] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrent(index)}
              >
                {service.tab_title}
              </motion.button>
            ))}
          </div>

          {/* Active Tab */}
          {serviceData[current] && (
            <motion.div className="bg-gray-50  p-6 shadow-sm">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h6 className="text-xl font-bold text-[#013566] mb-2">
                    {serviceData[current].tab_title}
                  </h6>
                  <ul className="space-y-2">
                    {serviceData[current].points.map((point, i) => (
                      <li key={i} className="flex items-start text-gray-700">
                        <span className="text-[#013566] mr-2">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative h-48  overflow-hidden">
                  <img
                    src={`http://localhost:8000${serviceData[current].image_url}`} 
                    alt={serviceData[current].tab_title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* CTA */}
      <motion.section className="py-8 px-4 md:px-8 text-center bg-[#013566] text-white w-full">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Ready to Drive or Service Your Hyundai?
          </h2>
          <p className="text-white/90 mb-2">
            Book a test drive, visit our showroom, or schedule your next
            service.
          </p>
          <div className="flex flex-wrap justify-center gap-5 feature-buttons">
            <Button btnName={"Book A Service"} color={"white"} func={()=>navigate.push('/book-service')} />
            <Button btnName={"Book A Test Drive"} color={"white"} func={()=>navigate.push('/test-drive')}/>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomeFeatures;
