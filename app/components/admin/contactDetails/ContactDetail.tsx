"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({ name: "", message: "", rating: 5 });
  const [editingRecord, setEditingRecord] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/testimonials");
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      if(err)
        {
          console.error(err);
        }
      
      toast.error("Failed to fetch testimonials");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRecord) {
        const res = await axios.put(`http://localhost:8000/api/testimonials/${editingRecord.id}`, formData);
        if (res.data.success) {
          toast.success("Testimonial updated successfully");
          setEditingRecord(null);
          setFormData({ name: "", message: "", rating: 5 });
          fetchTestimonials();
        }
      } else {
        const res = await axios.post("http://localhost:8000/api/testimonials", formData);
        if (res.data.success) {
          toast.success("Testimonial added successfully");
          setFormData({ name: "", message: "", rating: 5 });
          fetchTestimonials();
        }
      }
    } catch (err) {
      if(err)
        {
          console.error(err);
        }
      toast.error("Failed to save testimonial");
    }
  };

  const handleEditClick = (record) => {
    setEditingRecord(record);
    setFormData({
      name: record.name || "",
      message: record.message || "",
      rating: record.rating || 5,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/testimonials/${id}`);
      if (res.data.success) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      }
    } catch (err) {
      if(err)
        {
          console.error(err);
        }
      toast.error("Failed to delete testimonial");
    }
  };

  // Pagination
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  const currentItems = testimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Form for Add/Edit */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">
          {editingRecord ? "Edit Testimonial" : "Add Testimonial"}
        </h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="number"
            name="rating"
            placeholder="Rating (1-5)"
            value={formData.rating}
            min={1}
            max={5}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <input
            type="text"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded w-full"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded col-span-1 md:col-span-3"
          >
            {editingRecord ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">ID</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Message</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Rating</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((t) => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">{t.id}</td>
                <td className="py-4 px-2">{t.name}</td>
                <td className="py-4 px-2">{t.message}</td>
                <td className="py-4 px-2">{t.rating}</td>
                <td className="py-4 px-2 flex gap-2">
                  <button
                    onClick={() => handleEditClick(t)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(t.id)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentItems.map((t) => (
          <div
            key={t.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
          >
            <div className="flex justify-between items-start">
              <h2 className="font-semibold">{t.name}</h2>
              <span>ID: {t.id}</span>
            </div>
            <p>{t.message}</p>
            <p>Rating: {t.rating}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEditClick(t)}
                className="p-2 border rounded text-green-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(t.id)}
                className="p-2 border rounded text-red-600"
              >
                <Trash className="h-4 w-4" />
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
  );
}
