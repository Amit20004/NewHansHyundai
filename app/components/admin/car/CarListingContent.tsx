"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus } from "lucide-react"

export default function Dashboard() {
  const [carData, setCarData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const carsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("newest")

  // form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    model: "",
    fuel_type: "",
    transmission: "",
    variant: "",
    price: "",
    description: "",
    features: "",
    main_img: null,
    img1: null,
    img2: null,
    img3: null,
    status: "Enabled",
  })

  useEffect(() => {
    fetchCarData()
  }, [])

  const fetchCarData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/vehicles")
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
    const { name, files } = e.target
    setFormData((prev) => ({ ...prev, [name]: files[0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = new FormData()
      
      // Convert features string to array for backend processing
      const featuresArray = formData.features 
        ? formData.features.split(',').map(f => f.trim()).filter(f => f)
        : []
      
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'features') {
          // Send features as JSON string
          payload.append(key, JSON.stringify(featuresArray))
        } else if (value !== null && value !== undefined) {
          payload.append(key, value)
        }
      })

      if (isEditing) {
        await axios.put(`http://localhost:8000/api/vehicles/${formData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/vehicles", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      fetchCarData()
      setIsFormOpen(false)
      setIsEditing(false)
      resetForm()
    } catch (err) {
      console.error("Error saving car:", err)
    }
  }

  const handleEdit = (car) => {
    setIsEditing(true)
    // Convert features array to comma-separated string for the form
    const featuresString = Array.isArray(car.features) 
      ? car.features.join(', ')
      : car.features || ""
    
    setFormData({ 
      ...car, 
      main_img: null, // keep file null until changed
      img1: null,
      img2: null,
      img3: null,
      features: featuresString
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car?")) return
    try {
      await axios.delete(`http://localhost:8000/api/vehicles/${id}`)
      fetchCarData()
    } catch (err) {
      console.error("Error deleting car:", err)
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      model: "",
      fuel_type: "",
      transmission: "",
      variant: "",
      price: "",
      description: "",
      features: "",
      main_img: null,
      img1: null,
      img2: null,
      img3: null,
      status: "Enabled",
    })
  }

  const filteredCars = carData
    .filter((car) => {
      const matchesSearch =
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.variant?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "All Categories" || car.fuel_type === selectedCategory
      const matchesStatus =
        selectedStatus === "All Status" || car.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()
      const priceA = parseFloat(String(a.price || 0).replace(/[^0-9.]/g, ""))
      const priceB = parseFloat(String(b.price || 0).replace(/[^0-9.]/g, ""))

      switch (sortBy) {
        case "newest":
          return dateB - dateA
        case "oldest":
          return dateA - dateB
        case "price-high":
          return priceB - priceA
        case "price-low":
          return priceA - priceB
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredCars.length / carsPerPage)
  const currentCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Filters + Add button */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option>All Categories</option>
            {[...new Set(carData.map((c) => c.fuel_type).filter(Boolean))].map((cat, i) => (
              <option key={i}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option>All Status</option>
            {[...new Set(carData.map((c) => c.status).filter(Boolean))].map((status, i) => (
              <option key={i}>{status}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(true)
            setIsEditing(false)
            resetForm()
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Car
        </button>
      </div>

      {/* Car Form (Add/Edit) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3"
        >
          <h2 className="font-semibold text-lg">
            {isEditing ? "Edit Car" : "Add New Car"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Model */}
            <div className="flex flex-col">
              <label htmlFor="model" className="text-sm font-medium text-gray-700">
                Model
              </label>
              <input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="Enter car model"
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            {/* Fuel Type */}
            <div className="flex flex-col">
              <label htmlFor="fuel_type" className="text-sm font-medium text-gray-700">
                Fuel Type
              </label>
              <select
                id="fuel_type"
                name="fuel_type"
                value={formData.fuel_type}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">Select Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Transmission */}
            <div className="flex flex-col">
              <label htmlFor="transmission" className="text-sm font-medium text-gray-700">
                Transmission
              </label>
              <select
                id="transmission"
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="">Select Transmission</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
                <option value="CVT">CVT</option>
              </select>
            </div>

            {/* Variant */}
            <div className="flex flex-col">
              <label htmlFor="variant" className="text-sm font-medium text-gray-700">
                Variant
              </label>
              <input
                id="variant"
                name="variant"
                value={formData.variant}
                onChange={handleInputChange}
                placeholder="e.g. Premium, High, Mid"
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            {/* Price */}
            <div className="flex flex-col">
              <label htmlFor="price" className="text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g. 1111000.00"
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Car description"
                className="border px-3 py-2 rounded text-sm"
                rows="3"
              />
            </div>

            {/* Features */}
            <div className="flex flex-col">
              <label htmlFor="features" className="text-sm font-medium text-gray-700">
                Features (comma separated)
              </label>
              <textarea
                id="features"
                name="features"
                value={formData.features}
                onChange={handleInputChange}
                placeholder="e.g. GPS, Air Conditioning, Bluetooth, Sunroof"
                className="border px-3 py-2 rounded text-sm"
                rows="3"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded text-sm"
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            {/* Main Image */}
            <div className="flex flex-col">
              <label htmlFor="main_img" className="text-sm font-medium text-gray-700">
                Main Image
              </label>
              <input
                id="main_img"
                type="file"
                name="main_img"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            {/* Additional Images */}
            <div className="flex flex-col">
              <label htmlFor="img1" className="text-sm font-medium text-gray-700">
                Image 1
              </label>
              <input
                id="img1"
                type="file"
                name="img1"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="img2" className="text-sm font-medium text-gray-700">
                Image 2
              </label>
              <input
                id="img2"
                type="file"
                name="img2"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="img3" className="text-sm font-medium text-gray-700">
                Image 3
              </label>
              <input
                id="img3"
                type="file"
                name="img3"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              {isEditing ? "Update Car" : "Add Car"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false)
                setIsEditing(false)
                resetForm()
              }}
              className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Model</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Fuel Type</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Variant</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCars.map((car, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <div className="font-medium">{car.model}</div>
                  <div className="text-xs text-gray-500">{car.transmission}</div>
                </td>
                <td className="py-4 px-2">{car.fuel_type || "N/A"}</td>
                <td className="py-4 px-2">{car.variant || "N/A"}</td>
                <td className="py-4 px-2">₹{car.price ? parseFloat(car.price).toLocaleString() : "Price on request"}</td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    car.status === "Enabled" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button onClick={() => handleEdit(car)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(car.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card layout */}
      <div className="md:hidden mt-5 space-y-4">
        {currentCars.map((car, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{car.model}</h2>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                car.status === "Enabled" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {car.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{car.fuel_type} • {car.transmission}</p>
            <p className="text-sm text-gray-600">Variant: {car.variant || "N/A"}</p>
            <p className="text-sm font-medium">₹{car.price ? parseFloat(car.price).toLocaleString() : "Price on request"}</p>
            <div className="flex gap-2 pt-2">
              <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                <Eye className="h-4 w-4 text-blue-600" />
              </button>
              <button onClick={() => handleEdit(car)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                <Edit className="h-4 w-4 text-green-600" />
              </button>
              <button onClick={() => handleDelete(car.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                <Trash className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </div>
        ))}
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