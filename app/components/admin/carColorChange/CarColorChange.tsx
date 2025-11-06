"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {  Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X, Palette, Droplets } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function CarColorsAdmin() {
  const [activeTab, setActiveTab] = useState("colors")
  const [colors, setColors] = useState([])
  const [swatches, setSwatches] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Form state for colors
  const [colorForm, setColorForm] = useState({ 
    car_name: "", 
    color_id: "",
    color_name: ""
  })
  const [colorImage, setColorImage] = useState(null)
  const [editingColorId, setEditingColorId] = useState(null)
  const [showColorForm, setShowColorForm] = useState(false)

  // Form state for swatches
  const [swatchForm, setSwatchForm] = useState({ 
    car_name: "", 
    swatch_id: "",
    swatch_name: "",
    color_code: ""
  })
  const [swatchImage, setSwatchImage] = useState(null)
  const [editingSwatchId, setEditingSwatchId] = useState(null)
  const [showSwatchForm, setShowSwatchForm] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    if (activeTab === "colors") {
      await fetchColors()
    } else {
      await fetchSwatches()
    }
  }

  const fetchColors = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-colors")
      setColors(res.data)
    } catch (err) {
      console.error("Error fetching car colors:", err)
      toast.error("Failed to fetch car colors")
    }
  }

  const fetchSwatches = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-swatches")
      setSwatches(res.data)
    } catch (err) {
      console.error("Error fetching car swatches:", err)
      toast.error("Failed to fetch car swatches")
    }
  }

  // Color handlers
  const handleColorInputChange = (e) => {
    const { name, value } = e.target
    setColorForm({ ...colorForm, [name]: value })
  }

  const handleColorImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setColorImage(file)
    }
  }

  const removeColorImage = () => {
    setColorImage(null)
  }

  const handleColorSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!colorForm.car_name || !colorForm.color_id || !colorForm.color_name) {
      toast.error("All fields are required")
      setIsLoading(false)
      return
    }

    if (!colorImage && !editingColorId) {
      toast.error("Please select an image")
      setIsLoading(false)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('car_name', colorForm.car_name)
    formDataToSend.append('color_id', colorForm.color_id)
    formDataToSend.append('color_name', colorForm.color_name)
    
    if (colorImage) {
      formDataToSend.append('car_image', colorImage)
    }

    try {
      if (editingColorId) {
        await axios.put(`http://localhost:8000/api/car-colors/${editingColorId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car color updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/car-colors", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car color added successfully")
      }
      
      fetchColors()
      resetColorForm()
    } catch (err) {
      console.error("Error saving car color:", err)
      toast.error(err.response?.data?.error || "Failed to save car color")
    } finally {
      setIsLoading(false)
    }
  }

  const handleColorEdit = (color) => {
    setEditingColorId(color.id)
    setColorForm({ 
      car_name: color.car_name || "", 
      color_id: color.color_id || "",
      color_name: color.color_name || ""
    })
    setColorImage(null)
    setShowColorForm(true)
  }

  const handleColorDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car color?")) return
    
    try {
      await axios.delete(`http://localhost:8000/api/car-colors/${id}`)
      fetchColors()
      toast.success("Car color deleted successfully")
    } catch (err) {
      console.error("Error deleting car color:", err)
      toast.error("Failed to delete car color")
    }
  }

  const resetColorForm = () => {
    setColorForm({ car_name: "", color_id: "", color_name: "" })
    setColorImage(null)
    setEditingColorId(null)
    setShowColorForm(false)
  }

  // Swatch handlers
  const handleSwatchInputChange = (e) => {
    const { name, value } = e.target
    setSwatchForm({ ...swatchForm, [name]: value })
  }

  const handleSwatchImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSwatchImage(file)
    }
  }

  const removeSwatchImage = () => {
    setSwatchImage(null)
  }

  const handleSwatchSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!swatchForm.car_name || !swatchForm.swatch_id || !swatchForm.swatch_name || !swatchForm.color_code) {
      toast.error("All fields are required")
      setIsLoading(false)
      return
    }

    if (!swatchImage && !editingSwatchId) {
      toast.error("Please select an image")
      setIsLoading(false)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('car_name', swatchForm.car_name)
    formDataToSend.append('swatch_id', swatchForm.swatch_id)
    formDataToSend.append('swatch_name', swatchForm.swatch_name)
    formDataToSend.append('color_code', swatchForm.color_code)
    
    if (swatchImage) {
      formDataToSend.append('swatch_image', swatchImage)
    }

    try {
      if (editingSwatchId) {
        await axios.put(`http://localhost:8000/api/car-swatches/${editingSwatchId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car swatch updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/car-swatches", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car swatch added successfully")
      }
      
      fetchSwatches()
      resetSwatchForm()
    } catch (err) {
      console.error("Error saving car swatch:", err)
      toast.error(err.response?.data?.error || "Failed to save car swatch")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwatchEdit = (swatch) => {
    setEditingSwatchId(swatch.id)
    setSwatchForm({ 
      car_name: swatch.car_name || "", 
      swatch_id: swatch.swatch_id || "",
      swatch_name: swatch.swatch_name || "",
      color_code: swatch.color_code || ""
    })
    setSwatchImage(null)
    setShowSwatchForm(true)
  }

  const handleSwatchDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car swatch?")) return
    
    try {
      await axios.delete(`http://localhost:8000/api/car-swatches/${id}`)
      fetchSwatches()
      toast.success("Car swatch deleted successfully")
    } catch (err) {
      console.error("Error deleting car swatch:", err)
      toast.error("Failed to delete car swatch")
    }
  }

  const resetSwatchForm = () => {
    setSwatchForm({ car_name: "", swatch_id: "", swatch_name: "", color_code: "" })
    setSwatchImage(null)
    setEditingSwatchId(null)
    setShowSwatchForm(false)
  }

  // Filtering and pagination
  const filteredItems = activeTab === "colors" 
    ? colors.filter(color => 
        color.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        color.color_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : swatches.filter(swatch => 
        swatch.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swatch.swatch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        swatch.color_code?.toLowerCase().includes(searchTerm.toLowerCase())
      )

  const sortedItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime()
    const dateB = new Date(b.created_at || 0).getTime()

    switch (sortBy) {
      case "newest": return dateB - dateA
      case "oldest": return dateA - dateB
      case "name": return (a.car_name || a.swatch_name).localeCompare(b.car_name || b.swatch_name)
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

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("colors")}
          className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${
            activeTab === "colors" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Palette size={18} />
          Car Colors
        </button>
        <button
          onClick={() => setActiveTab("swatches")}
          className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${
            activeTab === "swatches" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Droplets size={18} />
          Car Swatches
        </button>
      </div>

      {/* Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {activeTab === "colors" ? "Car Colors Management" : "Car Swatches Management"}
        </h1>
        <button
          onClick={() => activeTab === "colors" ? setShowColorForm(!showColorForm) : setShowSwatchForm(!showSwatchForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {activeTab === "colors" 
            ? (showColorForm ? "Cancel" : "Add Color") 
            : (showSwatchForm ? "Cancel" : "Add Swatch")}
        </button>
      </div>

      {/* Color Form */}
      {activeTab === "colors" && showColorForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingColorId ? "Edit Car Color" : "Add New Car Color"}
          </h2>
          <form onSubmit={handleColorSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="car_name"
                value={colorForm.car_name}
                onChange={handleColorInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color ID *</label>
              <input
                type="text"
                name="color_id"
                value={colorForm.color_id}
                onChange={handleColorInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Name *</label>
              <input
                type="text"
                name="color_name"
                value={colorForm.color_name}
                onChange={handleColorInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Car Image {editingColorId ? "(Select new image to replace existing)" : "*"}
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
                    onChange={handleColorImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              
              {colorImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Image
                      width={100} height={100} quality={100} unoptimized={true}
                        src={URL.createObjectURL(colorImage)} 
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeColorImage}
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
                ) : editingColorId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetColorForm}
                className="bg-gray-400 text-white px-4 py-2 rounded w-32"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Swatch Form */}
      {activeTab === "swatches" && showSwatchForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingSwatchId ? "Edit Car Swatch" : "Add New Car Swatch"}
          </h2>
          <form onSubmit={handleSwatchSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="car_name"
                value={swatchForm.car_name}
                onChange={handleSwatchInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Swatch ID *</label>
              <input
                type="text"
                name="swatch_id"
                value={swatchForm.swatch_id}
                onChange={handleSwatchInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Swatch Name *</label>
              <input
                type="text"
                name="swatch_name"
                value={swatchForm.swatch_name}
                onChange={handleSwatchInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color Code *</label>
              <input
                type="text"
                name="color_code"
                value={swatchForm.color_code}
                onChange={handleSwatchInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
                placeholder="#FFFFFF"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Swatch Image {editingSwatchId ? "(Select new image to replace existing)" : "*"}
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
                    onChange={handleSwatchImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              
              {swatchImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Image
                      width={100} height={100} quality={100} unoptimized={true}
                        src={URL.createObjectURL(swatchImage)} 
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeSwatchImage}
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
                ) : editingSwatchId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetSwatchForm}
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
          placeholder={activeTab === "colors" ? "Search by car name or color..." : "Search by car name, swatch or color code..."}
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
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Colors Table */}
      {activeTab === "colors" && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Color ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Color Name</th>
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
                          src={`http://localhost:8000/${item.car_image}`} 
                          alt={item.car_name}
                          className="h-16 w-24 object-cover rounded" 
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{item.car_name}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">{item.color_id}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">{item.color_name}</div>
                      </td>
                      <td className="py-4 px-2">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleColorEdit(item)}
                            className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleColorDelete(item.id)}
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
                      No car colors found. {filteredItems.length === 0 && "Try changing your filters."}
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
                    <h2 className="font-semibold text-gray-800">{item.car_name}</h2>
                    <div className="text-xs text-gray-500">ID: {item.id}</div>
                  </div>

                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000/${item.car_image}`} 
                    alt={item.car_name}
                    className="w-full h-40 object-cover rounded" 
                  />

                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm">
                      <span className="font-medium">Color ID:</span> {item.color_id}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Color Name:</span> {item.color_name}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleColorEdit(item)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button 
                      onClick={() => handleColorDelete(item.id)}
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
                No car colors found. {filteredItems.length === 0 && "Try changing your filters."}
              </div>
            )}
          </div>
        </>
      )}

      {/* Swatches Table */}
      {activeTab === "swatches" && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Swatch ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Swatch Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Color Code</th>
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
                          src={`http://localhost:8000/${item.swatch_image}`} 
                          alt={item.swatch_name}
                          className="h-16 w-24 object-cover rounded" 
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{item.car_name}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">{item.swatch_id}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm">{item.swatch_name}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-5 w-5 rounded border"
                            style={{ backgroundColor: item.color_code }}
                          ></div>
                          <span>{item.color_code}</span>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleSwatchEdit(item)}
                            className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleSwatchDelete(item.id)}
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
                      No car swatches found. {filteredItems.length === 0 && "Try changing your filters."}
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
                    <h2 className="font-semibold text-gray-800">{item.car_name}</h2>
                    <div className="text-xs text-gray-500">ID: {item.id}</div>
                  </div>

                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000/${item.swatch_image}`} 
                    alt={item.swatch_name}
                    className="w-full h-40 object-cover rounded" 
                  />

                  <div className="grid grid-cols-1 gap-2">
                    <div className="text-sm">
                      <span className="font-medium">Swatch ID:</span> {item.swatch_id}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Swatch Name:</span> {item.swatch_name}
                    </div>
                    <div className="text-sm flex items-center gap-2">
                      <span className="font-medium">Color Code:</span>
                      <div 
                        className="h-5 w-5 rounded border"
                        style={{ backgroundColor: item.color_code }}
                      ></div>
                      {item.color_code}
                    </div>
                  </div>

                  <div className="text-sm text-gray-500">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleSwatchEdit(item)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button 
                      onClick={() => handleSwatchDelete(item.id)}
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
                No car swatches found. {filteredItems.length === 0 && "Try changing your filters."}
              </div>
            )}
          </div>
        </>
      )}

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