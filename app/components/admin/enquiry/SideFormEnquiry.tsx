"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trash, Search } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function EnquiryAdminPanel() {
  const [enquiries, setEnquiries] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Fetch enquiries on component mount
  useEffect(() => {
    fetchEnquiries()
  }, [])

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get("http://localhost:8000/api/fetch-side-form-enquiries")
      if (res.data.success) {
        setEnquiries(res.data.data)
      }
    } catch (err) {
      console.error("Error fetching enquiries:", err)
      toast.error("Failed to fetch enquiries")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return
    try {
      const res = await axios.delete(`http://localhost:8000/api/side-form-enquiry/${id}`)
      if (res.data.success) {
        fetchEnquiries()
        toast.success("Enquiry deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting enquiry:", err)
      toast.error("Failed to delete enquiry")
    }
  }

  // Filter enquiries based on search
  const filteredEnquiries = enquiries.filter(
    e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.contact_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.enquiry_type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      <h1 className="text-xl font-bold mb-6">Enquiry Admin Panel</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, email, contact, type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 pl-9 rounded w-full text-sm"
        />
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Enquiry Type</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Model</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Marketing Consent</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : filteredEnquiries.length > 0 ? (
              filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">{enquiry.id}</td>
                  <td className="py-4 px-4">{enquiry.name}</td>
                  <td className="py-4 px-4">{enquiry.email}</td>
                  <td className="py-4 px-4">{enquiry.contact_number}</td>
                  <td className="py-4 px-4">{enquiry.enquiry_type}</td>
                  <td className="py-4 px-4">{enquiry.model || "N/A"}</td>
                  <td className="py-4 px-4">{enquiry.location || "N/A"}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${enquiry.agree_to_marketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {enquiry.agree_to_marketing ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleDelete(enquiry.id)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                      title="Delete"
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="py-8 text-center text-gray-500">
                  No enquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <div className="flex justify-center">
              <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredEnquiries.length > 0 ? (
          filteredEnquiries.map((enquiry) => (
            <div
              key={enquiry.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold">{enquiry.name}</h2>
                <span className="text-sm text-gray-500">#{enquiry.id}</span>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Contact</h3>
                <p className="text-sm">{enquiry.email}</p>
                <p className="text-sm">{enquiry.contact_number}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Enquiry Type</h3>
                <p className="text-sm">{enquiry.enquiry_type}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Model</h3>
                  <p className="text-sm">{enquiry.model || "N/A"}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Location</h3>
                  <p className="text-sm">{enquiry.location || "N/A"}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Marketing Consent</h3>
                  <span className={`px-2 py-1 rounded text-xs ${enquiry.agree_to_marketing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {enquiry.agree_to_marketing ? "Yes" : "No"}
                  </span>
                </div>
                
                <button
                  onClick={() => handleDelete(enquiry.id)}
                  className="p-2 border rounded text-red-600"
                  title="Delete"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No enquiries found
          </div>
        )}
      </div>
    </div>
  )
}