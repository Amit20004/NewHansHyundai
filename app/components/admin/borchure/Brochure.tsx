"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X, FileText } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function CarBrochures() {
  const [carData, setCarData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const carsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedStatus, setSelectedStatus] = useState("All Status")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [formData, setFormData] = useState({ 
    car_name: "", 
    category: "",
    status: "active",
  })
  const [previewImage, setPreviewImage] = useState(null)
  const [previewPdf, setPreviewPdf] = useState(null)
  const [pdfFile, setPdfFile] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCarData()
  }, [])

  const fetchCarData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-ebrochure-all")
      if (res.data.success) {
        setCarData(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching car data:", err)
      toast.error("Failed to fetch car data")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file type
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file")
        return
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(file)
      
      // Set the file
      setImageFile(file)
    }
  }

  const handlePdfChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file type
      if (!file.type.includes('pdf')) {
        toast.error("Please select a PDF file")
        return
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("PDF size should be less than 10MB")
        return
      }
      
      // Set the file
      setPdfFile(file)
      setPreviewPdf(file.name)
    }
  }

  const removeImage = () => {
    setPreviewImage(null)
    setImageFile(null)
  }

  const removePdf = () => {
    setPreviewPdf(null)
    setPdfFile(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("car_name", formData.car_name)
      formDataToSend.append("category", formData.category)
      formDataToSend.append("status", formData.status)
      
      // Append files if selected
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }
      
      if (pdfFile) {
        formDataToSend.append("brochure_file", pdfFile)
      } else if (!editingId) {
        // PDF is required for new entries
        toast.error("PDF brochure file is required")
        setIsLoading(false)
        return
      }

      let response;
      if (editingId) {
        // Update existing record
        response = await axios.put(`http://localhost:8000/api/car-ebrochure/${editingId}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        toast.success("Car brochure updated successfully")
      } else {
        // Add new record
        response = await axios.post("http://localhost:8000/api/car-ebrochure", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        toast.success("Car brochure added successfully")
      }
      
      fetchCarData()
      resetForm()
    } catch (err) {
      console.error("Error saving car brochure:", err)
      if (err.response && err.response.data) {
        toast.error(`Error: ${err.response.data.message || "Failed to save car brochure"}`)
      } else {
        toast.error("Failed to save car brochure. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (car) => {
    setEditingId(car.id)
    setFormData({
      car_name: car.car_name || "",
      category: car.category || "",
      status: car.status || "active",
    })
    
    // Set preview if image exists
    if (car.image_url) {
      setPreviewImage(`http://localhost:8000/${car.image_url}`)
    } else {
      setPreviewImage(null)
    }
    
    // Set PDF info
    if (car.file_name) {
      setPreviewPdf(car.file_name)
    } else {
      setPreviewPdf(null)
    }
    
    setImageFile(null)
    setPdfFile(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car brochure?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/car-ebrochure/${id}`)
      if (res.data.success) {
        fetchCarData()
        toast.success("Car brochure deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting car brochure:", err)
      toast.error("Failed to delete car brochure")
    }
  }

  const resetForm = () => {
    setFormData({ 
      car_name: "", 
      category: "",
      status: "active",
    })
    setPreviewImage(null)
    setPreviewPdf(null)
    setImageFile(null)
    setPdfFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  // Extract unique categories for filter
  const categories = ["All Categories", ...new Set(carData.map((c) => c.category).filter(Boolean))]

  const filteredCars = carData
    .filter((car) => {
      const matchesSearch =
        car.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.file_name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "All Categories" || car.category === selectedCategory
      const matchesStatus =
        selectedStatus === "All Status" || car.status === selectedStatus
      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()

      switch (sortBy) {
        case "newest":
          return dateB - dateA
        case "oldest":
          return dateA - dateB
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
      <Toaster position="top-right" />

      {/* Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Car Brochures</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Car Brochure"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Car Brochure" : "Add New Car Brochure"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="car_name"
                value={formData.car_name}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
              >
                <option value="">Select Category</option>
                <option value="Exterior Accessories">Exterior Accessories</option>
                <option value="Interior Accessories">Interior Accessories</option>
                <option value="Dashboard Accessories">Dashboard Accessories</option>
                <option value="Performance Accessories">Performance Accessories</option>
              </select>
            </div> */}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            
            {/* PDF Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Brochure PDF File {!editingId && '*'}
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <label className="flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Click to upload PDF</p>
                    <p className="text-xs text-gray-500">PDF (Max 10MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf,application/pdf"
                    onChange={handlePdfChange}
                  />
                </label>
                
                {previewPdf && (
                  <div className="flex items-center gap-2 p-3 bg-gray-100 rounded-lg">
                    <FileText className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-sm font-medium">{previewPdf}</p>
                      <button
                        type="button"
                        onClick={removePdf}
                        className="text-xs text-red-500 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {editingId && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current file
                </p>
              )}
            </div>
            
            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Brochure Thumbnail Image</label>
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Click to upload</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
                
                {previewImage && (
                  <div className="relative">
                    <Image
                    width={100} height={100} quality={100} unoptimized={true}
                      src={previewImage} 
                      alt="Preview" 
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
              {editingId && (
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to keep current image
                </p>
              )}
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
          placeholder="Search by car name or file name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          {categories.map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option>All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">File Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">File</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">File Size</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCars.length > 0 ? (
              currentCars.map((car, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="font-medium">{car.id}</div>
                    <div className="text-xs text-gray-500">Added {new Date(car.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="py-4 px-2">
                    {car.image_url ? (
                      <Image
                      width={100} height={100} quality={100} unoptimized={true}
                        src={`http://localhost:8000/${car.image_url}`} 
                        alt={car.car_name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-2">{car.car_name || "N/A"}</td>
                  <td className="py-4 px-2">{car.file_name || "N/A"}</td>
                  <td className="py-4 px-2">
                    {car.file_url ? (
                      <a 
                        href={`http://localhost:8000/${car.file_url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 underline text-xs flex items-center gap-1"
                      >
                        <FileText size={14} /> View PDF
                      </a>
                    ) : "N/A"}
                  </td>
                  <td className="py-4 px-2">{car.file_size || "N/A"}</td>
                  <td className="py-4 px-2">{car.category || "N/A"}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      car.status === "active" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {car.status || "N/A"}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(car)}
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(car.id)}
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
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  No car brochures found. {filteredCars.length === 0 && "Try changing your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentCars.length > 0 ? (
          currentCars.map((car, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              {/* Header with Image */}
              <div className="flex gap-3 items-start">
                {car.image_url ? (
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000/${car.image_url}`} 
                    alt={car.car_name}
                    className="w-16 h-16 object-cover rounded"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500">No Image</span>
                  </div>
                )}
                
                <div className="flex-1">
                  <h2 className="font-semibold text-gray-800">
                    {car.car_name || "N/A"}
                  </h2>
                  <p className="text-xs text-gray-500">
                    ID: {car.id} • Added {new Date(car.created_at).toLocaleDateString()}
                  </p>
                  <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    car.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {car.status || "N/A"}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">File Name</p>
                  <p className="font-medium break-words">{car.file_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">File</p>
                  {car.file_url ? (
                    <a
                      href={`http://localhost:8000/${car.file_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 flex items-center gap-1 text-sm"
                    >
                      <FileText size={14} /> View PDF
                    </a>
                  ) : (
                    <p className="text-gray-400">N/A</p>
                  )}
                </div>
                <div>
                  <p className="text-gray-500">File Size</p>
                  <p className="font-medium break-words">{car.file_size || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p className="font-medium break-words">{car.category || "N/A"}</p>
                </div>
              </div>

              {/* Footer / Actions */}
              <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => handleEdit(car)}
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-green-600" />
                </button>
                <button 
                  onClick={() => handleDelete(car.id)}
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
            No car brochures found. {filteredCars.length === 0 && "Try changing your filters."}
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