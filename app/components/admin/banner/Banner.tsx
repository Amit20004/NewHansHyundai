"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X, ImageIcon } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function PageBannerAdmin() {
  const [banners, setBanners] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [formData, setFormData] = useState({ 
    slug: ""
  })
  const [bannerImage, setBannerImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/page-banner")
      if (res.data.success) {
        setBanners(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching banners:", err)
      toast.error("Failed to fetch banners")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setBannerImage(file)
    }
  }

  const removeImage = () => {
    setBannerImage(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    if (!bannerImage && !editingId) {
      toast.error("Please select an image")
      setIsLoading(false)
      return
    }

    const formDataToSend = new FormData()
    formDataToSend.append('slug', formData.slug)
    
    if (bannerImage) {
      formDataToSend.append('car_image', bannerImage)
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/page-banner/${editingId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Banner updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/page-banner", formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        toast.success("Banner created successfully")
      }
      
      fetchBanners()
      resetForm()
    } catch (err) {
      console.error("Error saving banner:", err)
      toast.error(err.response?.data?.message || "Failed to save banner")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingId(banner.id)
    setFormData({ 
      slug: banner.slug || ""
    })
    setBannerImage(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this banner?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/page-banner/${id}`)
      if (res.data.success) {
        fetchBanners()
        toast.success("Banner deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting banner:", err)
      toast.error("Failed to delete banner")
    }
  }

  const resetForm = () => {
    setFormData({ slug: "" })
    setBannerImage(null)
    setEditingId(null)
    setShowForm(false)
  }

  // Filtering and pagination
  const filteredItems = banners.filter(banner => 
    banner.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.id?.toString().includes(searchTerm)
  )

  const sortedItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()

    switch (sortBy) {
      case "newest": return dateB - dateA
      case "oldest": return dateA - dateB
      case "id": return a.id - b.id
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
        <h1 className="text-xl font-bold">Page Banner Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Banner"}
        </button>
      </div>

      {/* Banner Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Banner" : "Add New Banner"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                placeholder="Enter slug (optional)"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image {editingId ? "(Select new image to replace existing)" : "*"}
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
              
              {bannerImage && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Image to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <Image
                      width={100} height={100} quality={100} unoptimized={true} 
                        src={URL.createObjectURL(bannerImage)} 
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
            
            <div className="flex gap-2 pt-4 border-t border-gray-200">
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
          placeholder="Search by slug or ID..."
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
          <option value="id">ID</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Image</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Slug</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Created</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Updated</th>
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
                      src={`http://localhost:8000/uploads/bannerImage/${item.car_image}`} 
                      alt={item.slug}
                      className="h-16 w-24 object-cover rounded" 
                    />
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-medium">{item.slug || "N/A"}</div>
                  </td>
                  <td className="py-4 px-2">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2">
                    {new Date(item.updated_at).toLocaleDateString()}
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
                <td colSpan="6" className="py-8 text-center text-gray-500">
                  No banners found. {filteredItems.length === 0 && "Try changing your filters."}
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
                <h2 className="font-semibold text-gray-800">Banner #{item.id}</h2>
                <div className="text-xs text-gray-500">Slug: {item.slug || "N/A"}</div>
              </div>

              <Image
              width={100} height={100} quality={100} unoptimized={true} 
                src={`http://localhost:8000/uploads/bannerImage/${item.car_image}`} 
                alt={item.slug}
                className="w-full h-40 object-cover rounded" 
              />

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span> {new Date(item.created_at).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {new Date(item.updated_at).toLocaleDateString()}
                </div>
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
            No banners found. {filteredItems.length === 0 && "Try changing your filters."}
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