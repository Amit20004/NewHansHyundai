"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, ChevronLeft, ChevronRight, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function CarAccessoryEnquiry() {
  const [enquiryData, setEnquiryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    id: null,
    productId: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    message: "",
    status: "pending",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 5;

  useEffect(() => {
    fetchEnquiryData();
  }, []);

  const fetchEnquiryData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/enquiries");
      if (res.data.success) setEnquiryData(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch enquiries");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/enquiries/${formData.id}`,
          formData
        );
        toast.success("Updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/enquiries", formData);
        toast.success("Enquiry submitted successfully");
      }
      setFormData({
        id: null,
        productId: "",
        customerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        message: "",
        status: "pending",
      });
      setIsEditing(false);
      fetchEnquiryData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error submitting form");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      productId: item.product_id || "",
      customerName: item.customer_name || "",
      email: item.email || "",
      phone: item.phone || "",
      address: item.address || "",
      city: item.city || "",
      pincode: item.pincode || "",
      message: item.message || "",
      status: item.status || "pending",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/enquiries/${id}`);
      toast.success("Deleted successfully");
      fetchEnquiryData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete enquiry");
    }
  };

  const filtered = enquiryData.filter(
    (e) =>
      e.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Form Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {isEditing ? "Edit Enquiry" : "Submit Enquiry"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="productId"
            placeholder="Product ID"
            value={formData.productId}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
          />
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={formData.customerName}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full md:col-span-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
          />
          <textarea
            name="message"
            placeholder="Message"
            rows={3}
            value={formData.message}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full md:col-span-2"
          ></textarea>

          {isEditing && (
            <div className="col-span-1 md:col-span-2">
              <label className="block mb-1 font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded w-full"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="in_progress">In Progress</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full md:col-span-2 hover:bg-blue-700 transition"
          >
            {isEditing ? "Update Enquiry" : "Submit Enquiry"}
          </button>
        </form>
      </div>

      {/* Search Section */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by customer, product, email or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">S.No</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Customer</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Product</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Contact</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">City</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((e, idx) => (
                <tr key={e.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-2">
                    {(currentPage - 1) * itemsPerPage + idx + 1}
                  </td>
                  <td className="py-4 px-2">{e.customer_name}</td>
                  <td className="py-4 px-2">
                    {e.product_name} {e.product_model}
                  </td>
                  <td className="py-4 px-2">
                    {e.email}
                    <br />
                    {e.phone}
                  </td>
                  <td className="py-4 px-2">{e.city}</td>
                  <td className="py-4 px-2">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        e.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : e.status === "cancelled"
                          ? "bg-red-100 text-red-800"
                          : e.status === "in_progress"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>
                  <td className="py-4 px-2 flex gap-2">
                    <button
                      onClick={() => handleEdit(e)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center text-gray-500 py-4"
                >
                  No enquiries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentItems.length > 0 ? (
          currentItems.map((e, idx) => (
            <div
              key={e.id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <h2 className="font-semibold">{e.customer_name}</h2>
                <span className="text-sm text-gray-500">
                  #{(currentPage - 1) * itemsPerPage + idx + 1}
                </span>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Product</h3>
                <p>{e.product_name} {e.product_model}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Contact</h3>
                <p className="text-sm">{e.email}</p>
                <p className="text-sm">{e.phone}</p>
              </div>
              
              <div>
                <h3 className="font-medium text-sm text-gray-700">Location</h3>
                <p>{e.city}</p>
              </div>
              
              <div className="flex justify-between items-center">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    e.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : e.status === "cancelled"
                      ? "bg-red-100 text-red-800"
                      : e.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {e.status}
                </span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(e)}
                    className="p-2 border rounded text-green-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(e.id)}
                    className="p-2 border rounded text-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 py-4">
            No enquiries found.
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
  );
}