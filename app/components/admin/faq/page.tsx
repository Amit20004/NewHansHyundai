"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, Plus, X } from "lucide-react";

export default function FAQDashboard() {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category: "", question: "", answer: "" });

  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/faq");
      setFaqs(res.data.data || []);
    } catch (err) {
      console.error("Error fetching FAQs:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/faq/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ category: "", question: "", answer: "" });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { category, question, answer } = formData;

    if (!category || !question || !answer) {
      alert("All fields are required!");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/faq/${editingId}`, formData);
        alert("✅ FAQ updated successfully!");
      } else {
        await axios.post("http://localhost:8000/api/faq", formData);
        alert("✅ FAQ added successfully!");
      }

      setIsFormOpen(false);
      resetForm();
      fetchFaqs();
      fetchCategories();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (faq) => {
    setEditingId(faq.id);
    setFormData({ category: faq.category, question: faq.question, answer: faq.answer });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      await axios.delete(`http://localhost:8000/api/faq/${id}`);
      alert("✅ FAQ deleted!");
      fetchFaqs();
      fetchCategories();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="relative top-20 px-4 sm:px-8 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">FAQ Management</h1>
        <button
          onClick={() => {
            setIsFormOpen(true);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      {/* Form Section */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border rounded-lg shadow p-5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">
              {editingId ? "Edit FAQ" : "Add New FAQ"}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              list="categories"
              required
            />
            <datalist id="categories">
              {categories.map((c, i) => (
                <option key={i} value={c} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question *</label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Answer *</label>
            <textarea
              name="answer"
              value={formData.answer}
              onChange={handleChange}
              rows="3"
              className="border px-3 py-2 rounded w-full"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                resetForm();
              }}
              className="px-4 py-2 border rounded text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700"
            >
              {editingId ? "Update" : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* Table */}
      <div className="bg-white border rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Question</th>
              <th className="py-3 px-4 text-left">Answer</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.length ? (
              faqs.map((faq) => (
                <tr key={faq.id} className="border-t">
                  <td className="py-3 px-4">{faq.category}</td>
                  <td className="py-3 px-4">{faq.question}</td>
                  <td className="py-3 px-4">{faq.answer}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-8 text-gray-500"
                >
                  No FAQs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
