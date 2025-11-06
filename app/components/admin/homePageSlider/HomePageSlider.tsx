"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import Image from "next/image"

const BASE_URL = "http://localhost:8000"

export default function HomeCarouselAdmin() {
  const [carouselData, setCarouselData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // form states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    image_name: "",
    image: null,
    imagePreview: null
  })

  useEffect(() => {
    fetchCarouselData()
  }, [])

  const fetchCarouselData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/home-carousel`)
      if (res.data.success) {
        setCarouselData(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching carousel data:", err)
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
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = new FormData()
      payload.append('image_name', formData.image_name)
      
      if (formData.image) {
        payload.append('image', formData.image)
      }

      if (isEditing) {
        await axios.put(`${BASE_URL}/api/home-carousel/${formData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Updated successfully")
      } else {
        await axios.post(`${BASE_URL}/api/home-carousel`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      fetchCarouselData()
      setIsFormOpen(false)
      setIsEditing(false)
      resetForm()
    } catch (err) {
      console.error("Error saving carousel item:", err)
      alert("Error saving item: " + (err.response?.data?.message || err.message))
    }
  }

  const handleEdit = (item) => {
    setIsEditing(true)
    setFormData({ 
      id: item.id,
      image_name: item.image_name,
      image: null,
      imagePreview: `${BASE_URL}${item.image_url}` // ✅ full URL for preview
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this carousel item?")) return
    try {
      await axios.delete(`${BASE_URL}/api/home-carousel/${id}`)
      fetchCarouselData()
    } catch (err) {
      console.error("Error deleting carousel item:", err)
      alert("Error deleting item: " + (err.response?.data?.message || err.message))
    }
  }

  const resetForm = () => {
    setFormData({
      id: null,
      image_name: "",
      image: null,
      imagePreview: null
    })
  }

  const filteredItems = carouselData
    .filter((item) => {
      return item.image_name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Filters + Add button */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search carousel items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
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
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>

      {/* Carousel Form (Add/Edit) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3"
        >
          <h2 className="font-semibold text-lg">
            {isEditing ? "Edit Carousel Item" : "Add New Carousel Item"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image Name */}
            <div className="flex flex-col">
              <label htmlFor="image_name" className="text-sm font-medium text-gray-700">
                Image Name
              </label>
              <input
                id="image_name"
                name="image_name"
                value={formData.image_name}
                onChange={handleInputChange}
                placeholder="Enter image name"
                className="border px-3 py-2 rounded text-sm"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col">
              <label htmlFor="image" className="text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                id="image"
                type="file"
                name="image"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
                accept="image/*"
                required={!isEditing}
              />
            </div>

            {/* Image Preview */}
            {formData.imagePreview && (
              <div className="sm:col-span-2 flex flex-col">
                <label className="text-sm font-medium text-gray-700">Preview</label>
                <div className="mt-2 border rounded p-2">
                  <Image
                    width={100} height={100} quality={100} unoptimized={true}
                    src={formData.imagePreview} 
                    alt="Preview" 
                    className="max-h-40 object-contain mx-auto"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              {isEditing ? "Update Item" : "Add Item"}
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
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Image Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Preview</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Created At</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">{item.id}</td>
                <td className="py-4 px-2 font-medium">{item.image_name}</td>
                <td className="py-4 px-2">
                  <Image
                    width={100} height={100} quality={100} unoptimized={true}
                    src={`${BASE_URL}${item.image_url}`} 
                    alt={item.image_name} 
                    className="h-12 w-16 object-cover rounded"
                  />
                </td>
                <td className="py-4 px-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <a 
                      href={`${BASE_URL}${item.image_url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </a>
                    <button onClick={() => handleEdit(item)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
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
        {currentItems.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-2">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{item.image_name}</h2>
              <span className="text-xs text-gray-500">ID: {item.id}</span>
            </div>
            
            <div className="flex justify-center">
              <Image
                width={100} height={100} quality={100} unoptimized={true}
                src={`${BASE_URL}${item.image_url}`} 
                alt={item.image_name} 
                className="h-20 w-28 object-cover rounded"
              />
            </div>
            
            <p className="text-sm text-gray-600">
              Created: {new Date(item.created_at).toLocaleDateString()}
            </p>
            
            <div className="flex gap-2 pt-2">
              <a 
                href={`${BASE_URL}${item.image_url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <Eye className="h-4 w-4 text-blue-600" />
              </a>
              <button onClick={() => handleEdit(item)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                <Edit className="h-4 w-4 text-green-600" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
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
