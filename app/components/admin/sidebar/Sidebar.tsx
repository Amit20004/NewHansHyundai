"use client"

import {
  Home,
  Car,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react"
import { useState, useEffect } from "react"

interface SidebarProps {
  isOpen: boolean
  activeMenu: string
  setActiveMenu: (menu: string) => void
  onClose: () => void
  onToggle: () => void // ✅ NEW: to toggle open/close
}

const menuItems = [
  { name: "Dashboard", icon: Home, hasSubmenu: false },
  {
    name: "Car Listing",
    icon: Car,
    hasSubmenu: true,
    submenu: [
      "All Cars",
      "Car Accessory",
      "Car Price",
      "Car Color Change",
      "Highlights",
      "Highlight AboutUs",
      "Exterior",
      "Interior",
      "Performance",
      "Safety Durability",
      "Convenience",
      "Specification",
    ],
  },
  {
    name: "Car Offers",
    icon: Car,
    hasSubmenu: true,
    submenu: ["Sales Offers", "Services Offers"],
  },
  {
    name: "FAQ",
    icon: Car,
    hasSubmenu: false,
  },
  {
    name: "Enquiry",
    icon: FileText,
    hasSubmenu: true,
    submenu: [
      "Service",
      "Sales/Test Drive",
      "Contact Us",
      "Car Accessory Enquiry",
      "Loan Enquiry",
      "Side Form Enquiry",
      "Insurance Enquiry",
      "PickDrop Enquiry",
    ],
  },
  { name: "Testimonials", icon: FileText, hasSubmenu: false },
  { name: "Brochures", icon: FileText, hasSubmenu: false },
  { name: "Pages", icon: FileText, hasSubmenu: false },
  { name: "Banners", icon: FileText, hasSubmenu: false },
  { name: "Services", icon: FileText, hasSubmenu: false },
  { name: "About Us", icon: FileText, hasSubmenu: false },
  {
    name: "Home Page",
    icon: FileText,
    hasSubmenu: true,
    submenu: [
      "Home Slider",
      "Home Tabs Section",
      "Home About Section1",
      "Home About Section2",
      "Home Services",
    ],
  },
  {
    name: "Loactions",
    icon: FileText,
    hasSubmenu: true,
    submenu: ["Location", "Detailed Location"],
  },
  {
    name: "Headers",
    icon: FileText,
    hasSubmenu: true,
    submenu: ["Top Navbar", "Main Navbar", "Car Logos"],
  },
  { name: "Documentation", icon: FileText, hasSubmenu: false },
  { name: "Gallery", icon: FileText, hasSubmenu: false },
  { name: "MetaData", icon: FileText, hasSubmenu: false },
]

export default function Sidebar({
  isOpen,
  activeMenu,
  setActiveMenu,
  onClose,
  onToggle,
}: SidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSubmenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    )
  }

  const handleMenuClick = (menuName: string, hasSubmenu: boolean) => {
    if (hasSubmenu) {
      toggleSubmenu(menuName)
    } else {
      setActiveMenu(menuName)
      if (isMobile) onClose()
    }
  }

  return (
    <>
      {/* Hamburger / Cross Button */}
      {isMobile && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-50 flex flex-col justify-center items-center w-10 h-10 bg-white rounded-lg shadow-md lg:hidden transition-all duration-300"
        >
          {/* Top bar */}
          <span
            className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          />
          {/* Middle bar */}
          <span
            className={`block w-5 h-0.5 bg-gray-800 rounded my-1 transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          {/* Bottom bar */}
          <span
            className={`block w-5 h-0.5 bg-gray-800 rounded transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700">
          <h1 className="!text-xl font-bold text-white">HANS HYUNDAI</h1>
        </div>

        {/* Menu */}
        <div className="px-4 py-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <p className="!text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            MENU
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isExpanded = expandedMenus.includes(item.name)
              const isActive = activeMenu === item.name

              return (
                <div key={item.name}>
                  <button
                    onClick={() => handleMenuClick(item.name, item.hasSubmenu)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.hasSubmenu &&
                      (isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </button>

                  {item.hasSubmenu && isExpanded && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu?.map((subItem) => (
                        <button
                          key={subItem}
                          onClick={() => {
                            setActiveMenu(subItem)
                            if (isMobile) onClose()
                          }}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            activeMenu === subItem
                              ? "bg-blue-50 text-blue-700"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          }`}
                        >
                          {subItem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}
