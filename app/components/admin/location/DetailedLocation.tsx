"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {  Edit, Trash, ChevronLeft, ChevronRight, Plus,  Upload, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"
export default function DetailedLocations() {
    
  const [locations, setLocations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [formData, setFormData] = useState({ 
    page_heading: "",
    page_content: "",
    main_image: null,
    address: "",
    hours: "",
    contact: "",
    map_url: "",
    facilities: [],
    gallery_images: [],
    slug: "",
    type: "sales"
  })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentFacility, setCurrentFacility] = useState("")
  const [currentFacilityIcon, setCurrentFacilityIcon] = useState("")
  const [mainImagePreview, setMainImagePreview] = useState("")
  const [galleryPreviews, setGalleryPreviews] = useState([])

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/detailed-locations")
      if (res.data.success) {
        setLocations(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching detailed locations:", err)
      toast.error("Failed to fetch detailed locations")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleTextareaChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleMainImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, main_image: file })
      
      // Create preview
      const reader = new FileReader()
      reader.onload = () => {
        setMainImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      const newGalleryImages = [...formData.gallery_images, ...files]
      setFormData({ ...formData, gallery_images: newGalleryImages })
      
      // Create previews
      const newPreviews = []
      files.forEach(file => {
        const reader = new FileReader()
        reader.onload = () => {
          newPreviews.push(reader.result)
          if (newPreviews.length === files.length) {
            setGalleryPreviews([...galleryPreviews, ...newPreviews])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeMainImage = () => {
    setFormData({ ...formData, main_image: null })
    setMainImagePreview("")
  }

  const removeGalleryImage = (index) => {
    const newGalleryImages = [...formData.gallery_images]
    newGalleryImages.splice(index, 1)
    setFormData({ ...formData, gallery_images: newGalleryImages })
    
    const newPreviews = [...galleryPreviews]
    newPreviews.splice(index, 1)
    setGalleryPreviews(newPreviews)
  }

  const addFacility = () => {
    if (currentFacility.trim() && currentFacilityIcon.trim()) {
      const newFacility = {
        icon: currentFacilityIcon.trim(),
        name: currentFacility.trim()
      }
      
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility]
      })
      setCurrentFacility("")
      setCurrentFacilityIcon("")
    } else {
      toast.error("Please provide both facility name and icon URL")
    }
  }

  const removeFacility = (index) => {
    const newFacilities = [...formData.facilities]
    newFacilities.splice(index, 1)
    setFormData({ ...formData, facilities: newFacilities })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formDataToSend = new FormData()
      
      // Append all form data
      formDataToSend.append('page_heading', formData.page_heading)
      formDataToSend.append('page_content', formData.page_content)
      formDataToSend.append('address', formData.address)
      formDataToSend.append('hours', formData.hours)
      formDataToSend.append('contact', formData.contact)
      formDataToSend.append('map_url', formData.map_url)
      formDataToSend.append('facilities', JSON.stringify(formData.facilities))
      formDataToSend.append('slug', formData.slug)
      formDataToSend.append('type', formData.type)
      
      // Append main image if it's a file
      if (formData.main_image && typeof formData.main_image !== 'string') {
        formDataToSend.append('main_image', formData.main_image)
      } else if (editingId && typeof formData.main_image === 'string') {
        formDataToSend.append('existing_main_image', formData.main_image)
      }
      
      // Append gallery images
      formData.gallery_images.forEach((image, index) => {
        if (typeof image !== 'string') {
          formDataToSend.append('gallery_images', image)
        }
      })
      
      // Append existing gallery images if editing
      if (editingId) {
        const existingGallery = formData.gallery_images.filter(img => typeof img === 'string')
        formDataToSend.append('existing_gallery_images', JSON.stringify(existingGallery))
      }
      
      let response;
      if (editingId) {
        // Update existing record
        response = await axios.put(`http://localhost:8000/api/detailed-locations/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success("Detailed location updated successfully")
      } else {
        // Add new record
        response = await axios.post("http://localhost:8000/api/detailed-locations", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success("Detailed location added successfully")
      }
      
      fetchLocations()
      resetForm()
    } catch (err) {
      console.error("Error saving detailed location:", err)
      if (err.response && err.response.data) {
        toast.error(`Error: ${err.response.data.message || "Failed to save detailed location"}`)
      } else {
        toast.error("Failed to save detailed location. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (location) => {
    setEditingId(location.id)
    
    // Convert gallery_images to array if it's not already
    const galleryArray = Array.isArray(location.gallery_images) 
      ? location.gallery_images 
      : []

    setFormData({
      page_heading: location.page_heading || "",
      page_content: location.page_content || "",
      main_image: location.main_image || "",
      address: location.address || "",
      hours: location.hours || "",
      contact: location.contact || "",
      map_url: location.map_url || "",
      facilities: location.facilities || [],
      gallery_images: galleryArray,
      slug: location.slug || "",
      type: location.type || "sales"
    })
    
    // Set previews for existing images
    if (location.main_image) {
      setMainImagePreview(`http://localhost:8000${location.main_image}`)
    }
    
    if (galleryArray.length > 0) {
      setGalleryPreviews(galleryArray.map(img => `http://localhost:8000${img}`))
    }
    
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this detailed location?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/detailed-locations/${id}`)
      if (res.data.success) {
        fetchLocations()
        toast.success("Detailed location deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting detailed location:", err)
      toast.error("Failed to delete detailed location")
    }
  }

  const resetForm = () => {
    setFormData({ 
      page_heading: "",
      page_content: "",
      main_image: null,
      address: "",
      hours: "",
      contact: "",
      map_url: "",
      facilities: [],
      gallery_images: [],
      slug: "",
      type: "sales"
    })
    setCurrentFacility("")
    setCurrentFacilityIcon("")
    setMainImagePreview("")
    setGalleryPreviews([])
    setEditingId(null)
    setShowForm(false)
  }

  const filteredLocations = locations
    .filter((location) => {
      const matchesSearch =
        location.page_heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType =
        selectedType === "All Types" || location.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()

      switch (sortBy) {
        case "newest":
          return dateB - dateA
        case "oldest":
          return dateA - dateB
        case "heading":
          return a.page_heading.localeCompare(b.page_heading)
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage)
  const currentItems = filteredLocations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Detailed Locations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Detailed Location"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Detailed Location" : "Add New Detailed Location"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Heading *</label>
              <input
                type="text"
                name="page_heading"
                value={formData.page_heading}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Page Content</label>
              <textarea
                name="page_content"
                value={formData.page_content}
                onChange={handleTextareaChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows={4}
                placeholder="Professional description of the location..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Image *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {mainImagePreview ? (
                  <div className="relative inline-block">
                    <Image
                      width={100} height={100} quality={100} unoptimized={true}
                      src={mainImagePreview} 
                      alt="Main preview" 
                      className="h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeMainImage}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 -mt-2 -mr-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload an image</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleMainImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              >
                <option value="sales">Sales</option>
                <option value="services">Services</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleTextareaChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows={2}
                required
                placeholder="123 Business Street, City, State, ZIP"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <textarea
                name="hours"
                value={formData.hours}
                onChange={handleTextareaChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows={3}
                placeholder="Mon - Fri: 9:00 AM - 6:00 PM, Sat: 10:00 AM - 4:00 PM"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
              <textarea
                name="contact"
                value={formData.contact}
                onChange={handleTextareaChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows={3}
                placeholder="Phone: (555) 123-4567\nEmail: info@example.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Map URL</label>
              <input
                type="url"
                name="map_url"
                value={formData.map_url}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="https://maps.google.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
                placeholder="down-town-location"
              />
            </div>
            
            {/* Facilities */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Facilities</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Facility Name</label>
                  <input
                    type="text"
                    value={currentFacility}
                    onChange={(e) => setCurrentFacility(e.target.value)}
                    className="border px-3 py-2 rounded w-full text-sm"
                    placeholder="Customer Lounge"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Icon URL</label>
                  <input
                    type="text"
                    value={currentFacilityIcon}
                    onChange={(e) => setCurrentFacilityIcon(e.target.value)}
                    className="border px-3 py-2 rounded w-full text-sm"
                    placeholder="/icons/customer-lounge.svg"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={addFacility}
                className="bg-blue-600 text-white px-3 py-2 rounded text-sm mb-3"
              >
                Add Facility
              </button>
              <div className="flex flex-wrap gap-2">
                {formData.facilities.map((facility, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm flex items-center">
                    {facility.icon && (
                      <Image
                        width={100} height={100} quality={100} unoptimized={true}src={facility.icon} alt={facility.name} className="h-4 w-4 mr-1" />
                    )}
                    {facility.name}
                    <button
                      type="button"
                      onClick={() => removeFacility(index)}
                      className="ml-1 text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
            
            {/* Gallery Images */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Gallery Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mb-4">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4 flex justify-center text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                    <span>Upload gallery images</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImagesChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB each</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {galleryPreviews.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Gallery ${index + 1}`}
                      className="w-full h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-2 flex gap-2 pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded w-32 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : editingId ? "Update" : "Add"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 text-white px-4 py-2 rounded w-32"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by heading, address, or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option>All Types</option>
          <option value="sales">Sales</option>
          <option value="services">Services</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="heading">Heading (A-Z)</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Page Heading</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Address</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Slug</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Facilities</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((location, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="font-medium">{location.id}</div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-medium">{location.page_heading || "N/A"}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{location.page_content}</div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      location.type === "sales" 
                        ? "bg-blue-100 text-blue-800" 
                        : "bg-green-100 text-green-800"
                    }`}>
                      {location.type}
                    </span>
                  </td>
                  <td className="py-4 px-2 max-w-xs">
                    <div className="text-sm">{location.address || "N/A"}</div>
                  </td>
                  <td className="py-4 px-2">
                    <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">{location.slug}</code>
                  </td>
                  <td className="py-4 px-2">
                    {Array.isArray(location.facilities) && location.facilities.map((facility, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs mr-1 mb-1 inline-flex items-center">
                        {facility.icon && (
                          <Image
                            width={100} height={100} quality={100} unoptimized={true}src={facility.icon} alt={facility.name} className="h-3 w-3 mr-1" />
                        )}
                        {facility.name}
                      </span>
                    ))}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(location)}
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(location.id)}
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No detailed locations found. {filteredLocations.length === 0 && "Try changing your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((location, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {location.page_heading || "N/A"}
                  </h2>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    location.type === "sales"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {location.type}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {location.id}
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Slug</p>
                  <p className="font-medium break-words">{location.slug}</p>
                </div>
                <div>
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium break-words">{location.address || "N/A"}</p>
                </div>
                {location.facilities && location.facilities.length > 0 && (
                  <div>
                    <p className="text-gray-500">Facilities</p>
                    <div className="flex flex-wrap gap-1">
                      {location.facilities.map((facility, i) => (
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs inline-flex items-center">
                          {facility.icon && (
                            <Image
                              width={100} height={100} quality={100} unoptimized={true}src={facility.icon} alt={facility.name} className="h-3 w-3 mr-1" />
                          )}
                          {facility.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {location.page_content && (
                  <div>
                    <p className="text-gray-500">Content Preview</p>
                    <p className="font-medium break-words text-xs line-clamp-2">{location.page_content}</p>
                  </div>
                )}
              </div>

              {/* Footer / Actions */}
              <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(location)}
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-green-600" />
                </button>
                <button 
                  onClick={() => handleDelete(location.id)}
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  title="Delete"
                >
                  <Trash className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No detailed locations found. {filteredLocations.length === 0 && "Try changing your filters."}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 pb-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}