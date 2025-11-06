"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, Plus, X, Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function CarAccessoryDashboard() {
  const [accessories, setAccessories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All Categories");
  const [filterAvailability, setFilterAvailability] = useState("All");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    category: "",
    price: "",
    description: "",
    availability: "",
    imageFile: null,
  });

  useEffect(() => {
    fetchAccessories();
  }, []);

  const fetchAccessories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-accessories");
      setAccessories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching accessories:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      setFormData({ ...formData, imageFile: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      model: "",
      category: "",
      price: "",
      description: "",
      availability: "",
      imageFile: null,
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.model) {
      alert("Name and Model are required!");
      return;
    }

    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) payload.append(key, value);
    });

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:8000/api/admin/car-accessories/${editingId}`,
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Updated successfully!");
      } else {
        await axios.post(
          "http://localhost:8000/api/admin/car-accessories",
          payload,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        alert("✅ Added successfully!");
      }
      setIsFormOpen(false);
      resetForm();
      fetchAccessories();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      model: item.model,
      category: item.category,
      price: item.price,
      description: item.description,
      availability: item.availability,
      imageFile: null,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this accessory?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/admin/car-accessories/${id}`);
      alert("✅ Deleted successfully!");
      fetchAccessories();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  const filteredAccessories = accessories
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All Categories" || item.category === filterCategory;
      const matchesAvailability = filterAvailability === "All" || item.availability === filterAvailability;
      return matchesSearch && matchesCategory && matchesAvailability;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredAccessories.length / itemsPerPage);
  const currentItems = filteredAccessories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = [...new Set(accessories.map((a) => a.category).filter(Boolean))];

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto space-y-6">
      {/* Filters + Add Button */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border pl-10 pr-3 py-2 rounded w-full sm:w-64 text-sm"
            />
          </div>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option>All Categories</option>
            {categories.map((c, i) => (
              <option key={i}>{c}</option>
            ))}
          </select>

          <select
            value={filterAvailability}
            onChange={(e) => setFilterAvailability(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option>All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>

        <button
          onClick={() => {
            setIsFormOpen(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Accessory
        </button>
      </div>

      {/* Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 bg-white border border-gray-200 rounded-lg shadow-sm p-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2 flex justify-between items-center">
            <h2 className="font-semibold text-lg">{editingId ? "Edit Accessory" : "Add New Accessory"}</h2>
            <button type="button" onClick={() => setIsFormOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium">Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Model *</label>
            <input type="text" name="model" value={formData.model} onChange={handleChange} className="border px-3 py-2 rounded w-full" required />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <input type="text" name="category" value={formData.category} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Availability</label>
            <select name="availability" value={formData.availability} onChange={handleChange} className="border px-3 py-2 rounded w-full">
              <option value="">Select availability</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="border px-3 py-2 rounded w-full" />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm font-medium">Image</label>
            <input type="file" name="imageFile" accept="image/*" onChange={handleChange} className="border px-3 py-2 rounded w-full" />
            {formData.imageFile && (
              <img src={URL.createObjectURL(formData.imageFile)} alt="Preview" className="h-32 object-contain mt-2 rounded" />
            )}
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 mt-4">
            <button type="button" onClick={() => { setIsFormOpen(false); resetForm(); }} className="px-4 py-2 border rounded text-sm">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700">
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Desktop Table */}
      <div className="hidden md:block bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Name</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Model</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Category</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Price</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Description</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Availability</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Image</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? currentItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">{item.name}</td>
                <td className="py-4 px-2">{item.model}</td>
                <td className="py-4 px-2">{item.category}</td>
                <td className="py-4 px-2">{item.price}</td>
                <td className="py-4 px-2 max-w-xs truncate">{item.description}</td>
                <td className="py-4 px-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${item.availability === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                    {item.availability}
                  </span>
                </td>
                <td className="py-4 px-2">{item.image_url ? <img src={item.image_url} alt="Accessory" className="w-16 h-16 object-cover rounded" /> : "No image"}</td>
                <td className="py-4 px-2 flex gap-2">
                  <button onClick={() => handleEdit(item)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="py-8 px-4 text-center text-gray-500">No accessories found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Table */}
      <div className="md:hidden bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Name</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Model</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Category</th>
              <th className="py-3 px-2 text-left font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length ? currentItems.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">{item.name}</td>
                <td className="py-4 px-2">{item.model}</td>
                <td className="py-4 px-2">{item.category}</td>
                <td className="py-4 px-2 flex gap-2">
                  <button onClick={() => handleEdit(item)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="py-8 px-4 text-center text-gray-500">No accessories found</td>
              </tr>
            )}
          </tbody>
        </table>
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
          <span className="text-xs sm:text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
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