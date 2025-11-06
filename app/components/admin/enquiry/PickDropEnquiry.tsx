"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Eye, Trash, ChevronLeft, ChevronRight, Search, Filter, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function PickDropServiceAdmin() {
  const [bookings, setBookings] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    fetchBookings()
  }, [currentPage, statusFilter, searchTerm])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(statusFilter !== "all" && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      }
      
      const res = await axios.get(`http://localhost:8000/api/pick-drop-service`, { params })
      
      setBookings(res.data.data)
      setTotalPages(res.data.pagination.totalPages)
      setTotalItems(res.data.pagination.totalItems)
    } catch (err) {
      console.error("Error fetching pick & drop service bookings:", err)
      toast.error("Failed to fetch bookings")
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (booking) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/pick-drop-service/${booking.id}`)
      setSelectedBooking(res.data)
      setShowDetailModal(true)
    } catch (err) {
      console.error("Error fetching booking details:", err)
      toast.error("Failed to fetch booking details")
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:8000/api/pick-drop-service/${id}`, {
        status: newStatus
      })
      
      if (res.status === 200) {
        toast.success("Status updated successfully")
        fetchBookings()
      }
    } catch (err) {
      console.error("Error updating status:", err)
      toast.error("Failed to update status")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return
    
    try {
      const res = await axios.delete(`http://localhost:8000/api/pick-drop-service/${id}`)
      if (res.status === 200) {
        toast.success("Booking deleted successfully")
        fetchBookings()
      }
    } catch (err) {
      console.error("Error deleting booking:", err)
      toast.error("Failed to delete booking")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    
    if (timeString.includes(':')) {
      try {
        const timeParts = timeString.split(':');
        if (timeParts.length >= 2) {
          const hours = parseInt(timeParts[0]);
          const minutes = parseInt(timeParts[1]);
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          
          return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
        }
      } catch (e) {
        console.error('Error formatting time:', e);
      }
    }
    
    return timeString;
  }

  const formatMobile = (mobile) => {
    if (!mobile) return 'N/A';
    
    const cleanMobile = mobile.toString().replace(/\D/g, '');
    
    if (cleanMobile.length === 10) {
      return `${cleanMobile.slice(0, 5)} ${cleanMobile.slice(5)}`;
    }
    
    return mobile;
  }

  const getStatusBadge = (status) => {
    if (!status) status = 'pending';
    
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      'in-progress': "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    }
    
    const displayStatus = status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
        {displayStatus}
      </span>
    )
  }

  // Calculate status counts
  const getStatusCounts = () => {
    const counts = {
      pending: 0,
      confirmed: 0,
      'in-progress': 0,
      completed: 0,
      cancelled: 0
    };
    
    bookings.forEach(booking => {
      const status = booking.status || 'pending';
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  }

  const statusCounts = getStatusCounts();

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6">Pick & Drop Service Management</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, car model..."
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
            <option value="confirmed">Confirmed</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-xl md:text-2xl font-bold">{totalItems}</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-xl md:text-2xl font-bold text-yellow-600">
            {statusCounts.pending}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Confirmed</div>
          <div className="text-xl md:text-2xl font-bold text-blue-600">
            {statusCounts.confirmed}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">In Progress</div>
          <div className="text-xl md:text-2xl font-bold text-purple-600">
            {statusCounts['in-progress']}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-sm text-gray-500">Completed</div>
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {statusCounts.completed}
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
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Car Details</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Service Center</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="w-6 h-6 border-t-2 border-blue-500 rounded-full animate-spin"></div>
                  </div>
                </td>
              </tr>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="font-medium">#{booking.id}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{booking.name || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{booking.email || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{formatMobile(booking.mobile)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{booking.car_model || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{booking.car_number || 'N/A'}</div>
                    <div className="text-sm text-gray-600">{booking.mileage ? `${booking.mileage} km` : 'N/A'}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{booking.service_type || 'N/A'}</div>
                    {booking.description && (
                      <div className="text-sm text-gray-600 truncate max-w-xs" title={booking.description}>
                        {booking.description}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <div>{formatDate(booking.service_date)}</div>
                    <div className="text-sm text-gray-600">{formatTime(booking.service_time)}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-medium">{booking.service_center || 'N/A'}</div>
                    <div className="text-sm text-gray-600">
                      Pickup: {booking.pick_up === 'Yes' ? 'Yes' : 'No'}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <select
                      value={booking.status || 'pending'}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border ${
                        (!booking.status || booking.status === 'pending') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4 text-blue-600" />
                      </button>
                      <button
                        onClick={() => handleDelete(booking.id)}
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
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  No service bookings found.
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
        ) : bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold">{booking.name || 'N/A'}</h2>
                <span className="text-sm text-gray-500">#{booking.id}</span>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Contact</h3>
                <p className="text-sm">{booking.email || 'N/A'}</p>
                <p className="text-sm">{formatMobile(booking.mobile)}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Car Details</h3>
                <p className="text-sm">{booking.car_model || 'N/A'}</p>
                <p className="text-sm text-gray-600">{booking.car_number || 'N/A'}</p>
                {booking.mileage && (
                  <p className="text-sm text-gray-600">{booking.mileage} km</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Service</h3>
                <p className="text-sm">{booking.service_type || 'N/A'}</p>
                {booking.description && (
                  <p className="text-sm text-gray-600">{booking.description}</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Date & Time</h3>
                  <p className="text-sm">{formatDate(booking.service_date)}</p>
                  <p className="text-sm text-gray-600">{formatTime(booking.service_time)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Service Center</h3>
                  <p className="text-sm">{booking.service_center || 'N/A'}</p>
                  <p className="text-sm text-gray-600">
                    Pickup: {booking.pick_up === 'Yes' ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Status</h3>
                  <select
                    value={booking.status || 'pending'}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded border ${
                      (!booking.status || booking.status === 'pending') ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      booking.status === 'in-progress' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      'bg-red-100 text-red-800 border-red-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(booking)}
                    className="p-2 border rounded text-blue-600"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="p-2 border rounded text-red-600"
                    title="Delete"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            No service bookings found.
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
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Pick & Drop Service Details</h2>
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
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Customer Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Name</div>
                      <div className="font-medium">{selectedBooking.name || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium">{selectedBooking.email || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Mobile</div>
                      <div className="font-medium">{formatMobile(selectedBooking.mobile)}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Car Information</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Car Model</div>
                      <div className="font-medium">{selectedBooking.car_model || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Car Number</div>
                      <div className="font-medium">{selectedBooking.car_number || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Mileage</div>
                      <div className="font-medium">{selectedBooking.mileage ? `${selectedBooking.mileage} km` : 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Service Details</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Service Type</div>
                      <div className="font-medium">{selectedBooking.service_type || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Service Center</div>
                      <div className="font-medium">{selectedBooking.service_center || 'N/A'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Pickup Service</div>
                      <div className="font-medium">{selectedBooking.pick_up === 'Yes' ? 'Yes' : 'No'}</div>
                    </div>
                    {selectedBooking.description && (
                      <div>
                        <div className="text-sm text-gray-500">Description</div>
                        <div className="font-medium">{selectedBooking.description}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4 text-gray-800">Schedule</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm text-gray-500">Service Date</div>
                      <div className="font-medium">{formatDate(selectedBooking.service_date)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Service Time</div>
                      <div className="font-medium">{formatTime(selectedBooking.service_time)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="font-medium">{getStatusBadge(selectedBooking.status)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <div className="text-sm text-gray-500">Submitted On</div>
                  <div className="font-medium">
                    {selectedBooking.created_at ? formatDate(selectedBooking.created_at) : 'N/A'}
                  </div>
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