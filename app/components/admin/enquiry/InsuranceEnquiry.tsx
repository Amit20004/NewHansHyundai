"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash, ChevronLeft, ChevronRight, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function InsuranceEnquiryAdmin() {
  const [enquiryData, setEnquiryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEnquiryData();
  }, []);

  const fetchEnquiryData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8000/api/insurance-enquiries");
      if (res.data.success) setEnquiryData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`http://localhost:8000/api/insurance-enquiries/${id}`, { status });
      toast.success("Status updated successfully");
      fetchEnquiryData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/insurance-enquiries/${id}`);
      toast.success("Deleted successfully");
      fetchEnquiryData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete enquiry");
    }
  };

  // Filter & Pagination
  const filtered = enquiryData.filter(
    e =>
      e.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vehicle_reg_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      <h1 className="text-2xl font-bold mb-6">Insurance Enquiries</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by name, vehicle, email or status..." 
          value={searchTerm} 
          onChange={e => setSearchTerm(e.target.value)} 
          className="border px-3 py-2 pl-9 rounded w-full text-sm" 
        />
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">S.No</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Full Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Vehicle Reg No</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Insurance</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
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
            ) : currentItems.length > 0 ? (
              currentItems.map((e, idx) => (
                <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">{(currentPage-1)*itemsPerPage + idx + 1}</td>
                  <td className="py-4 px-4">{e.full_name}</td>
                  <td className="py-4 px-4">
                    <div>{e.mobile}</div>
                    <div className="text-xs text-gray-500">{e.email}</div>
                  </td>
                  <td className="py-4 px-4">{e.vehicle_reg_no}</td>
                  <td className="py-4 px-4">{e.current_insurance}</td>
                  <td className="py-4 px-4">
                    <select 
                      value={e.status} 
                      onChange={(event) => handleStatusUpdate(e.id, event.target.value)}
                      className={`px-2 py-1 rounded text-xs border ${
                        e.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                        e.status === 'contacted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        e.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">{formatDate(e.created_at)}</td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => handleDelete(e.id)} 
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                      title="Delete"
                    >
                      <Trash className="w-4 h-4 text-red-600"/>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
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
        ) : currentItems.length > 0 ? (
          currentItems.map((e, idx) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold">{e.full_name}</h2>
                <span className="text-sm text-gray-500">
                  #{(currentPage-1)*itemsPerPage + idx + 1}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Contact</h3>
                <p className="text-sm">{e.mobile}</p>
                <p className="text-sm text-gray-600">{e.email}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Vehicle Details</h3>
                <p className="text-sm">{e.vehicle_reg_no}</p>
                <p className="text-sm text-gray-600">{e.current_insurance}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Status</h3>
                  <select 
                    value={e.status} 
                    onChange={(event) => handleStatusUpdate(e.id, event.target.value)}
                    className={`px-2 py-1 rounded text-xs border ${
                      e.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200' :
                      e.status === 'contacted' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      e.status === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                      'bg-yellow-100 text-yellow-800 border-yellow-200'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div>
                  <h3 className="font-medium text-sm text-gray-700">Date</h3>
                  <p className="text-sm">{formatDate(e.created_at)}</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={() => handleDelete(e.id)} 
                  className="p-2 border rounded text-red-600"
                  title="Delete"
                >
                  <Trash className="w-4 h-4"/>
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4 pb-6 flex-wrap">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p-1))} 
            disabled={currentPage === 1} 
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} 
            disabled={currentPage === totalPages} 
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}