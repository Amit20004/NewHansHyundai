"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function CarPerformanceAdmin() {
  const [performanceItems, setPerformanceItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

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
      if (res.data.success) setPerformanceItems(res.data.data)
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
    if (file) setImage(file)
  }

  const removeImage = () => setImage(null)

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

    if (image) formDataToSend.append('image', image)

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
    setForm({ car_variant: "", tab_title: "", short_description: "", long_description: "", car_name: "" })
    setImage(null)
    setEditingId(null)
    setShowForm(false)
  }

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
  const currentItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-4 flex justify-between items-center flex-wrap gap-3">
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
          {/* Form fields same as before */}
          {/* ... (No changes in form code, keep your original form here) */}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm mt-4">
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

      {/* Desktop Table */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="py-3 px-2 text-left font-semibold">ID</th>
              <th className="py-3 px-2 text-left font-semibold">Image</th>
              <th className="py-3 px-2 text-left font-semibold">Car Variant</th>
              <th className="py-3 px-2 text-left font-semibold">Tab Title</th>
              <th className="py-3 px-2 text-left font-semibold">Short Description</th>
              <th className="py-3 px-2 text-left font-semibold">Car Name</th>
              <th className="py-3 px-2 text-left font-semibold">Created</th>
              <th className="py-3 px-2 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-2 py-3">{item.id}</td>
                  <td className="px-2 py-3">
                    <img src={`http://localhost:8000/${item.image_url}`} className="h-16 w-24 object-cover rounded" />
                  </td>
                  <td className="px-2 py-3 capitalize">{item.car_variant}</td>
                  <td className="px-2 py-3">{item.tab_title}</td>
                  <td className="px-2 py-3 truncate max-w-xs">{item.short_description}</td>
                  <td className="px-2 py-3">{item.car_name}</td>
                  <td className="px-2 py-3">{new Date(item.created_at).toLocaleDateString()}</td>
                  <td className="px-2 py-3 flex gap-2">
                    <button onClick={() => handleEdit(item)} className="border p-1 rounded hover:bg-gray-100">
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="border p-1 rounded hover:bg-gray-100">
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500">
                  No performance items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden mt-5 space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <h2 className="font-semibold">{item.tab_title}</h2>
                <span className="text-xs text-gray-500">ID: {item.id}</span>
              </div>
              <img src={`http://localhost:8000/${item.image_url}`} className="w-full h-40 object-cover rounded" />
              <p className="text-sm"><strong>Variant:</strong> {item.car_variant}</p>
              <p className="text-sm"><strong>Description:</strong> {item.short_description}</p>
              <p className="text-sm"><strong>Car:</strong> {item.car_name}</p>
              <p className="text-xs text-gray-500">Created: {new Date(item.created_at).toLocaleDateString()}</p>
              <div className="flex justify-end gap-2 border-t pt-3">
                <button onClick={() => handleEdit(item)} className="border p-1 rounded hover:bg-gray-100">
                  <Edit className="h-4 w-4 text-green-600" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="border p-1 rounded hover:bg-gray-100">
                  <Trash className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-sm border">
            No performance items found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 pb-6 flex-wrap">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 border rounded disabled:opacity-50"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
