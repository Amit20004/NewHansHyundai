"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {  Edit, Trash, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function Locations() {
  const [locations, setLocations] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All Types")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [formData, setFormData] = useState({ 
    name: "", 
    type: "sales", 
    latitude: "", 
    longitude: "", 
    address: "", 
    phone: "", 
    hours: "" 
  })
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/locations")
      if (res.data.success) {
        setLocations(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching locations:", err)
      toast.error("Failed to fetch locations")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (editingId) {
        // Update existing record
        await axios.put(`http://localhost:8000/api/locations/${editingId}`, formData)
        toast.success("Location updated successfully")
      } else {
        // Add new record
        await axios.post("http://localhost:8000/api/locations", formData)
        toast.success("Location added successfully")
      }
      
      fetchLocations()
      resetForm()
    } catch (err) {
      console.error("Error saving location:", err)
      if (err.response && err.response.data) {
        toast.error(`Error: ${err.response.data.message || "Failed to save location"}`)
      } else {
        toast.error("Failed to save location. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (location) => {
    setEditingId(location.id)
    setFormData({
      name: location.name || "",
      type: location.type || "sales",
      latitude: location.latitude || "",
      longitude: location.longitude || "",
      address: location.address || "",
      phone: location.phone || "",
      hours: location.hours || ""
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this location?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/locations/${id}`)
      if (res.data.success) {
        fetchLocations()
        toast.success("Location deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting location:", err)
      toast.error("Failed to delete location")
    }
  }

  const resetForm = () => {
    setFormData({ 
      name: "", 
      type: "sales", 
      latitude: "", 
      longitude: "", 
      address: "", 
      phone: "", 
      hours: "" 
    })
    setEditingId(null)
    setShowForm(false)
  }

  const filteredLocations = locations
    .filter((location) => {
      const matchesSearch =
        location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.phone?.toLowerCase().includes(searchTerm.toLowerCase())
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
        case "name":
          return a.name.localeCompare(b.name)
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
        <h1 className="text-xl font-bold">Dealer Locations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Location"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Location" : "Add New Location"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
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
                <option value="service">Service</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="40.7128"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="-74.0060"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows={3}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="(555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
              <textarea
                name="hours"
                value={formData.hours}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows={3}
                placeholder="Mon-Fri: 9:00 AM - 8:00 PM, Sat: 9:00 AM - 6:00 PM"
              />
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
          placeholder="Search by name, address, or phone..."
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
          <option value="service">Service</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Type</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Coordinates</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Address</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Phone</th>
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
                    <div className="font-medium">{location.name}</div>
                    <div className="text-xs text-gray-500">{location.hours}</div>
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
                  <td className="py-4 px-2">
                    {location.latitude && location.longitude ? (
                      <div className="text-xs">
                        <div>Lat: {location.latitude}</div>
                        <div>Lng: {location.longitude}</div>
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="py-4 px-2 max-w-xs">
                    <div className="text-sm">{location.address}</div>
                  </td>
                  <td className="py-4 px-2">
                    {location.phone || "N/A"}
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
                  No locations found. {filteredLocations.length === 0 && "Try changing your filters."}
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
                    {location.name}
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
                  <p className="text-gray-500">Address</p>
                  <p className="font-medium break-words">{location.address}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-medium break-words">{location.phone || "N/A"}</p>
                </div>
                {location.latitude && location.longitude && (
                  <div>
                    <p className="text-gray-500">Coordinates</p>
                    <p className="font-medium break-words">
                      {location.latitude}, {location.longitude}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-500">Hours</p>
                  <p className="font-medium break-words text-xs">{location.hours}</p>
                </div>
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
            No locations found. {filteredLocations.length === 0 && "Try changing your filters."}
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