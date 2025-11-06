'use client';
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';

const Carousel = () => {
  const [carouselImages, setCarouselImages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [progress, setProgress] = useState(0);

  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const carouselRef = useRef(null);

  const slideDuration = 5000;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;

  // Fetch images
  const fetchCarouselImage = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/home-carousel");
      if (response.data.success) {
        setCarouselImages(response.data.data);
        console.log("All carousel images:", response.data.data);
      } else {
        console.log("API call failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching carousel images:", err);
    }
  };

  useEffect(() => {
    fetchCarouselImage();
  }, []);

  // Helper to get image by name
  const getCarouselImage = (name) => {
    return carouselImages.find((car) => car.image_name === name);
  };

  const I20 = getCarouselImage("C-I20.jpg")?.image_url || "/placeholder.png";
  const Venue = getCarouselImage("C-VENUE.jpg")?.image_url || "/placeholder.png";
  const IONIQ5 = getCarouselImage("C-IONIQ5.jpg")?.image_url || "/placeholder.png";
  const CreatEL = getCarouselImage("C-CRETAEL.jpg")?.image_url || "/placeholder.png";

  // Build slides array (prepend API base path for all images)
  const slides = [
    `http://localhost:8000${I20}`,
    `http://localhost:8000${Venue}`,
    `http://localhost:8000${IONIQ5}`,
    `http://localhost:8000${CreatEL}`
  ];

  // Slide functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  // Autoplay effect
  useEffect(() => {
    if (isPlaying && !isDragging) {
      intervalRef.current = setInterval(nextSlide, slideDuration);
      const start = Date.now();

      const updateProgress = () => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / slideDuration) * 100, 100);
        setProgress(percent);
        if (percent < 100) {
          progressRef.current = setTimeout(updateProgress, 100);
        }
      };

      updateProgress();
    } else {
      clearInterval(intervalRef.current);
      clearTimeout(progressRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(progressRef.current);
    };
  }, [isPlaying, isDragging, currentSlide]);

  // Touch events for mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX);
    setDragOffset(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const offset = e.touches[0].clientX - dragStart;
    setDragOffset(offset);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const threshold = 50;
    if (dragOffset > threshold) {
      prevSlide();
    } else if (dragOffset < -threshold) {
      nextSlide();
    }

    setIsDragging(false);
    setDragOffset(0);
  };

  // Responsive height
  const [carouselHeight, setCarouselHeight] = useState('400px');

  useEffect(() => {
    const calculateHeight = () => {
      if (window.innerWidth >= 1280) return '500px';
      if (window.innerWidth >= 1024) return '450px';
      if (window.innerWidth >= 768) return '400px';
      return '25vh';
    };

    setCarouselHeight(calculateHeight());
    const handleResize = () => setCarouselHeight(calculateHeight());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full max-w-screen mx-auto">
      {/* Desktop Carousel */}
      <div
        className="hidden md:block relative w-full h-full overflow-hidden shadow-lg"
        style={{ height: carouselHeight }}
        ref={carouselRef}
      >
        {slides.map((img, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full   flex items-center justify-center transition-all duration-1000 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <Image width={100} height={100} quality={100} unoptimized={true} src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
            </div>
          );
        })}

        {/* Desktop Controls */}
        <div className="absolute bottom-5 right-4 flex items-center space-x-4 z-30">
          <div className="relative w-10 h-10">
            <svg className="absolute top-0 left-0" width="40" height="40">
              <circle
                cx="20"
                cy="20"
                r={radius}
                stroke="#ffffff55"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="20"
                cy="20"
                r={radius}
                stroke="#ffffff"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (progress / 100) * circumference}
                strokeLinecap="round"
                transform="rotate(-90 20 20)"
              />
            </svg>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/30 transition"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>
          <button
            onClick={prevSlide}
            className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            className="bg-white/20 p-2 rounded-full text-white hover:bg-white/30 transition"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      {/* Mobile Carousel */}
      <div
        className="md:hidden relative w-full overflow-hidden touch-none mt-4 bg-black"
        style={{ height: carouselHeight }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((img, index) => {
          const isActive = index === currentSlide;
          const translateX = isDragging ? dragOffset : 0;

          return (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-out ${
                isActive ? 'z-10' : 'z-0'
              }`}
              style={{
                transform: `translateX(${translateX}px)`,
                opacity: isActive ? 1 : 0,
              }}
            >
              <Image src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" width={100} height={100} quality={100} unoptimized={true} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
