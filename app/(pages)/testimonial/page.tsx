"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import ResponsiveBanner from "../../components/banner/ResponsiveBanner";
import Image from "next/image";

type Testimonial = {
  id: number;
  person_name: string;
  person_message: string;
  image: string;
};

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from backend
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/testimonials");
        setTestimonials(res.data.data);
        console.log("Fetched testimonials:", res.data.data);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  // Auto-slide effect
  useEffect(() => {
    if (testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  if (loading) {
    return (
      <>
        <ResponsiveBanner />
        <div className="text-center py-10 text-lg">Loading testimonials...</div>
      </>
    );
  }

  if (testimonials.length === 0) {
    return (
      <>
        <ResponsiveBanner />
        <div className="text-center py-10 text-red-500">
          No testimonials available.
        </div>
      </>
    );
  }

  return (
    <>
      <ResponsiveBanner />
      <section className="w-full bg-gray-200 py-5 mx-auto max-w-[1400px]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
            What People Say About Us
          </h2>

          <div className="relative max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8">
              {/* Circular Image */}
              <div className="hidden md:block flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000/${testimonials[currentIndex].person_image}`}
                    alt={testimonials[currentIndex].person_name}
                  
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Testimonial Content */}
              <div className="bg-white p-8 md:p-10 rounded-lg shadow-sm text-center md:text-left flex-1">
                {/* <div className="text-6xl font-serif text-gray-300 mb-4">"</div> */}
                <p className="text-lg md:text-xl text-gray-600 italic mb-6">
                  {testimonials[currentIndex].message}
                </p>
                <div className="border-t border-gray-200 pt-6">
                  <p className="font-bold text-gray-800">
                    {testimonials[currentIndex].person_name}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrev}
              className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
              aria-label="Previous testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
              aria-label="Next testimonial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentIndex === index ? "bg-gray-800" : "bg-gray-300"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
