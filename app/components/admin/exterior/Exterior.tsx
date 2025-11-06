"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X, ImageIcon, List } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function CarExteriorAdmin() {
  const [activeTab, setActiveTab] = useState("gallery")
  const [galleries, setGalleries] = useState([])
  const [exteriorViews, setExteriorViews] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Form state for gallery
  const [galleryForm, setGalleryForm] = useState({ 
    car_name: "", 
    description: ""
  })
  const [galleryImage, setGalleryImage] = useState(null)
  const [editingGalleryId, setEditingGalleryId] = useState(null)
  const [showGalleryForm, setShowGalleryForm] = useState(false)

  // Form state for exterior views
  const [viewForm, setViewForm] = useState({ 
    label: "", 
    caption: "",
    car_name: ""
  })
  const [viewImage, setViewImage] = useState(null)
  const [editingViewId, setEditingViewId] = useState(null)
  const [showViewForm, setShowViewForm] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    if (activeTab === "gallery") {
      await fetchGalleries()
    } else {
      await fetchExteriorViews()
    }
  }

  const fetchGalleries = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-ext-gallery")
      if (res.data.success) {
        setGalleries(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching car galleries:", err)
      toast.error("Failed to fetch car galleries")
    }
  }

  const fetchExteriorViews = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/exterior-views")
      if (res.data.success) {
        setExteriorViews(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching exterior views:", err)
      toast.error("Failed to fetch exterior views")
    }
  }

  // Gallery handlers
  const handleGalleryInputChange = (e) => {
    const { name, value } = e.target
    setGalleryForm({ ...galleryForm, [name]: value })
  }

  const handleGalleryImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setGalleryImage(file)
    }
  }

  const removeGalleryImage = () => {
    setGalleryImage(null)
  }

  const handleGallerySubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!galleryImage && !editingGalleryId) {
      toast.error("Please select an image")
      setIsLoading(false)
      return
    }

    if (!galleryForm.car_name || !galleryForm.description) {
      toast.error("Please enter car name and description")
      setIsLoading(false)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('car_name', galleryForm.car_name)
    formDataToSend.append('description', galleryForm.description)
    
    if (galleryImage) {
      formDataToSend.append('image', galleryImage)
    }

    try {
      if (editingGalleryId) {
        await axios.put(`http://localhost:8000/api/car-ext-gallery/${editingGalleryId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car gallery updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/car-ext-gallery", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Car added to gallery successfully")
      }
      
      fetchGalleries()
      resetGalleryForm()
    } catch (err) {
      console.error("Error saving car gallery:", err)
      toast.error(err.response?.data?.message || "Failed to save car gallery")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGalleryEdit = (gallery) => {
    setEditingGalleryId(gallery.id)
    setGalleryForm({ 
      car_name: gallery.car_name || "", 
      description: gallery.description || "" 
    })
    setGalleryImage(null)
    setShowGalleryForm(true)
  }

  const handleGalleryDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car from the gallery?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/car-ext-gallery/${id}`)
      if (res.data.success) {
        fetchGalleries()
        toast.success("Car deleted successfully from gallery")
      }
    } catch (err) {
      console.error("Error deleting car gallery:", err)
      toast.error("Failed to delete car from gallery")
    }
  }

  const resetGalleryForm = () => {
    setGalleryForm({ car_name: "", description: "" })
    setGalleryImage(null)
    setEditingGalleryId(null)
    setShowGalleryForm(false)
  }

  // Exterior View handlers
  const handleViewInputChange = (e) => {
    const { name, value } = e.target
    setViewForm({ ...viewForm, [name]: value })
  }

  const handleViewImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setViewImage(file)
    }
  }

  const removeViewImage = () => {
    setViewImage(null)
  }

  const handleViewSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!viewImage && !editingViewId) {
      toast.error("Please select an image")
      setIsLoading(false)
      return
    }

    if (!viewForm.label || !viewForm.caption || !viewForm.car_name) {
      toast.error("Label, caption, and car name are required")
      setIsLoading(false)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('label', viewForm.label)
    formDataToSend.append('caption', viewForm.caption)
    formDataToSend.append('car_name', viewForm.car_name)
    
    if (viewImage) {
      formDataToSend.append('image', viewImage)
    }

    try {
      if (editingViewId) {
        await axios.put(`http://localhost:8000/api/exterior-views/${editingViewId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Exterior view updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/exterior-views", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Exterior view created successfully")
      }
      
      fetchExteriorViews()
      resetViewForm()
    } catch (err) {
      console.error("Error saving exterior view:", err)
      toast.error(err.response?.data?.message || "Failed to save exterior view")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewEdit = (view) => {
    setEditingViewId(view.id)
    setViewForm({
      label: view.label || "",
      caption: view.caption || "",
      car_name: view.car_name || ""
    })
    setViewImage(null)
    setShowViewForm(true)
  }

  const handleViewDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this exterior view?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/exterior-views/${id}`)
      if (res.data.success) {
        fetchExteriorViews()
        toast.success("Exterior view deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting exterior view:", err)
      toast.error("Failed to delete exterior view")
    }
  }

  const resetViewForm = () => {
    setViewForm({ label: "", caption: "", car_name: "" })
    setViewImage(null)
    setEditingViewId(null)
    setShowViewForm(false)
  }

  // Filtering and pagination
  const filteredItems = activeTab === "gallery" 
    ? galleries.filter(gallery => gallery.car_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    : exteriorViews.filter(view => view.label?.toLowerCase().includes(searchTerm.toLowerCase()) || view.car_name?.toLowerCase().includes(searchTerm.toLowerCase()))

  const sortedItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.created_at || a.createdAt || 0).getTime()
    const dateB = new Date(b.created_at || b.createdAt || 0).getTime()

    switch (sortBy) {
      case "newest": return dateB - dateA
      case "oldest": return dateA - dateB
      case "name": return (a.car_name || a.label).localeCompare(b.car_name || b.label)
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
          onClick={() => setActiveTab("gallery")}
          className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${
            activeTab === "gallery" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <ImageIcon size={18} />
          Gallery
        </button>
        <button
          onClick={() => setActiveTab("views")}
          className={`py-3 px-6 font-medium text-sm flex items-center gap-2 ${
            activeTab === "views" 
              ? "border-b-2 border-blue-500 text-blue-600" 
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <List size={18} />
          Exterior Views
        </button>
      </div>

      {/* Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          {activeTab === "gallery" ? "Car Exterior Gallery Management" : "Car Exterior Views Management"}
        </h1>
        <button
          onClick={() => activeTab === "gallery" ? setShowGalleryForm(!showGalleryForm) : setShowViewForm(!showViewForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {activeTab === "gallery" 
            ? (showGalleryForm ? "Cancel" : "Add Car") 
            : (showViewForm ? "Cancel" : "Add View")}
        </button>
      </div>

      {/* Gallery Form */}
      {activeTab === "gallery" && showGalleryForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingGalleryId ? "Edit Car in Gallery" : "Add New Car to Gallery"}
          </h2>
          <form onSubmit={handleGallerySubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="car_name"
                value={galleryForm.car_name}
                onChange={handleGalleryInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                name="description"
                value={galleryForm.description}
                onChange={handleGalleryInputChange}
                className="border px-3 py-2 rounded w-full text-sm h-20"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {editingGalleryId ? "(Select new image to replace existing)" : "*"}
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
                    onChange={handleGalleryImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              
              {galleryImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Image
                          width={100} height={100} quality={100} unoptimized={true}
                        src={URL.createObjectURL(galleryImage)} 
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeGalleryImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded w-32 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : editingGalleryId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetGalleryForm}
                className="bg-gray-400 text-white px-4 py-2 rounded w-32"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exterior View Form */}
      {activeTab === "views" && showViewForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingViewId ? "Edit Exterior View" : "Add New Exterior View"}
          </h2>
          <form onSubmit={handleViewSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Label *</label>
              <input
                type="text"
                name="label"
                value={viewForm.label}
                onChange={handleViewInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Caption *</label>
              <textarea
                name="caption"
                value={viewForm.caption}
                onChange={handleViewInputChange}
                className="border px-3 py-2 rounded w-full text-sm h-20"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Car Name *</label>
              <input
                type="text"
                name="car_name"
                value={viewForm.car_name}
                onChange={handleViewInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image {editingViewId ? "(Select new image to replace existing)" : "*"}
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
                    onChange={handleViewImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              
              {viewImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Image
                          width={100} height={100} quality={100} unoptimized={true}
                        src={URL.createObjectURL(viewImage)} 
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeViewImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 pt-4 border-t border-gray-200">
              <button 
                type="submit" 
                className="bg-blue-600 text-white px-4 py-2 rounded w-32 flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
                ) : editingViewId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetViewForm}
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
          placeholder={activeTab === "gallery" ? "Search by car name..." : "Search by label or car name..."}
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
          <option value="name">{activeTab === "gallery" ? "Name (A-Z)" : "Label (A-Z)"}</option>
        </select>
      </div>

      {/* Gallery Table */}
      {activeTab === "gallery" && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
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
                          alt={item.car_name}
                          className="h-16 w-24 object-cover rounded" 
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{item.car_name}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {item.description}
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        {new Date(item.createdAt || item.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleGalleryEdit(item)}
                            className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleGalleryDelete(item.id)}
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
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      No cars found in gallery. {filteredItems.length === 0 && "Try changing your filters."}
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
                    src={`http://localhost:8000/${item.image_url}`} 
                    alt={item.car_name}
                    className="w-full h-40 object-cover rounded" 
                  />

                  <div className="text-sm text-gray-600">
                    {item.description}
                  </div>

                  <div className="text-sm text-gray-500">
                    Created: {new Date(item.createdAt || item.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleGalleryEdit(item)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button 
                      onClick={() => handleGalleryDelete(item.id)}
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
                No cars found in gallery. {filteredItems.length === 0 && "Try changing your filters."}
              </div>
            )}
          </div>
        </>
      )}

      {/* Exterior Views Table */}
      {activeTab === "views" && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Label</th>
                  <th className="text-left py-3 px-2 font-semibold text-gray-700">Caption</th>
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
                          src={`http://localhost:8000/${item.img_url}`} 
                          alt={item.label}
                          className="h-16 w-24 object-cover rounded" 
                        />
                      </td>
                      <td className="py-4 px-2">
                        <div className="font-medium">{item.label}</div>
                      </td>
                      <td className="py-4 px-2">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {item.caption}
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
                            onClick={() => handleViewEdit(item)}
                            className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </button>
                          <button 
                            onClick={() => handleViewDelete(item.id)}
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
                      No exterior views found. {filteredItems.length === 0 && "Try changing your filters."}
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
                    <h2 className="font-semibold text-gray-800">{item.label}</h2>
                    <div className="text-xs text-gray-500">ID: {item.id}</div>
                  </div>

                  <Image
                      width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000/${item.img_url}`} 
                    alt={item.label}
                    className="w-full h-40 object-cover rounded" 
                  />

                  <div className="text-sm text-gray-600">
                    {item.caption}
                  </div>

                  <div className="text-sm text-gray-500">
                    Car: {item.car_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    Created: {new Date(item.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                    <button 
                      onClick={() => handleViewEdit(item)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button 
                      onClick={() => handleViewDelete(item.id)}
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
                No exterior views found. {filteredItems.length === 0 && "Try changing your filters."}
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