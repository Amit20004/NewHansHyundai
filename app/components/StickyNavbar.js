'use client';
import React, { useRef, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

// Pages
import HighlightsPage from "../(pages)/(insidePages)/highlight";
import ExteriorPage from "../(pages)/(insidePages)/exterior";
import InteriorPage from "../(pages)/(insidePages)/interior";
import PerformancePage from "../(pages)/(insidePages)/performance";
import SafetyPage from "../(pages)/(insidePages)/safety";
import ConveniencePage from "../(pages)/(insidePages)/convenience";
import EBrochurePage from "../(pages)/(insidePages)/ebrochure";
import SpecificationPage from "../(pages)/(insidePages)/specification";
import ContactUs from '../(pages)/contact-us/page'
const navItems = [
  { label: "Highlights", id: "highlights", component: <HighlightsPage /> },
  { label: "Exterior", id: "exterior", component: <ExteriorPage /> },
  { label: "Interior", id: "interior", component: <InteriorPage /> },
  { label: "Performance", id: "performance", component: <PerformancePage /> },
  { label: "Safety", id: "safety", component: <SafetyPage /> },
  { label: "Convenience", id: "convenience", component: <ConveniencePage /> },
  { label: "Specification", id: "specification", component: <SpecificationPage /> },
  { label: "e-Brochure", id: "brochure", component: <EBrochurePage />, isDownload: true },
];

const StickyNavBar = ({brochureData }) => {

  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0); // ✅ RE-ADD THIS
  // const [isFixed, setIsFixed] = useState(false);
  const [activeTab, setActiveTab] = useState(navItems[0].id);
  const [brochure, setBrochure] = useState(brochureData);

  const triggerRef = useRef(null);
  const contentRef = useRef(null);
   const pathname = usePathname();
  const segments = pathname.split("/");
  const carSlug = decodeURIComponent(segments[segments.length - 1]).toLowerCase();
  

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setIsSticky(currentScroll > lastScrollTop);
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);


  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeComponent = navItems.find(item => item.id === activeTab)?.component;
    useEffect(() => {
      const fetchBrochure = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/car-ebrochure-all/${carSlug}`
          );
  
          if (response.data.success) {
            console.log(response.data.data);
            
            setBrochure(response.data.data);
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          console.error("Error fetching brochure:", error);
          toast.error("Failed to fetch brochure");
        }
      };
  
      if (carSlug) fetchBrochure();
    }, [carSlug]);
  
    const handleDownload = () => {
      if (!brochure?.file_url) {
        toast.error("File not found");
        return;
      }
  
      let fileLink = brochure.file_url.startsWith("http")
        ? brochure.file_url
        : `http://localhost:8000/${brochure.file_url.replace(/^\//, "")}`;
  
      console.log("Downloading from:", fileLink);
  
      const link = document.createElement("a");
      link.href = fileLink;
      link.setAttribute("download", brochure.file_name || `${brochure.car_name}_brochure.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      toast.success("Download started");
    };

  return (
    <>
      {/* Trigger Spacer */}
      <div ref={triggerRef} className=""></div>

      {/* Fixed Navbar */}
      <div className={`${isSticky ? "sticky top-0 z-50" : ""} bg-[#05141f] shadow-md border-b py-7 border-gray-200 transition-all duration-300`}>
        <div className="max-w-[1200px] mx-auto flex items-center gap-2 flex-nowrap justify-start md:justify-center overflow-x-auto md:overflow-x-hidden scrollbar-none">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.isDownload) {
                  handleDownload();
                } else {
                  handleTabClick(item.id);
                }
              }}
              className={`relative text-white px-1 min-w-auto text-base whitespace-nowrap transition-colors duration-300 ease-in-out hover:text-red-400 ${activeTab === item.id ? "text-red-400" : "text-red-400"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div ref={contentRef} className="mt-2 p-2 md:p-3">
        {activeComponent}
      </div>
      <ContactUs/>
    </>
  );
};

export default StickyNavBar;
