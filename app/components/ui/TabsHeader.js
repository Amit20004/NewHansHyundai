"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { name: "Legal Disclaimer", href: "/legal-disclaimer" },
  { name: "T&C of the Website", href: "/terms-conditions" },
  { name: "T&C of Online Booking", href: "/online-booking-terms" },
  { name: "Environment Compliance Reports", href: "/environment-reports" },
  { name: "Bluelink privacy policy", href: "/bluelink-privacy-policy" },
]

export default function TabsHeader() {
  const pathname = usePathname()

  return (
    <header className="bg-gray-800 text-white shadow-md">
      <nav className="container mx-auto flex flex-wrap justify-center">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`px-6 py-4 text-sm font-medium transition-colors duration-200 ${
              pathname === tab.href ? "bg-gray-700" : "hover:bg-gray-700 hover:bg-opacity-75"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </header>
  )
}
