"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import axios from "axios";
import { usePathname } from "next/navigation";
import DataNotFound from '../components/error/DataNotFound';

const CarGallerySection = () => {
  const pathname = usePathname(); // e.g., "/car/creta"
  const segments = pathname.split('/');
  const carName = segments[segments.length - 1]?.toLowerCase(); // "creta"

  const [galleryData, setGalleryData] = useState([]);
  const [error, setError] = useState(""); // empty string = no error
  const [loading, setLoading] = useState(true);

  const mainSlider = useRef(null);
  const thumbSlider = useRef(null);

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);

  useEffect(() => {
    setNav1(mainSlider.current);
    setNav2(thumbSlider.current);
  }, []);

  useEffect(() => {
    const fetchGalleryData = async () => {
      setLoading(true);
      setError(""); // clear previous errors
      try {
        const response = await axios.get("http://localhost:8000/api/highlight-gallery");
        if (response.data.success) {
          const carGallery = response.data.data;
          const filteredData = carGallery.filter(
            (item) => item.car_name.toLowerCase() === carName
          );

          if (filteredData.length > 0) {
            setGalleryData(filteredData);
          } else {
            setError("No gallery data found for this car.");
          }
        } else {
          setError("Failed to fetch gallery data from server.");
        }
      } catch (err) {
        console.error("Error fetching gallery data:", err);
        setError("An unexpected error occurred while fetching gallery data.");
      } finally {
        setLoading(false);
      }
    };

    if (carName) {
      fetchGalleryData();
    }
  }, [carName]);

  if (loading) {
    return (
      <div className="w-full text-center py-10 text-gray-600">
        Loading data...
      </div>
    );
  }

  if (error) {
    return <DataNotFound msg={error} />;
  }

  return (
    <div className="px-4 py-5 mb-10 mt-0 max-w-full w-full mx-auto bg-gray-200">
      {/* Main Slider */}
      <div className="relative max-w-5xl mx-auto">
        <button
          onClick={() => mainSlider.current.slickPrev()}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black text-white opacity-60 hover:opacity-80 p-2 z-10 rounded-full"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        <button
          onClick={() => mainSlider.current.slickNext()}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black text-white opacity-60 hover:opacity-80 p-2 z-10 rounded-full"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>

        <Slider
          asNavFor={nav2}
          ref={mainSlider}
          arrows={false}
          autoplay
          autoplaySpeed={3000}
          infinite
          speed={500}
          fade
          slidesToShow={1}
          swipeToSlide
        >
          {galleryData.map((img, i) => (
            <Image
            width={100} height={100} quality={100} unoptimized={true}
              key={i}
              src={`http://localhost:8000/${img.image_url}`}
              alt={`Main slide ${i}`}
              className="w-full max-h-[500px] object-cover rounded-sm"
            />
          ))}
        </Slider>
      </div>

      {/* Thumbnail Slider */}
      <div className="mt-4 max-w-5xl mx-auto">
        <Slider
          asNavFor={nav1}
          ref={thumbSlider}
          slidesToShow={5}
          swipeToSlide
          focusOnSelect
          arrows={false}
          infinite
          responsive={[
            { breakpoint: 960, settings: { slidesToShow: 4 } },
            { breakpoint: 600, settings: { slidesToShow: 3 } },
            { breakpoint: 400, settings: { slidesToShow: 2 } },
          ]}
        >
          {galleryData.map((img, i) => (
            <Image
            width={100} height={100} quality={100} unoptimized={true}
              key={i}
              src={`http://localhost:8000/${img.image_url}`}
              alt={`Thumbnail ${i}`}
              className="w-full max-h-[500px] object-cover"
            />
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CarGallerySection;
