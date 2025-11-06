"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, ChevronLeft, ChevronRight, Search, Filter } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  // Form state
  const [formData, setFormData] = useState({
    person_name: "",
    message: "",
    ratings: 5,
    person_image: null,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/testimonials");
      if (res.data.success) setTestimonials(res.data.data);
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      toast.error("Failed to fetch testimonials");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("person_name", formData.person_name);
    formDataToSend.append("message", formData.message);
    formDataToSend.append("ratings", formData.ratings);
    if (formData.person_image)
      formDataToSend.append("person_image", formData.person_image);

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/testimonials/${editingId}`,
          formDataToSend,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("Testimonial updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/testimonials", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Testimonial added successfully");
      }
      fetchTestimonials();
      setFormData({ person_name: "", message: "", ratings: 5, person_image: null });
      setEditingId(null);
    } catch (err) {
      console.error("Error saving testimonial:", err);
      toast.error("Failed to save testimonial");
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setFormData({
      person_name: t.person_name || "",
      message: t.message || "",
      ratings: t.ratings || 5,
      person_image: null,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const res = await axios.delete(`http://localhost:8000/api/testimonials/${id}`);
      if (res.data.success) {
        fetchTestimonials();
        toast.success("Testimonial deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      toast.error("Failed to delete testimonial");
    }
  };

  // Filtering & Sorting
  const filteredTestimonials = testimonials
    .filter(
      (t) =>
        t.person_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortBy === "newest" ? dateB - dateA : dateA - dateB;
    });

  const totalPages = Math.ceil(filteredTestimonials.length / itemsPerPage);
  const currentItems = filteredTestimonials.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-10 px-4">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        {/* Header with Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Testimonials</h1>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search testimonials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center"
              >
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </button>
              
              {showFilters && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10 p-2">
                  <div className="text-sm font-medium mb-2">Sort by</div>
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "newest"}
                      onChange={() => setSortBy("newest")}
                      className="rounded-full"
                    />
                    <span>Newest First</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "oldest"}
                      onChange={() => setSortBy("oldest")}
                      className="rounded-full"
                    />
                    <span>Oldest First</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-center mb-4">
            {editingId ? "Edit Testimonial" : "Add New Testimonial"}
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="person_name"
              placeholder="Name"
              value={formData.person_name}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded-md text-sm w-full focus:ring-2 focus:ring-blue-500"
              rows="3"
              required
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rating:</span>
              <input
                type="number"
                name="ratings"
                value={formData.ratings}
                min={1}
                max={5}
                onChange={handleInputChange}
                className="border px-3 py-2 rounded-md text-sm w-16 focus:ring-2 focus:ring-blue-500"
                required
              />
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">
                    {i < formData.ratings ? '★' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                type="file"
                name="person_image"
                accept="image/*"
                className="text-sm w-full"
                onChange={(e) =>
                  setFormData({ ...formData, person_image: e.target.files[0] })
                }
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full sm:w-32 transition-colors"
              >
                {editingId ? "Update" : "Add"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ person_name: "", message: "", ratings: 5, person_image: null });
                  }}
                  className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg w-full sm:w-32 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Message</th>
                <th className="p-3 text-left">Rating</th>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((t) => (
                <tr key={t.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{t.id}</td>
                  <td className="p-3 font-medium">{t.person_name}</td>
                  <td className="p-3 max-w-[250px] truncate">{t.message}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">★</span>
                      <span>{t.ratings}/5</span>
                    </div>
                  </td>
                  <td className="p-3">
                    {t.person_image && (
                      <Image
                      width={100} height={100} quality={100} unoptimized={true}
                        src={`http://localhost:8000/${t.person_image}`}
                        alt="testimonial"
                        className="w-14 h-14 rounded object-cover"
                      />
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-2 border rounded text-green-600 hover:bg-green-50 transition-colors"
                        aria-label="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="p-2 border rounded text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((t) => (
              <div
                key={t.id}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h2 className="font-semibold text-lg">{t.person_name}</h2>
                    <span className="text-xs text-gray-500">ID #{t.id}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                    <span className="text-yellow-500">★</span>
                    <span>{t.ratings}/5</span>
                  </div>
                </div>

                {t.person_image && (
                  <div className="flex justify-center my-3">
                    <Image
                     width={100} height={100} quality={100} unoptimized={true}
                      src={`http://localhost:8000/${t.person_image}`}
                      alt="testimonial"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                )}

                <p className="text-gray-700 mb-4 text-center">{t.message}</p>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button 
                    onClick={() => handleEdit(t)} 
                    className="flex items-center gap-1 px-3 py-1 border rounded text-green-600 text-sm hover:bg-green-50 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(t.id)} 
                    className="flex items-center gap-1 px-3 py-1 border rounded text-red-600 text-sm hover:bg-red-50 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-200">
              <div className="text-gray-500 mb-2">No testimonials found</div>
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 text-sm hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 text-sm hover:bg-gray-50 transition-colors"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}