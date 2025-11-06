"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function MetaAdmin() {
  const [metadata, setmetadata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    id: null,
    slug: "",
    title: "",
    description: "",
    keywords: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMeta();
  }, []);

  const fetchMeta = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fetch-metadata");
      if (res.data.success) {
        setmetadata(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching meta data:", err);
      toast.error("Failed to fetch meta data");
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
          `http://localhost:8000/api/metadata/${formData.id}`,
          formData
        );
        toast.success("Meta data updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/metadata", formData);
        toast.success("Meta data added successfully");
      }
      setFormData({ id: null, slug: "", title: "", description: "", keywords: "" });
      setIsEditing(false);
      fetchMeta();
    } catch (err) {
      console.error(err);
      toast.error("Error saving meta data");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      id: item.id,
      slug: item.slug,
      title: item.title,
      description: item.description,
      keywords: item.keywords,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this meta data?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/metadata/${id}`);
      toast.success("Meta data deleted successfully");
      fetchMeta();
    } catch (err) {
      console.error(err);
      toast.error("Error deleting meta data");
    }
  };

  // Filter
  const filteredData = metadata.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      m.slug?.toLowerCase().includes(term) ||
      m.title?.toLowerCase().includes(term) ||
      m.keywords?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredData.length / perPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Add/Edit Form */}
      <div className="bg-white p-6 shadow mb-6">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? "Edit Meta Data" : "Add Meta Data"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="slug"
            placeholder="Slug"
            value={formData.slug}
            onChange={handleInputChange}
            className="border px-3 py-2"
            required
          />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border px-3 py-2"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border px-3 py-2 col-span-1 md:col-span-2"
          />
          <input
            type="text"
            name="keywords"
            placeholder="Keywords"
            value={formData.keywords}
            onChange={handleInputChange}
            className="border px-3 py-2 col-span-1 md:col-span-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 col-span-1 md:col-span-2"
          >
            {isEditing ? "Update Meta" : "Add Meta"}
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 shadow-sm mb-5">
        <input
          type="text"
          placeholder="Search meta data..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 w-full sm:w-64 text-sm"
        />
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">S.No.</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Slug</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Title</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Keywords</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  {(currentPage - 1) * perPage + index + 1}
                </td>
                <td className="py-4 px-2">{item.slug}</td>
                <td className="py-4 px-2">{item.title}</td>
                <td className="py-4 px-2">{item.description}</td>
                <td className="py-4 px-2">{item.keywords}</td>
                <td className="py-4 px-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
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
        {currentData.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-sm border border-gray-200 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{item.title}</h2>
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800">
                {item.slug}
              </span>
            </div>
            <p className="text-sm text-gray-600">{item.description}</p>
            <p className="text-xs text-gray-500">Keywords: {item.keywords}</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(item)}
                className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
              >
                <Edit className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
              >
                <Trash className="h-4 w-4 text-red-600" />
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
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 disabled:opacity-50 text-xs sm:text-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
