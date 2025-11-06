'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

function TopNavbar() {
  const [navbarInfo, setNavbarInfo] = useState(null)
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [icons, setIcons] = useState([])
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Fetch Navbar Info
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/topnavbar')
      .then((res) => {
        setNavbarInfo(res.data.navbarInfo)
        setIcons(res.data.icons)
      })
      .catch((err) => {
        console.error('Error fetching navbar data:', err)
      })
  }, [])

  // Fetch Locations
  useEffect(() => {
    axios
      .get('http://localhost:8000/api/locations')
      .then((res) => {
        setLocations(res.data.data || [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching locations:', err)
        setIsLoading(false)
      })
  }, [])

  // Auto-rotate locations
  useEffect(() => {
    if (!locations || locations.length <= 1) return

    const interval = setInterval(() => {
      setIsAnimating(true)

      setTimeout(() => {
        setCurrentLocationIndex(
          (prevIndex) => (prevIndex + 1) % locations.length
        )
        setIsAnimating(false)
      }, 500)
    }, 3000)

    return () => clearInterval(interval)
  }, [locations])

  // Debug current phone number (helper functions moved inside)
  useEffect(() => {
    const formatPhoneNumber = (phone) => {
      if (!phone) return ''
      const cleaned = phone.replace(/[^\d+]/g, '')
      if (cleaned.startsWith('+')) return cleaned
      if (cleaned.length === 10) return `+1${cleaned}`
      if (cleaned.length === 11) return `+${cleaned}`
      return cleaned
    }

    const shouldShowPhoneLink = (phone) => {
      if (!phone) return false
      const cleaned = phone.replace(/[^\d+]/g, '')
      return cleaned.length >= 10
    }

    const getPhoneHref = (phone) => {
      if (!shouldShowPhoneLink(phone)) return '#'
      return `tel:${formatPhoneNumber(phone)}`
    }

    if (locations.length > 0 && currentLocationIndex < locations.length) {
      const currentPhone = locations[currentLocationIndex]?.phone
      console.log('Current location phone:', currentPhone)
      console.log('Formatted phone:', formatPhoneNumber(currentPhone))
      console.log('Tel link:', getPhoneHref(currentPhone))
    }
  }, [locations, currentLocationIndex])

  if (!navbarInfo) return null

  const currentLocation = locations[currentLocationIndex] || {}
  const currentPhone = currentLocation.phone

  // Helper functions (used in JSX only)
  const formatPhoneNumber = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/[^\d+]/g, '')
    if (cleaned.startsWith('+')) return cleaned
    if (cleaned.length === 10) return `+1${cleaned}`
    if (cleaned.length === 11) return `+${cleaned}`
    return cleaned
  }

  const shouldShowPhoneLink = (phone) => {
    if (!phone) return false
    const cleaned = phone.replace(/[^\d+]/g, '')
    return cleaned.length >= 10
  }

  const getPhoneHref = (phone) => {
    if (!shouldShowPhoneLink(phone)) return '#'
    return `tel:${formatPhoneNumber(phone)}`
  }

  return (
    <div className="hidden lg:block bg-[#0a558c] text-white text-xs sm:text-sm">
      <div className="max-w-[1400px] mx-auto px-6 py-2 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Email */}
          <div className="flex items-center gap-2">
            <span className="uppercase text-[15px] tracking-wide opacity-80">
              Email:
            </span>
            <Link
              href={`mailto:${navbarInfo.email}`}
              className="font-medium hover:text-gray-200 transition-colors duration-200"
            >
              {navbarInfo.email}
            </Link>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2">
            <span className="uppercase text-[15px] tracking-wide opacity-80">
              Phone:
            </span>
            {shouldShowPhoneLink(currentPhone) ? (
              <Link
                href={getPhoneHref(currentPhone)}
                className="font-medium text-white hover:underline transition-all duration-200"
                onClick={(e) => {
                  if (getPhoneHref(currentPhone) === '#') {
                    e.preventDefault()
                  }
                }}
              >
                {isLoading ? 'Loading...' : currentPhone}
              </Link>
            ) : (
              <span className="font-medium">
                {isLoading ? 'Loading...' : currentPhone || 'No phone available'}
              </span>
            )}
          </div>

          {/* Location Address */}
          <div className="flex items-center gap-2">
            <span className="uppercase text-[15px] tracking-wide opacity-80">
              Address:
            </span>
            <span
              className={`font-medium transition-opacity duration-500 ${
                isAnimating ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {isLoading
                ? 'Loading...'
                : currentLocation.address || 'No address available'}
            </span>
          </div>
        </div>

        {/* Right Section: Social Icons */}
        <div className="flex gap-2">
          {icons.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              aria-label={item.platform}
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full flex items-center justify-center border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200"
              title={item.platform}
            >
              <i className={item.icon || 'fas fa-share-alt'}></i>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TopNavbar
