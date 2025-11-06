'use client'
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaCar, FaShoppingCart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const StickyFooter = () => {
  const router = useRouter();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Current scroll
      const docHeight = document.documentElement.scrollHeight - window.innerHeight; // Total scrollable area
      const scrolledPercentage = (scrollTop / docHeight) * 100;

      if (scrolledPercentage > 50) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`fixed bottom-0 left-0 right-0 bg-[#05141f] text-white shadow-lg z-40 mx-auto w-full transition-transform duration-500 ${
        showFooter ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex justify-between items-center">
        {/* Locate Us */}
        <div className="flex-1 text-center border-r border-white/20 py-3 transition-colors cursor-pointer hover:bg-[#002844]">
          <button
            className="flex flex-col items-center justify-center w-full px-2 cursor-pointer"
            onClick={() => router.push("/location")}
          >
            <FaMapMarkerAlt className="text-xl mb-1" />
            <span className="text-xs sm:text-sm">Locate Us</span>
          </button>
        </div>

        {/* Request a Test Drive */}
        <div
          className="flex-1 text-center border-r border-white/20 py-3 transition-colors cursor-pointer hover:bg-[#002844]"
          onClick={() => router.push("/test-drive")}
        >
          <button className="flex flex-col items-center justify-center w-full px-2 cursor-pointer">
            <FaCar className="text-xl mb-1" />
            <span className="text-xs sm:text-sm">Request a Test Drive</span>
          </button>
        </div>

        {/* Click To Buy */}
        <div className="flex-1 text-center py-3 transition-colors cursor-pointer hover:bg-[#002844]">
          <button className="flex flex-col items-center justify-center w-full px-2 cursor-pointer">
            <FaShoppingCart className="text-xl mb-1" />
            <span className="text-xs sm:text-sm">Click To Buy</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default StickyFooter;
