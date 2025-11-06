"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Trash, ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function LoanEnquiryAdmin() {
  const [enquiries, setEnquiries] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchEnquiries()
  }, [currentPage, statusFilter, searchTerm])

  const fetchEnquiries = async () => {
    setIsLoading(true)
    try {
      // const params = new URLSearchParams({
      //   page: currentPage,
      //   limit: itemsPerPage,
      //   ...(statusFilter !== "all" && { status: statusFilter }),
      //   ...(searchTerm && { search: searchTerm })
      // })

      const res = await axios.get(`http://localhost:8000/api/fetch-loan-enquiry`)
      if (res.data.success) {
        setEnquiries(res.data.data)
        setTotalPages(res.data.totalPages)
        setTotalItems(res.data.total)
      }
    } catch (err) {
      console.error("Error fetching loan enquiries:", err)
      toast.error("Failed to fetch loan enquiries")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (enquiry) => {
    setSelectedEnquiry(enquiry)
    setShowDetailModal(true)
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/put-loan-enquiry/${id}`, {
        status: newStatus
      })
      
      if (res.data.success) {
        toast.success("Status updated successfully")
        fetchEnquiries()
      }
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this loan enquiry?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/delete-loan-enquiry/${id}`)
      if (res.data.success) {
        toast.success("Loan enquiry deleted successfully")
        fetchEnquiries()
      }
    } catch (err) {
      console.error("Error deleting loan enquiry:", err)
      toast.error("Failed to delete loan enquiry")
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6">Loan Enquiry Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 pl-9 rounded w-full text-sm"
          />
        </div>
        
        <div className="flex gap-2 items-center">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-xl md:text-2xl font-bold">{totalItems}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">
            {enquiries.filter(e => e.status === 'pending').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Approved</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {enquiries.filter(e => e.status === 'approved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Rejected</div>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            {enquiries.filter(e => e.status === 'rejected').length}
          </div>
        </div>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[1000px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Car Model</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Loan Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Submitted</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : enquiries.length > 0 ? (
              enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium">#{enquiry.id}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{enquiry.name}</div>
                    <div className="text-sm text-gray-600">{enquiry.email}</div>
                    <div className="text-sm text-gray-600">{enquiry.mobile}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{enquiry.selected_car}</div>
                    {enquiry.car_variant && (
                      <div className="text-sm text-gray-600">{enquiry.car_variant}</div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{formatCurrency(enquiry.loan_amount)}</div>
                    <div className="text-sm text-gray-600">{enquiry.loan_duration} months</div>
                  </td>
                  <td className="py-4 px-4">
                    {formatDate(enquiry.created_at)}
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={enquiry.status}
                      onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border ${
                        enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        enquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        enquiry.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(enquiry)}
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(enquiry.id)}
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
                  No loan enquiries found.
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
        ) : enquiries.length > 0 ? (
          enquiries.map((enquiry) => (
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
                <p className="text-sm">{enquiry.mobile}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Car Details</h3>
                <p className="text-sm">{enquiry.selected_car}</p>
                {enquiry.car_variant && (
                  <p className="text-sm text-gray-600">{enquiry.car_variant}</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Loan Details</h3>
                <p className="text-sm">{formatCurrency(enquiry.loan_amount)}</p>
                <p className="text-sm text-gray-600">{enquiry.loan_duration} months</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">{formatDate(enquiry.created_at)}</p>
                </div>
                <select
                  value={enquiry.status}
                  onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                  className={`text-xs px-2 py-1 rounded border ${
                    enquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                    enquiry.status === 'contacted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    enquiry.status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' :
                    'bg-red-100 text-red-800 border-red-200'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleViewDetails(enquiry)}
                  className="flex items-center gap-1 text-blue-600 text-sm px-3 py-1 border border-gray-200 rounded"
                >
                  <Eye className="h-4 w-4" /> Details
                </button>
                <button
                  onClick={() => handleDelete(enquiry.id)}
                  className="flex items-center gap-1 text-red-600 text-sm px-3 py-1 border border-gray-200 rounded"
                >
                  <Trash className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No loan enquiries found.
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

      {/* Detail Modal */}
      {showDetailModal && selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Loan Enquiry Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{selectedEnquiry.title} {selectedEnquiry.name}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedEnquiry.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Mobile</div>
                      <div className="font-medium">{selectedEnquiry.mobile}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">PAN Number</div>
                      <div className="font-medium">{selectedEnquiry.pan_no}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Address</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <div className="font-medium">
                        {selectedEnquiry.address1}<br />
                        {selectedEnquiry.address2 && <>{selectedEnquiry.address2}<br /></>}
                        {selectedEnquiry.city}, {selectedEnquiry.area}<br />
                        {selectedEnquiry.pincode}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Car Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Selected Car</div>
                      <div className="font-medium">{selectedEnquiry.selected_car}</div>
                    </div>
                    {selectedEnquiry.car_variant && (
                      <div>
                        <div className="text-sm text-gray-500">Variant</div>
                        <div className="font-medium">{selectedEnquiry.car_variant}</div>
                      </div>
                    )}
                    {selectedEnquiry.car_color && (
                      <div>
                        <div className="text-sm text-gray-500">Color</div>
                        <div className="font-medium">{selectedEnquiry.car_color}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Loan Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Loan Amount</div>
                      <div className="font-medium">{formatCurrency(selectedEnquiry.loan_amount)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Loan Duration</div>
                      <div className="font-medium">{selectedEnquiry.loan_duration} months</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Employment Type</div>
                      <div className="font-medium">{selectedEnquiry.employment_type}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Annual Income</div>
                      <div className="font-medium">{formatCurrency(selectedEnquiry.annual_income)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Time Frame</div>
                      <div className="font-medium">{selectedEnquiry.time_frame}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-500">Submitted On</div>
                  <div className="font-medium">{formatDate(selectedEnquiry.created_at)}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}