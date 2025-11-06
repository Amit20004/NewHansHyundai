"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Edit, Trash, Plus, X } from "lucide-react"

const BASE_URL = "http://localhost:8000"

const CarServiceEditor = () => {
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    main_heading: "",
    main_content: "",
    tab_title: "",
    points: "",
    imageFile: null,
    imagePreview: null,
  })

  // Fetch all
  const fetchServices = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/fetch-home-car-service`)
      setServices(res.data.data || [])
    } catch (err) {
      console.error("Fetch failed", err)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === "imageFile" && files[0]) {
      setFormData({
        ...formData,
        imageFile: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  // Save new or update
  const saveService = async () => {
    const payload = new FormData()
    payload.append("main_heading", formData.main_heading)
    payload.append("main_content", formData.main_content)
    payload.append("tab_title", formData.tab_title)
    payload.append(
      "points",
      JSON.stringify(
        formData.points
          .split(/\r?\n|,/)
          .map((p) => p.trim())
          .filter(Boolean),
      ),
    )
    if (formData.imageFile) {
      payload.append("image", formData.imageFile)
    }

    try {
      if (editingId) {
        await axios.put(`${BASE_URL}/api/home-tabs-service/${editingId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("✅ Updated successfully!")
      } else {
        await axios.post(`${BASE_URL}/api/home-tabs-service`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("✅ Added successfully!")
      }

      resetForm()
      setShowModal(false)
      fetchServices()
    } catch (err) {
      console.error("Save failed", err)
      alert("Save failed")
    }
  }

  // Edit existing
  const startEdit = (service) => {
    setEditingId(service.id)
    setFormData({
      main_heading: service.main_heading,
      main_content: service.main_content,
      tab_title: service.tab_title,
      points: Array.isArray(service.points) ? service.points.join(", ") : service.points,
      imageFile: null,
      imagePreview: service.image_url ? `${BASE_URL}${service.image_url}` : null,
    })
    setShowModal(true)
  }

  // Delete
  const deleteService = async (id) => {
    if (!window.confirm("Delete this service?")) return
    try {
      await axios.delete(`${BASE_URL}/api/home-tabs-service/${id}`)
      fetchServices()
    } catch (err) {
      console.error("Delete failed", err)
      alert("Delete failed")
    }
  }

  const resetForm = () => {
    setFormData({
      main_heading: "",
      main_content: "",
      tab_title: "",
      points: "",
      imageFile: null,
      imagePreview: null,
    })
    setEditingId(null)
    setShowModal(false)
  }

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 mt-5">
      {/* Responsive header with add button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Car Services</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-900">Main Heading</th>
              <th className="px-4 py-3 font-medium text-gray-900">Content</th>
              <th className="px-4 py-3 font-medium text-gray-900">Tab Title</th>
              <th className="px-4 py-3 font-medium text-gray-900">Points</th>
              <th className="px-4 py-3 font-medium text-gray-900">Image</th>
              <th className="px-4 py-3 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">{item.main_heading}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{item.main_content}</td>
                <td className="px-4 py-3 text-gray-600">{item.tab_title}</td>
                <td className="px-4 py-3">
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {Array.isArray(item.points) ? (
                      item.points.slice(0, 2).map((p, i) => <li key={i}>{p}</li>)
                    ) : (
                      <li>{item.points}</li>
                    )}
                    {Array.isArray(item.points) && item.points.length > 2 && (
                      <li className="text-gray-400">+{item.points.length - 2} more</li>
                    )}
                  </ul>
                </td>
                <td className="px-4 py-3">
                  {item.image_url ? (
                    <Image

                      src={`${BASE_URL}${item.image_url}`}
                      alt="Service"
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      No image
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteService(item.id)}
                      className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden space-y-4">
        {services.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.main_heading}</h3>
              <div className="flex gap-2 ml-2">
                <button
                  onClick={() => startEdit(item)}
                  className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => deleteService(item.id)}
                  className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Tab Title:</span>
                <p className="text-gray-900 mt-1">{item.tab_title}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Content:</span>
                <p className="text-gray-700 mt-1 text-sm leading-relaxed">{item.main_content}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Points:</span>
                <ul className="list-disc list-inside text-sm text-gray-700 mt-1 space-y-1">
                  {Array.isArray(item.points) ? (
                    item.points.map((p, i) => <li key={i}>{p}</li>)
                  ) : (
                    <li>{item.points}</li>
                  )}
                </ul>
              </div>

              {item.image_url && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Image:</span>
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`${BASE_URL}${item.image_url}`}
                    alt="Service"
                    className="w-full h-32 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{editingId ? "Edit Service" : "Add New Service"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Heading</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter main heading"
                  name="main_heading"
                  value={formData.main_heading}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Main Content</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter main content"
                  name="main_content"
                  value={formData.main_content}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tab Title</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tab title"
                  name="tab_title"
                  value={formData.tab_title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Points (comma or newline separated)
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter points separated by commas or new lines"
                  name="points"
                  value={formData.points}
                  onChange={handleChange}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input
                  type="file"
                  name="imageFile"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {formData.imagePreview && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <Image
                    
                    src={formData.imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveService}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingId ? "Update Service" : "Save Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarServiceEditor
