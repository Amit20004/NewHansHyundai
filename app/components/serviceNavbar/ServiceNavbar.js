"use client";
import { useState, useEffect } from "react";

export default function ServiceNavbar({ refLinks }) {
  const [isSticky, setIsSticky] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollTop) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
      setLastScrollTop(currentScroll <= 0 ? 0 : currentScroll);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollTop]);

  return (
    <>
      <nav
        className={`${
          isSticky ? "sticky top-0 z-50" : ""
        } bg-[#05141f] shadow-md border-b py-2 border-gray-200 transition-all duration-300`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center sm:justify-center justify-between h-16">
            {/* Desktop Menu (visible only on large screens) */}
            <div className="hidden lg:flex items-center justify-between space-x-8">
              {refLinks?.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            {/* Mobile + Tablet Menu Button */}
            <button
              className="lg:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile + Tablet Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#05141f] border-b border-gray-200">
          <div className="px-4 py-2 space-y-2">
            {refLinks?.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className="block text-white hover:text-red-400 transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
