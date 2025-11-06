"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function CarPerformanceAdmin() {
  const [performanceItems, setPerformanceItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [form, setForm] = useState({ 
    car_variant: "", 
    tab_title: "",
    short_description: "",
    long_description: "",
    car_name: ""
  })
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchPerformanceItems()
  }, [])

  const fetchPerformanceItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-performance-engine")
      if (res.data.success) {
        setPerformanceItems(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching car performance items:", err)
      toast.error("Failed to fetch car performance items")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
    }
  }

  const removeImage = () => {
    setImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!image && !editingId) {
      toast.error("Please select an image")
      setIsLoading(false)
      return
    }

    if (!form.car_variant || !form.tab_title || !form.short_description || !form.long_description || !form.car_name) {
      toast.error("Please fill all required fields")
      setIsLoading(false)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('car_variant', form.car_variant)
    formDataToSend.append('tab_title', form.tab_title)
    formDataToSend.append('short_description', form.short_description)
    formDataToSend.append('long_description', form.long_description)
    formDataToSend.append('car_name', form.car_name)
    
    if (image) {
      formDataToSend.append('image', image)
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/car-performance-engine/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car performance item updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/car-performance-engine", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car performance item created successfully")
      }
      
      fetchPerformanceItems()
      resetForm()
    } catch (err) {
      console.error("Error saving car performance item:", err)
      toast.error(err.response?.data?.message || "Failed to save car performance item")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      car_variant: item.car_variant || "",
      tab_title: item.tab_title || "",
      short_description: item.short_description || "",
      long_description: item.long_description || "",
      car_name: item.car_name || ""
    })
    setImage(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car performance item?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/car-performance-engine/${id}`)
      if (res.data.success) {
        fetchPerformanceItems()
        toast.success("Car performance item deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting car performance item:", err)
      toast.error("Failed to delete car performance item")
    }
  }

  const resetForm = () => {
    setForm({ 
      car_variant: "", 
      tab_title: "",
      short_description: "",
      long_description: "",
      car_name: ""
    })
    setImage(null)
    setEditingId(null)
    setShowForm(false)
  }

  // Filtering and pagination
  const filteredItems = performanceItems.filter(item => 
    item.car_variant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tab_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.car_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sortedItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()

    switch (sortBy) {
      case "newest": return dateB - dateA
      case "oldest": return dateA - dateB
      case "name": return a.car_name.localeCompare(b.car_name)
      default: return 0
    }
  })

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage)
  const currentItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Car Performance Engine Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Car Performance Item" : "Add New Car Performance Item"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Car variant *</label>
              <select
                name="car_variant"
                value={form.car_variant}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              >
                <option value="">Select Car variant</option>
                <option value="petrol">Petrol</option>
                <option value="petrol-cng">Petrol-CNG</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tab Title *</label>
              <input
                type="text"
                name="tab_title"
                value={form.tab_title}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="car_name"
                value={form.car_name}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <textarea
                name="short_description"
                value={form.short_description}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm h-20"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Long Description *</label>
              <textarea
                name="long_description"
                value={form.long_description}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm h-32"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {editingId ? "(Select new image to replace existing)" : "*"}
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-gray-400">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              
              {image && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Image
                      width={100} height={100} quality={100} unoptimized={true} 
                        src={URL.createObjectURL(image)} 
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-gray-200 md:col-span-2">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded w-32 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : editingId ? "Update" : "Create"}
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
          placeholder="Search by variant, title, or car name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Car Name (A-Z)</option>
        </select>
      </div>

      {/* Table */}
      <>
        {/* Desktop Table */}
        <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Car variant</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Tab Title</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Short Description</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Name</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Created</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="font-medium">{item.id}</div>
                    </td>
                    <td className="py-4 px-2">
                      <Image
                      width={100} height={100} quality={100} unoptimized={true} 
                        src={`http://localhost:8000/${item.image_url}`} 
                        alt={item.tab_title}
                        className="h-16 w-24 object-cover rounded" 
                      />
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-medium capitalize">{item.car_variant}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="font-medium">{item.tab_title}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {item.short_description}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="text-sm">{item.car_name}</div>
                    </td>
                    <td className="py-4 px-2">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
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
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No performance items found. {filteredItems.length === 0 && "Try changing your filters."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden mt-5 space-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold text-gray-800">{item.tab_title}</h2>
                  <div className="text-xs text-gray-500">ID: {item.id}</div>
                </div>

                <Image
                  width={100} height={100} quality={100} unoptimized={true} 
                  src={`http://localhost:8000/${item.image_url}`} 
                  alt={item.tab_title}
                  className="w-full h-40 object-cover rounded" 
                />

                <div className="text-sm text-gray-600">
                  <span className="font-medium">variant:</span> {item.car_variant}
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium">Short Description:</span> {item.short_description}
                </div>

                <div className="text-sm text-gray-500">
                  <span className="font-medium">Car:</span> {item.car_name}
                </div>

                <div className="text-sm text-gray-500">
                  Created: {new Date(item.created_at).toLocaleDateString()}
                </div>

                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)}
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
              No performance items found. {filteredItems.length === 0 && "Try changing your filters."}
            </div>
          )}
        </div>
      </>

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