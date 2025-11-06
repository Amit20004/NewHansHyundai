"use client"

import type React from "react"
import { useState } from "react"
import Sidebar from "../../components/admin/sidebar/Sidebar"
import Dashboard from "../../components/admin/dashboard/Dashboard"
import ServiceEnquiry from "../../components/admin/enquiry/ServiceEnquiry"
import AllCarData from "../.../../../components/admin/car/AllCarData"
// import Finance from "../../components/admin/finance/Finance"
import ContactDetail from "../../components/admin/contactDetails/ContactDetail"
import SalesEnquiry from "../../components/admin/enquiry/SalesEnquiry"
import Testimonials from "../../components/admin/testimonials/Testimonials"
import Brochure from "../../components/admin/borchure/Brochure"
import Accessories from "../../components/admin/products/Accessories"
import ContentPage from "../../components/admin/pages/Pages"
import HomeServicesTabSection from "../../components/admin/pages/HomeServicesTabSection"
import HomeAboutSection from "../../components/admin/pages/HomeAboutSection"
import HomeAbout2Section from "../../components/admin/pages/HomeAbout2Section"
import HomeServices from "../../components/admin/pages/HomeServices"
import CarAccessory from "../../components/admin/carAccessory/page"
import CarAccessoryEnquiry from "../../components/admin/enquiry/CarAccessoryEnquiry"
// import CarPriceListing from "../../components/admin/CarPrice/CarPriceListing"
import Location from "../../components/admin/location/Location"
import DetailedLocations from "../../components/admin/location/DetailedLocation"
import GalleryAdmin from "../../components/admin/gallery/Gallery"
import LoanEnquiryAdmin from "../../components/admin/enquiry/LoanEnquiry"
import MetaAdmin from "../../components/admin/metadata/Metadata"
import Services from "../../components/admin/services/Services"
import SalesOffer from "../../components/admin/offers/SalesOffer"
import CarServiceOffersAdmin from "../../components/admin/offers/ServiceOffer"
import SideFormEnquiry from "../../components/admin/enquiry/SideFormEnquiry"
import CarColorChange from "../../components/admin/carColorChange/CarColorChange"
import TopNavbarAdminPanel from "../../components/admin/topNavbar/TopNavbar"
import CarLogosAdmin from "../../components/admin/menu/CarLogos"
import CarListingContent from "../../components/admin/car/CarListingContent"
import InsuranceEnquiryAdmin from "../../components/admin/enquiry/InsuranceEnquiry"
import PickDropServiceAdmin from "../../components/admin/enquiry/PickDropEnquiry"
import HomePageSlider from "../../components/admin/homePageSlider/HomePageSlider"
import AboutUsAdmin from "../../components/admin/aboutus/AboutUs"
import CarHighlightAdmin from "../../components/admin/higlights/Highlight"
import CarExteriorAdmin from "../../components/admin/exterior/Exterior"
import CarInteriorAdmin from "../../components/admin/interior/Interior"
import CarPerformanceAdmin from "../../components/admin/performance/Performance"
import SafetyDurability from "../../components/admin/safetyDurability/SafetyDurability"
import CarConvenienceFeaturesAdmin from "../../components/admin/convenience/Convenience"
import CarSpecificationsAdmin from "../../components/admin/specification/Specification"
import Documentation from "../../components/admin/documentation/Documentation"
import HighlightAboutUs from "../../components/admin/highlight-about-us/HighlightAboutUs"
import PageBannerAdmin from "../../components/admin/banner/Banner"
import FAQ from "../../components/admin/faq/page"

interface AdminLayoutProps {
  children?: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("Dashboard")

  const toggleSidebar = () => setSidebarOpen((prev) => !prev)

  const renderActiveComponent = () => {
    switch (activeMenu) {
      case "Dashboard":
        return <Dashboard />
      case "Car Listing":
      case "All Cars":
        return <AllCarData activeTab={activeMenu} />
      case "Service":
        return <ServiceEnquiry activeTab={activeMenu} />
      case "Sales/Test Drive":
        return <SalesEnquiry />
      case "Contact Us":
        return <ContactDetail />
      case "Car Accessory Enquiry":
        return <CarAccessoryEnquiry />
      case "Testimonials":
        return <Testimonials />
      case "Brochures":
        return <Brochure />
      case "FAQ":
        return <FAQ />
      case "Accessories":
        return <Accessories />
      case "About Us":
        return <AboutUsAdmin />
      case "Pages":
        return <ContentPage />
      case "Documentation":
        return <Documentation />
      case "Home Tabs Section":
        return <HomeServicesTabSection />
      case "Home Slider":
        return <HomePageSlider />
      case "Home About Section1":
        return <HomeAboutSection />
      case "Home About Section2":
        return <HomeAbout2Section />
      case "Home Services":
        return <HomeServices />
      case "Interior":
        return <CarInteriorAdmin />
      case "Performance":
        return <CarPerformanceAdmin />
      case "Safety Durability":
        return <SafetyDurability />
      case "Convenience":
        return <CarConvenienceFeaturesAdmin />
      case "Specification":
        return <CarSpecificationsAdmin />
      case "Car Accessory":
        return <CarAccessory />
      case "Car Price":
        return <CarListingContent />
      case "Location":
        return <Location />
      case "Highlights":
        return <CarHighlightAdmin />
      case "Highlight AboutUs":
        return <HighlightAboutUs />
      case "Exterior":
        return <CarExteriorAdmin />
      case "Detailed Location":
        return <DetailedLocations />
      case "Gallery":
        return <GalleryAdmin />
      case "Loan Enquiry":
        return <LoanEnquiryAdmin />
      case "Insurance Enquiry":
        return <InsuranceEnquiryAdmin />
      case "PickDrop Enquiry":
        return <PickDropServiceAdmin />
      case "Services":
        return <Services />
      case "Car Color Change":
        return <CarColorChange />
      case "Top Navbar":
        return <TopNavbarAdminPanel />
      case "MetaData":
        return <MetaAdmin />
      case "Sales Offers":
        return <SalesOffer />
      case "Services Offers":
        return <CarServiceOffersAdmin />
      case "Car Logos":
        return <CarLogosAdmin />
      case "Banners":
        return <PageBannerAdmin />
      case "Side Form Enquiry":
        return <SideFormEnquiry />
      default:
        return children || <Dashboard />
    }
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar} // ✅ toggles open/close
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveComponent()}
        </main>
      </div>
    </div>
  )
}
