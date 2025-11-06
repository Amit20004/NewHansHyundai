"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function SalesEnquiry() {
  const [carData, setCarData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const carsPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [sortBy, setSortBy] = useState("newest")

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    mobile: "",
    city: "",
    model: "",
    dealer: "",
    comments: "",
    status: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [viewData, setViewData] = useState(null)

  useEffect(() => {
    fetchCarData()
  }, [])

  const fetchCarData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/fetch-test-drive-bookings"
      )
      if (res.data.success) {
        setCarData(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching car data:", err)
      toast.error("Failed to fetch data")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isEditing) return
    try {
      await axios.put(
        `http://localhost:8000/api/test-drive/${formData.id}`,
        formData
      )
      toast.success("Booking updated successfully")
      setFormData({
        id: null,
        name: "",
        email: "",
        mobile: "",
        city: "",
        model: "",
        dealer: "",
        comments: "",
        status: "",
      })
      setIsEditing(false)
      fetchCarData()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.message || "Error updating booking")
    }
  }

  const handleEdit = (car) => {
    setFormData({
      id: car.id,
      name: car.name || "",
      email: car.email || "",
      mobile: car.mobile || "",
      city: car.city || "",
      model: car.model || "",
      dealer: car.dealer || "",
      comments: car.comments || "",
      status: car.status || "",
    })
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    try {
      await axios.delete(`http://localhost:8000/api/test-drive/${id}`)
      toast.success("Deleted successfully")
      fetchCarData()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete booking")
    }
  }

  const handleView = (car) => {
    setViewData(car)
  }

  const filteredCars = carData
    .filter((car) => {
      const matchesSearch =
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.dealer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.name?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory =
        selectedCategory === "All Categories" || car.model === selectedCategory
      return matchesSearch && matchesCategory
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
      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white p-6 shadow mb-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Edit Booking</h2>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              name="model"
              placeholder="Car Model"
              value={formData.model}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
              required
            />
            <input
              type="text"
              name="dealer"
              placeholder="Dealer"
              value={formData.dealer}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
              required
            />
            <textarea
              name="comments"
              placeholder="Comments"
              rows={3}
              value={formData.comments}
              onChange={handleInputChange}
              className="border px-3 py-2 col-span-1 md:col-span-2 rounded"
            />
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 col-span-1 md:col-span-2 rounded"
            >
              Update Booking
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-5">
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
          {[...new Set(carData.map((c) => c.model).filter(Boolean))].map(
            (cat, i) => (
              <option key={i}>{cat}</option>
            )
          )}
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
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                S.No.
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Name
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Email
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Mobile
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                City
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Car Model
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Dealer
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCars.map((car, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-2">{(currentPage - 1) * carsPerPage + index + 1}</td>
                <td className="py-4 px-2">{car.name || "N/A"}</td>
                <td className="py-4 px-2">{car.email || "N/A"}</td>
                <td className="py-4 px-2">{car.mobile || "N/A"}</td>
                <td className="py-4 px-2">{car.city || "N/A"}</td>
                <td className="py-4 px-2">{car.model || "N/A"}</td>
                <td className="py-4 px-2">{car.dealer || "N/A"}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <button
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                      onClick={() => handleView(car)}
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                      onClick={() => handleEdit(car)}
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                      onClick={() => handleDelete(car.id)}
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden mt-5 space-y-4">
        {currentCars.map((car, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-800">{car.name || "N/A"}</h2>
                <p className="text-xs text-gray-500">{car.email || "N/A"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-gray-500">Mobile</p>
                <p className="font-medium">{car.mobile || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">City</p>
                <p className="font-medium">{car.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Car Model</p>
                <p className="font-medium">{car.model || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Dealer</p>
                <p className="font-medium">{car.dealer || "N/A"}</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">
                Added {car.created_at || "—"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  onClick={() => handleView(car)}
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                </button>
                <button
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  onClick={() => handleEdit(car)}
                >
                  <Edit className="h-4 w-4 text-green-600" />
                </button>
                <button
                  className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  onClick={() => handleDelete(car.id)}
                >
                  <Trash className="h-4 w-4 text-red-600" />
                </button>
              </div>
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

      {/* View Modal */}
      {viewData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setViewData(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            <div className="space-y-2 text-sm">
              <p><strong>Name:</strong> {viewData.name}</p>
              <p><strong>Email:</strong> {viewData.email}</p>
              <p><strong>Mobile:</strong> {viewData.mobile}</p>
              <p><strong>City:</strong> {viewData.city}</p>
              <p><strong>Car Model:</strong> {viewData.model}</p>
              <p><strong>Dealer:</strong> {viewData.dealer}</p>
              <p><strong>Comments:</strong> {viewData.comments || "N/A"}</p>
              <p><strong>Status:</strong> {viewData.status || "N/A"}</p>
              <p><strong>Added:</strong> {viewData.created_at}</p>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  )
}
