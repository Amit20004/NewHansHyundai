"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function GalleryAdmin() {
  const [galleries, setGalleries] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [formData, setFormData] = useState({ 
    title: "", 
    slug: "", 
  })
  const [images, setImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    fetchGalleries()
  }, [])

  const fetchGalleries = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/galleries")
      if (res.data.success) {
        setGalleries(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching galleries:", err)
      toast.error("Failed to fetch galleries")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 10) {
      toast.error("Maximum 10 images allowed")
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const removeExistingImage = (index, galleryId) => {
    if (!confirm("Are you sure you want to delete this image?")) return
    
    axios.delete(`http://localhost:8000/api/gallery/${galleryId}/image`, {
      data: { imageUrl: existingImages[index] }
    })
    .then(res => {
      if (res.data.success) {
        const newImages = [...existingImages]
        newImages.splice(index, 1)
        setExistingImages(newImages)
        toast.success("Image deleted successfully")
      }
    })
    .catch(err => {
      console.error("Error deleting image:", err)
      toast.error("Failed to delete image")
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formDataToSend = new FormData()
    formDataToSend.append('title', formData.title)
    formDataToSend.append('slug', formData.slug)
    
    // Append all images
    images.forEach(image => {
      formDataToSend.append('images', image)
    })
    
    // Append existing images if editing
    if (editingId) {
      formDataToSend.append('existingImages', JSON.stringify(existingImages))
    }

    try {
      if (editingId) {
        // Update existing record
        await axios.put(`http://localhost:8000/api/gallery/${editingId}`, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success("Gallery updated successfully")
      } else {
        // Add new record
        await axios.post("http://localhost:8000/api/gallery", formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        toast.success("Gallery created successfully")
      }
      
      fetchGalleries()
      resetForm()
    } catch (err) {
      console.error("Error saving gallery:", err)
      if (err.response && err.response.data) {
        toast.error(`Error: ${err.response.data.message || "Failed to save gallery"}`)
      } else {
        toast.error("Failed to save gallery. Please check your connection.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (gallery) => {
    setEditingId(gallery.id)
    setFormData({
      title: gallery.title || "",
      slug: gallery.slug || "",
    })
    setExistingImages(gallery.image_array || [])
    setImages([])
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this gallery? All images will be permanently deleted.")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/gallery/${id}`)
      if (res.data.success) {
        fetchGalleries()
        toast.success("Gallery deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting gallery:", err)
      toast.error("Failed to delete gallery")
    }
  }

  const resetForm = () => {
    setFormData({ 
      title: "", 
      slug: "", 
    })
    setImages([])
    setExistingImages([])
    setEditingId(null)
    setShowForm(false)
  }

  const filteredGalleries = galleries
    .filter((gallery) => {
      const matchesSearch =
        gallery.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gallery.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime()
      const dateB = new Date(b.created_at || 0).getTime()

      switch (sortBy) {
        case "newest":
          return dateB - dateA
        case "oldest":
          return dateA - dateB
        case "title":
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredGalleries.length / itemsPerPage)
  const currentItems = filteredGalleries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Gallery Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Gallery"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {editingId ? "Edit Gallery" : "Add New Gallery"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
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
                placeholder="gallery-name"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Images {editingId ? "(Add new images)" : ""}
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
                    multiple 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
              
              {/* Preview new images */}
              {images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">New Images to Upload:</h3>
                  <div className="flex flex-wrap gap-2">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          width={100} height={100} quality={100} unoptimized={true}
                          src={URL.createObjectURL(image)} 
                          alt={`Preview ${index}`}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show existing images when editing */}
              {editingId && existingImages.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Existing Images:</h3>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          width={100} height={100} quality={100} unoptimized={true}
                          src={`http://localhost:8000${image}`} 
                          alt={`Existing ${index}`}
                          className="h-20 w-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index, editingId)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
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
          placeholder="Search by title or slug..."
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
          <option value="title">Title (A-Z)</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Slug</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Images</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Created</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((gallery, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="font-medium">{gallery.id}</div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="font-medium">{gallery.title}</div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="text-sm text-gray-600">{gallery.slug}</div>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex -space-x-2">
                      {gallery.image_array.slice(0, 3).map((img, i) => (
                        <Image
                          width={100} height={100} quality={100} unoptimized={true}
                          key={i} 
                          src={`http://localhost:8000${img}`} 
                          alt="" 
                          className="h-8 w-8 rounded-full border-2 border-white object-cover" 
                        />
                      ))}
                      {gallery.image_array.length > 3 && (
                        <div className="h-8 w-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                          +{gallery.image_array.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    {new Date(gallery.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-2">
                      <a 
                        href={`/gallery/${gallery.slug}`}
                        target="_blank"
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </a>
                      <button 
                        onClick={() => handleEdit(gallery)}
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </button>
                      <button 
                        onClick={() => handleDelete(gallery.id)}
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
                  No galleries found. {filteredGalleries.length === 0 && "Try changing your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((gallery, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {gallery.title}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">{gallery.slug}</p>
                </div>
                <div className="text-xs text-gray-500">
                  ID: {gallery.id}
                </div>
              </div>

              {/* Images */}
              <div>
                <p className="text-gray-500 text-sm mb-1">Images</p>
                <div className="flex -space-x-2">
                  {gallery.image_array.slice(0, 4).map((img, i) => (
                    <Image
                      width={100} height={100} quality={100} unoptimized={true}
                      key={i} 
                      src={`http://localhost:8000${img}`} 
                      alt="" 
                      className="h-10 w-10 rounded-full border-2 border-white object-cover" 
                    />
                  ))}
                  {gallery.image_array.length > 4 && (
                    <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                      +{gallery.image_array.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-500">
                Created: {new Date(gallery.created_at).toLocaleDateString()}
              </div>

              {/* Footer / Actions */}
              <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                <a 
                  href={`/gallery/${gallery.slug}`}
                  target="_blank"
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  title="View"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </a>
                <button 
                  onClick={() => handleEdit(gallery)}
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  title="Edit"
                >
                  <Edit className="h-4 w-4 text-green-600" />
                </button>
                <button 
                  onClick={() => handleDelete(gallery.id)}
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
            No galleries found. {filteredGalleries.length === 0 && "Try changing your filters."}
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