"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Services = () => {
  const router = useRouter();
  const [homeService, setHomeService] = useState([]);

  // ✅ Fetch service images
  useEffect(() => {
    const fetchServiceImages = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/home-services");
        if (response.data.success) setHomeService(response.data.data);
      } catch (error) {
        console.error("Error fetching home services:", error);
      }
    };
    fetchServiceImages();
  }, []);

  // ✅ Prefetch routes (added `router` to dependency array)
  useEffect(() => {
    if (!homeService || homeService.length === 0) return;

    homeService.forEach((service) => {
      if (service.target_url) {
        router.prefetch(service.target_url);
      }
    });
  }, [homeService, router]); // ← fixed dependency warning here

  return (
    <motion.div className="main-service-box flex flex-wrap justify-center w-full mx-auto mb-1 gap-4 px-2 mt-5">
      {homeService.map((service, idx) => (
        <motion.div
          key={idx}
          onClick={() => router.push(service.target_url)}
          className="service-box relative group w-full sm:w-[48%] cursor-pointer"
        >
          {/* ✅ Using Next.js <Image /> correctly */}
          <Image
            src={`http://localhost:8000${service.imageUrl}`}
            alt={service.serviceName}
            className="w-full h-auto object-cover"
            width={800}
            height={600}
            priority={idx < 2} // Prioritize first few images for better LCP
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>

          {/* Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-white text-xl sm:text-2xl font-semibold text-center p-4">
              {service.serviceName}
            </h2>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Services;
