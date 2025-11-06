'use client'
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const MainFooter = () => {
  const [locations, setLocations] = useState([]);
  const [socialIcons, setSocialIcons] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch locations and social icons from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch locations
        const locationsResponse = await axios.get('http://localhost:8000/api/locations');
        if (locationsResponse.data.success) {
          setLocations(locationsResponse.data.data);
        }
        
        // Fetch social icons
        const navbarResponse = await axios.get('http://localhost:8000/api/topnavbar');
        if (navbarResponse.data.icons) {
          setSocialIcons(navbarResponse.data.icons);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-rotate through locations with animation
  useEffect(() => {
    if (locations.length <= 1) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentLocationIndex((prevIndex) => 
          prevIndex === locations.length - 1 ? 0 : prevIndex + 1
        );
        setFade(true);
      }, 500); // Half of the animation duration
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [locations.length]);

  

  return (
    <footer className="bg-[#222222] text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Our Services Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">OUR SERVICE</h3>
          <ul className="space-y-2">
            <li><Link href="/book-service" className="hover:text-blue-400 text-sm">Book A Service</Link></li>
            <li><Link href="/maintenance-service" className="hover:text-blue-400 text-sm">Periodic Maintenance Service</Link></li>
            <li><Link href="/health-hygiene-service/overview\" className="hover:text-blue-400 text-sm">Health & Hygiene Services</Link></li>
            <li><Link href="/tire-alignment-service/overview" className="hover:text-blue-400 text-sm">Tire Alignment Services</Link></li>
            <li><Link href="/beautification-service/overview" className="hover:text-blue-400 text-sm">Beautification Services</Link></li>
            <li><Link href="/pick-drop-service" className="hover:text-blue-400 text-sm">Pickup & drop Services</Link></li>
            <li><Link href="/safety-durability-service/overview" className="hover:text-blue-400 text-sm">Safety & Durability Services</Link></li>
            <li><Link href="/roadside-assistance" className="hover:text-blue-400 text-sm">Roadside Assistance Services</Link></li>        
          </ul>
        </div>       
          <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">GALLERY</h3>
          <ul className="space-y-2">
            <li><Link href="work-gallery" className="hover:text-blue-400 text-sm">Work Gallery</Link></li>
            <li><Link href="/achievements-gallery" className="hover:text-blue-400 text-sm">Achievements Gallery</Link></li>
        
          </ul>
        </div>

        {/* Popular Brands Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">CAR SHOWROOOMS</h3>
          <ul className="space-y-2">
            <li><Link href="/location" className="hover:text-blue-400 text-sm">Car Showroom In Motinagar</Link></li>
          </ul>
        </div>
      

        {/* Car Service Near You Section */}
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-lg mb-4 border-b border-gray-600 pb-2">CAR SERVICE</h3>
          <ul className="space-y-2">
            <li><Link href="/location" className="hover:text-blue-400 text-sm">Car Service In Motinagar</Link></li>
            <li><Link href="/location" className="hover:text-blue-400 text-sm">Car Service In Zakhira</Link></li>
            <li><Link href="/location" className="hover:text-blue-400 text-sm">Car Services In Badli</Link></li>
            <li><Link href="/location" className="hover:text-blue-400 text-sm">Car Service Naraina</Link></li>            
          </ul>
        </div>
      </div>
       

      {/* Middle Section with ACR Logo and Contact Info */}
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="text-xl font-bold">
                            <img src={"https://hanshyundai.com/assets/uploads/logo.png"} />

            </div>
            
          </div>
          
          <div className="flex space-x-4 text-sm">
            <Link href="/" className="hover:text-blue-400 text-black">Home</Link>
            <Link href="/about-us" className="hover:text-blue-400 text-black">About Us</Link>
            <Link href="/book-service" className="hover:text-blue-400 text-black">Services</Link>
            <Link href="/terms-condition" className="hover:text-blue-400 text-black">Terms & Conditions</Link>
            <Link href="/contact-us" className="hover:text-blue-400 text-black">Contact</Link>
          </div>
        </div>
      </div>

      {/* Bottom Section with Address and Copyright */}
    <div className="bg-[#222222] border-t border-gray-800 py-6">
  <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center mb-[2rem] sm:mb-0">
    <div className="text-center md:text-left mb-0 sm:mb-4 md:mb-0">
      {isLoading ? (
        <p className="text-sm text-gray-400">Loading locations...</p>
      ) : locations.length > 0 ? (
        <>
        <h4 className="!text-sm">{locations[currentLocationIndex]?.name}</h4>
          <p className="font-semibold">{locations[currentLocationIndex]?.city}</p>
          <p 
            className={`text-sm text-gray-400 transition-opacity duration-500 ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {locations[currentLocationIndex]?.address || 'Unit-1 Plot No 28 & 30, Sector 34, Gurugram, 122001'}
          </p>
          <p className="text-sm mt-1">
            <Link 
              href={`tel:${locations[currentLocationIndex]?.phone || '9810446892'}`} 
              className="text-blue-400 hover:underline"
            >
              {locations[currentLocationIndex]?.phone || '9810446892'}
            </Link>
          </p>
        </>
      ) : (
        <>
          <p className="font-semibold">Gurugram</p>
          <p className="text-sm text-gray-400">Unit-1 Plot No 28 & 30, Sector 34, Gurugram, 122001</p>
          <p className="text-sm mt-1">
            <Link href="tel:9810446892" className="text-blue-400 hover:underline">9810446892</Link>
          </p>
        </>
      )}
    </div>
    
    {/* Copyright Section - Centered between address and icons */}
    <div className="my-0 sm:my-4 md:my-0 text-center">
      <p className="text-sm text-black">© 2025 by Hans Hyundai.</p>
    </div>
    
    <div className="flex space-x-4 text-xl">
      {isLoading ? (
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="w-5 h-5 bg-gray-600 rounded-full animate-pulse"></div>
          ))}
        </div>
      ) : socialIcons.length > 0 ? (
        socialIcons.map((item) => (
    <Link
      key={item.id}
      href={item.url}
      aria-label={item.platform}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full flex items-center justify-center border border-white/30 hover:bg-white/20 transition"
      title={item.platform}
    >
      <i className={item.icon || "fas fa-share-alt"}></i>
    </Link>
  ))
      ) : (
        ""
      )}
    </div>
  </div>
</div>
<br/>
<br/>
    </footer>
  );
};

export default MainFooter;