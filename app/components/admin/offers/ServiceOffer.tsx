"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Edit, Trash, ChevronLeft, ChevronRight, Plus, Upload, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import Image from "next/image"

export default function CarServiceOffersAdmin() {
  const [serviceOffers, setServiceOffers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const offersPerPage = 5

  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Form state
  const [formData, setFormData] = useState({ 
    car_name: "", 
    thumbnail_heading: "", 
    thumbnail_content: "", 
    price: "",
    features: JSON.stringify([
      { duration: "3 Years", title: "", description: "" }
    ])
  })
  const [cardImage, setCardImage] = useState(null)
  const [thumbnailImage, setThumbnailImage] = useState(null)
  const [cardPreview, setCardPreview] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchServiceOffers()
  }, [])

  const fetchServiceOffers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-service-offers")
      if (res.data.success) {
        setServiceOffers(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching service offers:", err)
      toast.error("Failed to fetch service offers")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFeatureChange = (index, field, value) => {
    const features = JSON.parse(formData.features)
    features[index][field] = value
    setFormData({ ...formData, features: JSON.stringify(features) })
  }

  const addFeature = () => {
    const features = JSON.parse(formData.features)
    features.push({ duration: "3 Years", title: "", description: "" })
    setFormData({ ...formData, features: JSON.stringify(features) })
  }

  const removeFeature = (index) => {
    const features = JSON.parse(formData.features)
    if (features.length > 1) {
      features.splice(index, 1)
      setFormData({ ...formData, features: JSON.stringify(features) })
    }
  }

  const handleImageChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB")
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'card') {
          setCardPreview(reader.result)
          setCardImage(file)
        } else {
          setThumbnailPreview(reader.result)
          setThumbnailImage(file)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (type) => {
    if (type === 'card') {
      setCardPreview(null)
      setCardImage(null)
    } else {
      setThumbnailPreview(null)
      setThumbnailImage(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("car_name", formData.car_name)
      formDataToSend.append("thumbnail_heading", formData.thumbnail_heading)
      formDataToSend.append("thumbnail_content", formData.thumbnail_content)
      formDataToSend.append("price", formData.price)
      formDataToSend.append("features", formData.features)
      if (cardImage) formDataToSend.append("card_image", cardImage)
      if (thumbnailImage) formDataToSend.append("thumbnail_image", thumbnailImage)

      let response
      if (editingId) {
        response = await axios.put(`http://localhost:8000/api/car-service-offers/${editingId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Service offer updated successfully")
      } else {
        response = await axios.post("http://localhost:8000/api/car-service-offers", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Service offer added successfully")
      }

      fetchServiceOffers()
      resetForm()
    } catch (err) {
      console.error("Error saving service offer:", err)
      toast.error(err?.response?.data?.message || "Failed to save service offer")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (offer) => {
    const variant = offer.variants[0]
    setEditingId(variant.id)
    setFormData({
      car_name: offer.car_name || "",
      thumbnail_heading: variant.details.heading || "",
      thumbnail_content: variant.details.description || "",
      price: variant.price || "",
      features: JSON.stringify(variant.features || [{ duration: "3 Years", title: "", description: "" }])
    })
    setCardPreview(variant.images.main || null)
    setThumbnailPreview(variant.images.thumbnail || null)
    setCardImage(null)
    setThumbnailImage(null)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service offer?")) return
    try {
      const res = await axios.delete(`http://localhost:8000/api/car-service-offers/${id}`)
      if (res.data.success) {
        fetchServiceOffers()
        toast.success("Service offer deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting service offer:", err)
      toast.error("Failed to delete service offer")
    }
  }

  const resetForm = () => {
    setFormData({ 
      car_name: "", 
      thumbnail_heading: "", 
      thumbnail_content: "", 
      price: "",
      features: JSON.stringify([{ duration: "3 Years", title: "", description: "" }])
    })
    setCardPreview(null)
    setThumbnailPreview(null)
    setCardImage(null)
    setThumbnailImage(null)
    setEditingId(null)
    setShowForm(false)
  }

  const filteredOffers = serviceOffers
    .filter((offer) => {
      const matchesSearch =
        offer.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.variants[0]?.details.heading?.toLowerCase().includes(searchTerm.toLowerCase())
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name_asc": return a.car_name.localeCompare(b.car_name)
        case "name_desc": return b.car_name.localeCompare(a.car_name)
        case "price_low": return a.variants[0].price - b.variants[0].price
        case "price_high": return b.variants[0].price - a.variants[0].price
        default: return 0
      }
    })

  const totalPages = Math.ceil(filteredOffers.length / offersPerPage)
  const currentOffers = filteredOffers.slice(
    (currentPage - 1) * offersPerPage,
    currentPage * offersPerPage
  )

  const features = JSON.parse(formData.features || "[]")

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Add New Button */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Car Service Offers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Service Offer"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Service Offer" : "Add New Service Offer"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Heading *</label>
              <input
                type="text"
                name="thumbnail_heading"
                value={formData.thumbnail_heading}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                required
                step="0.01"
                min="0"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Content *</label>
              <textarea
                name="thumbnail_content"
                value={formData.thumbnail_content}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full text-sm"
                rows="3"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Features</label>
                <button 
                  type="button" 
                  onClick={addFeature}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  + Add Feature
                </button>
              </div>
              
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="border p-3 rounded-md bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Feature {index + 1}</span>
                      {features.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeFeature(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Duration</label>
                        <input
                          type="text"
                          value={feature.duration}
                          onChange={(e) => handleFeatureChange(index, "duration", e.target.value)}
                          className="border px-2 py-1 rounded w-full text-sm"
                          placeholder="e.g., 3 Years"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                          className="border px-2 py-1 rounded w-full text-sm"
                          placeholder="e.g., Unlimited Warranty"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Description</label>
                        <input
                          type="text"
                          value={feature.description}
                          onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                          className="border px-2 py-1 rounded w-full text-sm"
                          placeholder="Description of the feature"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Card Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Card Image</label>
              <div className="flex flex-col items-start gap-2">
                <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Card Image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'card')}
                  />
                </label>
                
                {cardPreview && (
                  <div className="relative">
                    <Image
                      width={100} height={100} quality={100} unoptimized={true} 
                      src={cardPreview} 
                      alt="Card Preview" 
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('card')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Thumbnail Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
              <div className="flex flex-col items-start gap-2">
                <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">Thumbnail Image</p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, 'thumbnail')}
                  />
                </label>
                
                {thumbnailPreview && (
                  <div className="relative">
                    <Image
                      width={100} height={100} quality={100} unoptimized={true} 
                      src={thumbnailPreview} 
                      alt="Thumbnail Preview" 
                      className="w-40 h-40 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage('thumbnail')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
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
          placeholder="Search by car name or heading..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option value="name_asc">Name (A-Z)</option>
          <option value="name_desc">Name (Z-A)</option>
          <option value="price_low">Price (Low to High)</option>
          <option value="price_high">Price (High to Low)</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Images</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Car Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Heading</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Features</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOffers.length > 0 ? (
              currentOffers.map((offer, index) => {
                const variant = offer.variants[0]
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-2">
                      <div className="font-medium">{variant.id}</div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2">
                        {variant.images.main ? (
                          <Image
                            width={100} height={100} quality={100} unoptimized={true} 
                            src={variant.images.main} 
                            alt="Card"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Card</span>
                          </div>
                        )}
                        {variant.images.thumbnail ? (
                          <Image
                            width={100} height={100} quality={100} unoptimized={true} 
                            src={variant.images.thumbnail} 
                            alt="Thumbnail"
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Thumb</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">{offer.car_name || "N/A"}</td>
                    <td className="py-4 px-2">{variant.details.heading || "N/A"}</td>
                    <td className="py-4 px-2">₹{variant.price || "N/A"}</td>
                    <td className="py-4 px-2">
                      <div className="text-xs text-gray-600 max-w-xs">
                        {variant.features && variant.features.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {variant.features.map((feature, i) => (
                              <li key={i}>
                                {feature.duration && <span className="font-semibold">{feature.duration}: </span>}
                                {feature.title}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No features"
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(offer)}
                          className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(variant.id)}
                          className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  No car offers found. {filteredOffers.length === 0 && "Try changing your filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentOffers.length > 0 ? (
          currentOffers.map((offer, index) => {
            const variant = offer.variants[0]
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
              >
                {/* Header with Images */}
                <div className="flex gap-3 items-start">
                  <div className="flex gap-2">
                    {variant.images.main ? (
                      <Image
                        width={100} height={100} quality={100} unoptimized={true} 
                        src={variant.images.main} 
                        alt="Card"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Card</span>
                      </div>
                    )}
                    {variant.images.thumbnail ? (
                      <Image
                        width={100} height={100} quality={100} unoptimized={true} 
                        src={variant.images.thumbnail} 
                        alt="Thumbnail"
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Thumb</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="font-semibold text-gray-800">
                      {offer.car_name || "N/A"}
                    </h2>
                    <p className="text-xs text-gray-500">
                      ID: {variant.id}
                    </p>
                    <p className="text-sm font-semibold text-blue-600 mt-1">
                      ₹{variant.price || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500">Heading</p>
                    <p className="font-medium break-words">{variant.details.heading || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Description</p>
                    <p className="font-medium break-words">{variant.details.description || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Features</p>
                    <div className="font-medium break-words text-xs">
                      {variant.features && variant.features.length > 0 ? (
                        <ul className="list-disc list-inside pl-2">
                          {variant.features.map((feature, i) => (
                            <li key={i}>
                              {feature.duration && <span className="font-semibold">{feature.duration}: </span>}
                              {feature.title}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        "No features"
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer / Actions */}
                <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => handleEdit(offer)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(variant.id)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                    title="Delete"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center text-gray-500">
            No car offers found. {filteredOffers.length === 0 && "Try changing your filters."}
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