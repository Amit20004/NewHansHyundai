"use client";

import React, { useState, useEffect } from "react";
import {
  // Search,
  // User,
  // MapPin,
  // Share2,
  Menu,
  X,
  ChevronDown,
  ChevronRight,

} from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
// import { BsTypeH4 } from "react-icons/bs";
// import Button from "./ui/Button";
import SlidingForm from "../components/form/SideForm";
import Link  from "next/link";
import Image from "next/image";

const Navbar = () => {
  const router = useRouter();
  const [carData, setCarData] = useState([]); // Store all car data here
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdownName) => {
    setActiveDropdown((prev) => (prev === dropdownName ? null : dropdownName));
  };

  const fetchCarLogos = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/car-logos");
      if (response.data.success) {
        setCarData(response.data.data); // Save API data to state
        console.log("All car data:", response.data.data);
      } else {
        console.log("API call failed:", response.data.message);
      }
    } catch (err) {
      console.error("Error fetching car logos:", err);
    }
  };

  useEffect(() => {
    fetchCarLogos();
  }, []);

  // 🔥 Helper: Get all cars by category (e.g., SUV)
  // const getCarsByCategory = (category) => {
  //   return carData.filter((car) => car.category === category);
  // };

  // 🔥 Helper: Get a single car by name (e.g., CRETA)
  const getCarByName = (name) => {
    return carData.find((car) => car.name === name);
  };

  const carModels = {
    SUV: [
      {
        name: "EXTER",
        image: getCarByName("EXTER")?.image || "/placeholder.png",
      },
      {
        name: "CRETA",
        image: getCarByName("CRETA")?.image || "/placeholder.png",
      },
      {
        name: "ALCAZAR",
        image: getCarByName("ALCAZAR")?.image || "/placeholder.png",
      },
      {
        name: "TUCSON",
        image: getCarByName("TUCSON")?.image || "/placeholder.png",
      },
      {
        name: "VENUE",
        image: getCarByName("VENUE")?.image || "/placeholder.png",
      },
    ],
    Sedan: [
      {
        name: "AURA",
        image: getCarByName("AURA")?.image || "/placeholder.png",
      },
      {
        name: "VERNA",
        image: getCarByName("VERNA")?.image || "/placeholder.png",
      },
    ],
    Hatchback: [
      {
        name: "i10 NIOS",
        image: getCarByName("i10")?.image || "/placeholder.png",
      },
      { name: "i20", image: getCarByName("i20")?.image || "/placeholder.png" },
    ],
    Electric: [
      {
        name: "IONIQ 5",
        image: getCarByName("IONIQ 5")?.image || "/placeholder.png",
      },
      // {
      //   name: "KONA Electric",
      //   image: getCarByName("CRETA ELECTRIC")?.image || "/placeholder.png",
      // },
      {
        name: "CRETA EV",
        image: getCarByName("CRETA ELECTRIC")?.image || "/placeholder.png",
      },
    ],
    "N Line": [
      {
        name: "CRETA N LINE",
        image: getCarByName("CRETA N LINE")?.image || "/placeholder.png",
      },
      {
        name: "VENUE N LINE",
        image: getCarByName("VENUE N LINE")?.image || "/placeholder.png",
      },
      {
        name: "i20 N LINE",
        image: getCarByName("i20 N LINE")?.image || "/placeholder.png",
      },
    ],
  };

  const categories = ["ALL", ...Object.keys(carModels)];

  const mainNavItems = [
    {
      name: "Find a Car",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="container mx-auto px-4 py-8 z-60">
          <div className="flex flex-wrap gap-2 pb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-200
              ${
                activeCategory === category
                  ? "text-[#05141f] after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[1px] after:h-[2px] after:bg-[#013566]"
                  : "text-gray-700 hover:text-[#05141f]"
              }`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="py-2">
            {activeCategory === "ALL" ? (
              <div className="space-y-0 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(carModels).map(([category, cars]) => (
                  <div key={category} className="space-y-0">
                    <h6 className="text-xl font-bold text-gray-900 flex items-center">
                      <span className=" text-[#013566] px-4 py-2 rounded-full mr-2 text-md font-semibold">
                        {category}
                      </span>
                    </h6>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {cars.map((car) => (
                        <div
                          key={`${category}-${car.name}`}
                                                       
                          className="group flex flex-col items-center  rounded-xl transition-all duration-300 cursor-pointer border border-transparent  "
                        >
                          <div className="w-full h-25 mb-1 flex items-center justify-center">
                            <Link  
                             prefetch={false} reloadDocument
                            href={`/hyundai-${car.name
    .toLowerCase()
    .replaceAll(" ", "-")}`}><Image
    width={100} height={100} quality={100} unoptimized={true}


                              src={
                                car?.image
                                  ? `http://localhost:8000/${car.image}`
                                  : "/placeholder.png"
                              }
                              alt={car?.name || "Car"}
                              className="object-contain h-50 w-50 transition-transform duration-300 group-hover:scale-110"
                              onError={(e) => {
                                e.target.src = "/placeholder.png";
                              }}
                            />
                            </Link >
                          </div>
                          <span className="text-base font-semibold text-gray-800 group-hover:text-[#05141f] text-center">
                            {car.name}
                          </span>
                        <Link  
                           prefetch={false} reloadDocument
                          href={`/hyundai-${car.name
    .toLowerCase()
    .replaceAll(" ", "-")}`} className="text-xs text-[#013566] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 flex items-center">
                            Explore <ChevronRight size={14} className="ml-1" />
                          </Link >
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {carModels[activeCategory]?.map((car) => (
                  <div
                    key={car.name}
                    className="group flex flex-col items-center p-4 font-medium rounded-xl transition-all duration-300 cursor-pointer border border-transparent "
                  >
                    <div className="w-full h-32 mb-4 flex items-center justify-center">
                      <Image
                      width={100} height={100} quality={100} unoptimized={true}
                        src={
                          car?.image
                            ? `http://localhost:8000/${car.image}`
                            : "/placeholder.png"
                        }
                        alt={car?.name || "Car"}
                        className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "/placeholder.png";
                        }}
                      />
                    </div>
                    <span className="text-base font-semibold text-gray-800 group-hover:text-[#05141f] text-center">
                      {car.name}
                    </span>
                   <Link  
                     prefetch={false} reloadDocument
                    href={`/hyundai-${car.name
    .toLowerCase()
    .replaceAll(" ", "-")}`}

                      className="text-xs text-[#05141f] opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1 flex items-center"
                       
                    >
                      Explore <ChevronRight size={14} className="ml-1" />
                    </Link >
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      name: "Buyers Guide",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="w-full max-w-full mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Column 1 */}
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/accessories"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Accessories
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/car-price"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Prices & Offers
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/insurance"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Insurance
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/ebrochure"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Download Brochure
                  </span>
                </Link >
              </li>
            </ul>
          </div>
        </div>
      ),
    },

    {
      name: "Services",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Column 1 */}
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/book-service"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Book Service
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/pick-drop-service"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Pickup & Drop Service
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/roadside-assistance"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Roadside Assistance
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/maintenance-service"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Periodic Maintenance
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/tire-alignment-service/overview"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Tire & Alignment
                  </span>
                </Link >
              </li>
            </ul>

            {/* Column 2 */}
            <ul className="space-y-3 text-sm">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/health-hygiene-service/overview"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Health & Hygiene Service
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/beautification-service/overview"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Beautification
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/safety-durability-service/overview"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Safety & Durabiliity
                  </span>
                </Link >
              </li>
              {/* <li>
                <Link 
                prefetch={false}  
                 prefetch={false} reloadDocument
                href="/interior-service"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Interior Care
                  </span>
                </Link >
              </li> */}
            </ul>
          </div>
        </div>
      ),
    },

    {
      name: "Finance",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Column 1 */}
            <ul className="space-x-4">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/loan-finance"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Loan Enquiry
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/documentation-finance"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Documentation
                  </span>
                </Link >
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      name: "Offers",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Column 1 */}
            <ul className="space-x-4">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/sales-offer"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Sales Offers
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/service-offer"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Service Offers
                  </span>
                </Link >
              </li>
            </ul>
          </div>
        </div>
      ),
    },
     {
      name: "Our Loaction",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Column 1 */}
            <ul className="space-x-4">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/location"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Sales Location
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/location"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Service Location
                  </span>
                </Link >
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      name: "Others",
      hasDropdown: true,
      isFullWidth: true,
      dropdownContent: (
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
            {/* Column 1 */}
            <ul className="space-x-4">
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/about-us"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    About Us
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/contact-us"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Contact Us
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/gallery/work-gallery"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Work Gallery
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/gallery/achievements-gallery"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Achievements Gallery
                  </span>
                </Link >
              </li>
              {/* <li>
                <Link 
                prefetch={false}  
                 prefetch={false} reloadDocument
                href="/blogs"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Our Blogs
                  </span>
                </Link >
              </li> */}
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/testimonial"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    Testimonials
                  </span>
                </Link >
              </li>
              <li>
                <Link 
                   prefetch={false} reloadDocument
                  href="/faq"
                  className="relative block py-2 px-4 font-medium text-gray-700 transition-all duration-300 hover:text-[#05141f]"
                >
                  <span
                    className="relative inline-block
                   before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[1px] before:bg-[#013566]
                   before:transition-all before:duration-300 hover:before:w-full"
                  >
                    FAQ
                  </span>
                </Link >
              </li>
            </ul>
          </div>
        </div>
      ),
    },

   
  ];

  return (
    <div
      className={`bg-white sticky top-0 z-50 transition-all duration-300 mx-auto w-100vw margin-left: calc(-50vw + 50%);
 ${isScrolled ? "shadow-lg" : "shadow-sm"}`}
    >
      {/* Main navigation container */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-7">
        <div className="relative flex items-center justify-between h-20 ">
          {/* Logo - Left aligned */}
          <div className="flex items-center">
            <div
              className="text-2xl font-bold text-[#05141f] cursor-pointer flex items-center transition-transform duration-300 hover:scale-105"
              onClick={() => {
                // closeAllMenus();
                router.push("/");
              }}
            >
              <Image width={200} height={150} quality={100} unoptimized={true} src={"https://hanshyundai.com/assets/uploads/logo.png"} />
            </div>
          </div>

          {/* Desktop Navigation - Center aligned */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex space-x-1">
              {mainNavItems?.map((item) => (
                <div key={item.name} className="relative group">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`text-gray-800 px-2 py-2 xl:text-[0.9rem] lg:text-[0.8rem] font-medium transition-all duration-300 hover:text-[#05141f] flex items-center relative group ${
                      activeDropdown === item.name
                        ? "text-[#05141f] font-semibold"
                        : ""
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={14}
                        className={`ml-1 transition-transform duration-300 ease-in-out ${
                          activeDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                    <span
                      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-[#013566] transition-all duration-300 ${
                        activeDropdown === item.name
                          ? "w-4/5"
                          : "w-0 group-hover:w-4/5"
                      }`}
                    ></span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right side icons - Search and Account */}
          <div className="flex items-center space-x-4">
            {/* <button className="text-gray-600 hover:text-[#05141f] transition-colors p-2 rounded-full hover:bg-gray-100 hidden lg:block">
              <Search size={20} />
            </button>
            <button className="text-gray-600 hover:text-[#05141f] transition-colors p-2 rounded-full hover:bg-gray-100 hidden lg:block">
              <User size={20} />
            </button> */}
            {/* <Button btnName={"Find More"} /> */}
            <div className="hidden md:block">
              <SlidingForm />
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setActiveDropdown(null);
              }}
              className="lg:hidden text-gray-600 hover:text-[#05141f] transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Desktop Dropdown Panels */}
        {activeDropdown && (
          <div className="hidden lg:block absolute left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40 animate-fadeIn">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
              {
                mainNavItems.find((item) => item.name === activeDropdown)
                  ?.dropdownContent
              }
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-white z-40 mt-20 overflow-y-auto pb-20">
          <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 py-4">
            <div className="space-y-1">
              {mainNavItems.map((item) => (
                <div key={item.name} className="border-b border-gray-100">
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`block w-full text-left text-gray-700 hover:text-[#05141f] sm:py-4 py-5 px-2 text-base font-medium transition-colors ${
                      activeDropdown === item.name
                        ? "text-[#05141f] font-semibold"
                        : ""
                    } flex justify-between items-center`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${
                          activeDropdown === item.name
                            ? "transform rotate-180"
                            : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown Content */}
                  {item.hasDropdown && activeDropdown === item.name && (
                    <div className=" space-y-2">
                      {item.name === "Our Cars" ? (
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2 pb-2">
                            {categories.map((category) => (
                              <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`text-sm font-medium px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                                  activeCategory === category
                                    ? "text-white bg-[#05141f] shadow-md"
                                    : "text-gray-700 bg-gray-100 hover:bg-gray-200"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-6">
                            {activeCategory === "ALL" ? (
                              Object.entries(carModels).map(
                                ([category, cars]) => (
                                  <div key={category} className="space-y-3">
                                    <h4 className="font-bold text-gray-900 text-base flex items-center">
                                      <span className="bg-blue-100 text-[#05141f] px-2 py-1 rounded-full mr-2 text-xs">
                                        {category}
                                      </span>
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 pl-1">
                                      {cars.map((car) => (
                                        <div
                                          key={`${category}-${car.name}`}
                                          className="flex flex-col items-center p-3 font-medium rounded-lg transition-all duration-200 border border-transparent hover:border-blue-100"
                                          onClick={() => {
                                            //   navigate(`/models/${car.name.toLowerCase().replace(/\s+/g, "-")}`)
                                            closeAllMenus();
                                          }}
                                        >
                                          <div className="w-full h-20 mb-2 flex items-center justify-center">
                                            <Image
                                            width={100} height={100} quality={100} unoptimized={true}
                                              src={
                                                car?.image || "/placeholder.png"
                                              } // fallback if image missing
                                              alt={car?.name || "Car"}
                                              className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-110"
                                            />
                                          </div>
                                          <span className="text-sm font-semibold text-gray-700 text-center">
                                            {car.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <div className="grid grid-cols-2 gap-3">
                                {carModels[activeCategory]?.map((car) => (
                                  <div
                                    key={car.name}
                                    className="flex flex-col items-center p-3 font-medium rounded-lg transition-all duration-200 border border-transparent hover:border-blue-100"
                                    onClick={() => {
                                      //   navigate(`/models/${car.name.toLowerCase().replace(/\s+/g, "-")}`)
                                      closeAllMenus();
                                    }}
                                  >
                                    <div className="w-full h-20 mb-2 flex items-center justify-center">
                                      <Image
                                      width={100} height={100} quality={100} unoptimized={true}
                                        src={car?.image || "/placeholder.png"} // fallback if image missing
                                        alt={car?.name || "Car"}
                                        className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-110"
                                      />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 text-center">
                                      {car.name}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        React.cloneElement(item.dropdownContent, {
                          className: "py-2 w-full",
                        })
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile bottom action buttons */}
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-between">
               <button 
  onClick={() => window.location.assign('/book-service')} 
  className="flex-1 bg-[#05141f] text-white py-3 px-4 text-sm font-medium hover:bg-[#00408F] transition-colors duration-300 mx-1"
>
  Book A Service
</button>
<button 
  onClick={() => window.location.assign('/test-drive')} 
  className="flex-1 bg-white border border-[#05141f] text-[#05141f] py-3 px-4 text-sm font-medium hover:bg-[#05141f] hover:text-white transition-colors duration-300 mx-1"
>
  Book Test Drive
</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(isMobileMenuOpen || activeDropdown) && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={closeAllMenus}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
