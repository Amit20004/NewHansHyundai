"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash, ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react"
import Image from "next/image"

export default function HyundaiCarAdmin() {
  const [carData, setCarData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const carsPerPage = 10

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBodyStyle, setSelectedBodyStyle] = useState("All Body Styles")
  const [selectedFuelType, setSelectedFuelType] = useState("All Fuel Types")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  // const [sortBy, setSortBy] = useState("newest")

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    body_style: "",
    transmission: "",
    fuel: "",
    manufacturing_year: "",
    mileage: "",
    engine_cc: "",
    seating: "",
    start_price: "",
    end_price: "",
    feature_image: null,
    imagePreview: null,
    status: "Enabled",
  })

  // Mobile filter state
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  useEffect(() => {
    fetchCarData()
  }, [])

  const fetchCarData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-data")
      if (res.data.success) {
        setCarData(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching car data:", err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ 
        ...prev, 
        feature_image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== "imagePreview") {
          payload.append(key, value)
        }
      })

      if (isEditing) {
        await axios.put(`http://localhost:8000/api/car-data/${formData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Car updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/car-data", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Car added successfully")
      }

      fetchCarData()
      setIsFormOpen(false)
      setIsEditing(false)
      resetForm()
    } catch (err) {
      console.error("Error saving car:", err)
      alert("Error saving car: " + (err.response?.data?.message || err.message))
    }
  }

  const handleEdit = (car) => {
    setIsEditing(true)
    setFormData({ 
      ...car, 
      feature_image: null,
      imagePreview: car.feature_image || null
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return
    try {
      await axios.delete(`http://localhost:8000/api/car-data/${id}`)
      fetchCarData()
      alert("Car deleted successfully")
    } catch (err) {
      console.error("Error deleting car:", err)
      alert("Error deleting car: " + (err.response?.data?.message || err.message))
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      body_style: "",
      transmission: "",
      fuel: "",
      manufacturing_year: "",
      mileage: "",
      engine_cc: "",
      seating: "",
      start_price: "",
      end_price: "",
      feature_image: null,
      imagePreview: null,
      status: "Enabled",
    })
  }

  const bodyStyles = [...new Set(carData.map(car => car.body_style).filter(Boolean))]
  const fuelTypes = [...new Set(carData.map(car => car.fuel).filter(Boolean))]

  const filteredCars = carData
    .filter((car) => {
      const matchesSearch = car.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBodyStyle = selectedBodyStyle === "All Body Styles" || car.body_style === selectedBodyStyle
      const matchesFuelType = selectedFuelType === "All Fuel Types" || car.fuel === selectedFuelType
      const matchesStatus = selectedStatus === "All Status" || car.status === selectedStatus
      return matchesSearch && matchesBodyStyle && matchesFuelType && matchesStatus
    })

  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const currentCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Mobile Filter Toggle Button */}
      <button 
        onClick={() => setShowMobileFilters(!showMobileFilters)}
        className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg mb-4 w-full justify-center"
      >
        <Search className="h-4 w-4" />
        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Filters + Add button */}
      <div className={`${showMobileFilters ? 'flex' : 'hidden md:flex'} flex-col md:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm items-start md:items-center justify-between mb-6`}>
        <div className="flex flex-col md:flex-row flex-wrap gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search cars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border pl-10 pr-3 py-2 rounded w-full text-sm"
            />
          </div>

          <select
            value={selectedBodyStyle}
            onChange={(e) => setSelectedBodyStyle(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-auto text-sm"
          >
            <option>All Body Styles</option>
            {bodyStyles.map((style, i) => (
              <option key={i}>{style}</option>
            ))}
          </select>

          <select
            value={selectedFuelType}
            onChange={(e) => setSelectedFuelType(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-auto text-sm"
          >
            <option>All Fuel Types</option>
            {fuelTypes.map((fuel, i) => (
              <option key={i}>{fuel}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border px-3 py-2 rounded w-full md:w-auto text-sm"
          >
            <option>All Status</option>
            <option>Enabled</option>
            <option>Disabled</option>
          </select>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(true)
            setIsEditing(false)
            resetForm()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 mt-3 md:mt-0 w-full md:w-auto justify-center"
        >
          <Plus className="h-4 w-4" /> Add Car
        </button>
      </div>

      {/* Responsive Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        {/* Desktop Table */}
        <table className="w-full text-sm min-w-[900px] hidden md:table">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Car</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Body Style</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Specs</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Price Range</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCars.map((car, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 flex items-center gap-3">
                  {car.feature_image && (
                    <Image width={100} height={100} quality={100} unoptimized={true} src={car.feature_image} alt={car.name} className="h-12 w-16 object-cover rounded" />
                  )}
                  <div>
                    <div className="font-medium">{car.name}</div>
                    <div className="text-xs text-gray-500">{car.manufacturing_year}</div>
                  </div>
                </td>
                <td className="py-4 px-4">{car.body_style}</td>
                <td className="py-4 px-4 text-xs text-gray-600">
                  {car.engine_cc}cc • {car.transmission} <br />
                  {car.fuel} • {car.seating} Seater <br />
                  {car.mileage && <span>{car.mileage} kmpl</span>}
                </td>
                <td className="py-4 px-4 font-medium">
                  ₹{car.start_price ? parseInt(car.start_price).toLocaleString() : "N/A"} - ₹
                  {car.end_price ? parseInt(car.end_price).toLocaleString() : "N/A"}
                </td>
                <td className="py-4 px-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    car.status === "Enabled" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="py-4 px-4 flex gap-2">
                  <button onClick={() => handleEdit(car)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button onClick={() => handleDelete(car.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile Cards */}
        <div className="md:hidden">
          {currentCars.length > 0 ? (
            currentCars.map((car, index) => (
              <div key={index} className="border-b border-gray-200 p-4">
                <div className="flex items-start gap-3">
                  {car.feature_image && (
                    <Image width={100} height={100} quality={100} unoptimized={true} src={car.feature_image} alt={car.name} className="h-16 w-20 object-cover rounded" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{car.name}</div>
                    <div className="text-xs text-gray-500">{car.manufacturing_year} • {car.body_style}</div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      {car.engine_cc}cc • {car.transmission} • {car.fuel} • {car.seating} Seater
                      {car.mileage && <span> • {car.mileage} kmpl</span>}
                    </div>
                    
                    <div className="mt-2 font-medium">
                      ₹{car.start_price ? parseInt(car.start_price).toLocaleString() : "N/A"} - ₹
                      {car.end_price ? parseInt(car.end_price).toLocaleString() : "N/A"}
                    </div>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        car.status === "Enabled" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {car.status}
                      </span>
                      
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(car)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button onClick={() => handleDelete(car.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                          <Trash className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              No cars found matching your criteria
            </div>
          )}
        </div>
      </div>

      {/* No results message */}
      {currentCars.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-500 mt-4">
          No cars found matching your criteria
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6 pb-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded disabled:opacity-50 text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded disabled:opacity-50 text-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Add/Edit Car Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">{isEditing ? 'Edit Car' : 'Add New Car'}</h2>
              <button onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Car Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Body Style</label>
                <input
                  type="text"
                  name="body_style"
                  value={formData.body_style}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Transmission</label>
                <input
                  type="text"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <input
                  type="text"
                  name="fuel"
                  value={formData.fuel}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Manufacturing Year</label>
                <input
                  type="number"
                  name="manufacturing_year"
                  value={formData.manufacturing_year}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Mileage (kmpl)</label>
                <input
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Engine CC</label>
                <input
                  type="number"
                  name="engine_cc"
                  value={formData.engine_cc}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Seating Capacity</label>
                <input
                  type="number"
                  name="seating"
                  value={formData.seating}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Start Price (₹)</label>
                <input
                  type="number"
                  name="start_price"
                  value={formData.start_price}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Price (₹)</label>
                <input
                  type="number"
                  name="end_price"
                  value={formData.end_price}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Car Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full border px-3 py-2 rounded"
                />
                {formData.imagePreview && (
                  <div className="mt-2">
                    <Image width={100} height={100} quality={100} unoptimized={true} src={formData.imagePreview} alt="Preview" className="h-32 object-contain rounded" />
                  </div>
                )}
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  {isEditing ? 'Update Car' : 'Add Car'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}