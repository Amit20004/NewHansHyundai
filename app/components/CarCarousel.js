"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./ui/Button";
import Image from "next/image";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export default function CarCarousel() {
  const router = useRouter();
  const [carCarousel, setCarCarousel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const fetchCarouselImage = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/car-data");
      if (response.data.success) {
        const mappedData = response.data.data.map((car) => ({
          title: car.name,
          description: `${car.body_style} | ${car.fuel} | ${car.seating} Seater`,
          feature_image: car.feature_image,
          price: `${car.start_price} - ${car.end_price} Lakhs`,
          engine: `${car.engine_cc} cc`,
          transmission: car.transmission,
        }));
        setCarCarousel(mappedData);
      }
    } catch (err) {
      console.error("Error fetching car data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarouselImage();
  }, []);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + carCarousel.length) % carCarousel.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % carCarousel.length);
  };

  const getOffsetImage = (offset) => {
    if (carCarousel.length === 0) return "";
    const newIndex = (index + offset + carCarousel.length) % carCarousel.length;
    return `http://localhost:8000/${carCarousel[newIndex].feature_image}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-black">Loading carousel...</p>
      </div>
    );
  }

  if (!carCarousel || carCarousel.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <p className="text-black">No carousel data found.</p>
      </div>
    );
  }

  const activeCar = carCarousel[index];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className=" bg-gray-200 mb-0"
    >
      {/* Carousel Container */}
      <div className="relative w-full max-w-[1400px] mx-auto flex items-center justify-center h-[220px] sm:h-[300px] md:h-[400px]">
        {/* Prev Button */}
        <button
          onClick={nextSlide}
          className="absolute left-2 z-10 p-1 sm:p-2 bg-gray-800/50 rounded-full text-white hover:bg-gray-800 transition"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>

        {/* Images */}
        <div className="flex items-center justify-center relative w-full max-w-[1400px] gap-2">
          {/* Left Image (Desktop Only) */}
          <div className="hidden md:block w-[200px] h-[240px] opacity-50 scale-90 transition-transform">
            <Image
            width={100} height={100} quality={100} unoptimized={true}
              src={getOffsetImage(-1)}
              alt="Previous"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* Active Image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-[90%] md:w-[900px] h-[220px] sm:h-[300px] md:h-[350px] relative"
            >
              <Image
              width={100} height={100} quality={100} unoptimized={true}
                src={`http://localhost:8000/${activeCar.feature_image}`}
                alt={activeCar.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </AnimatePresence>

          {/* Right Image (Desktop Only) */}
          <div className="hidden md:block w-[200px] h-[240px] opacity-50 scale-90 transition-transform">
            <Image
            width={100} height={100} quality={100} unoptimized={true}
              src={getOffsetImage(1)}
              alt="Next"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={prevSlide}
          className="absolute right-2 z-10 p-1 sm:p-2 bg-gray-800/50 rounded-full text-white hover:bg-gray-800 transition"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
        </button>
      </div>

      

      {/* Text Content */}
      <motion.div variants={fadeUp} className="text-center mt-1 md:mt-1 px-3 sm:px-4">
        <h2 className="text-lg sm:text-xl md:text-3xl text-black font-arial font-extrabold">
          {activeCar.title}
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mt-1 text-xs sm:text-sm md:text-base">
          {activeCar.description}
        </p>
      </motion.div>
            {/* Car Details Section */}
      <motion.div variants={staggerContainer}>
        <div className="flex flex-wrap justify-around sm:gap-3 px-2 py-1 border-t border-b border-gray-300 max-w-[1400px] mx-auto text-center">
          {/* Price */}
          <motion.div variants={fadeUp} className="flex-1 min-w-[120px] sm:min-w-[160px]">
            <p className="!text-black font-semibold text-sm sm:text-base">Starting Price</p>
            <p className="font-medium !text-sm sm:text-base !text-gray-800">₹ {activeCar.price}</p>
            {/* <p className="text-xs !text-black">*Ex-showroom</p> */}
          </motion.div>

          {/* Engine */}
          <motion.div variants={fadeUp} className="flex-1 min-w-[120px] sm:min-w-[160px]">
            <p className="!text-black font-semibold text-sm sm:text-base">Engine Type</p>
            {activeCar.engine.split("\n").map((line, i) => (
              <p key={i} className="font-medium !text-sm sm:text-base !text-gray-800">
                {line}
              </p>
            ))}
          </motion.div>

          {/* Transmission */}
          <motion.div variants={fadeUp} className="flex-1 min-w-[120px] sm:min-w-[160px]">
            <p className="!text-black font-semibold text-sm sm:text-base">
              Transmission Options
            </p>
            {activeCar.transmission.split("\n").map((line, i) => (
              <p key={i} className="font-medium !text-sm sm:text-base !text-gray-800">
                {line}
              </p>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-wrap justify-center gap-3 mt-1 md:mt-1 mb-0 px-2 pt-[10px] pb-[20px]">
        <Button
          btnName={"Explore"}
          func={() =>
            router.push(`/hyundai-${activeCar.title.toLowerCase().replaceAll(" ", "-")}`)
          }
        />
        <Button
          btnName={"Test Drive"}
          func={() =>
            router.push('/test-drive')
          }
        />
      </div>
    </motion.div>
  );
}
