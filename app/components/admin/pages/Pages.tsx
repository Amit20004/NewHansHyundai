"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Eye, Edit, Trash, ChevronLeft, ChevronRight, Plus, X, Save } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// Dynamically import JoditEditor
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function PageManager() {
  const editorRefs = {}; // dynamic refs for each page content
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ slug: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 5;

  const config = useMemo(
    () => ({
      readonly: false,
      placeholder: "Start typing your content here...",
      height: 300,
      buttons: [
        "bold", "italic", "underline", "strikethrough", "|",
        "ul", "ol", "|",
        "outdent", "indent", "|",
        "font", "fontsize", "brush", "paragraph", "|",
        "align", "|",
        "link", "|",
        "undo", "redo", "|",
        "preview", "fullsize", "source"
      ],
      toolbarAdaptive: false,
      enableDragAndDropFileToEditor: true,
      uploader: { insertImageAsBase64URI: true }
    }),
    []
  );

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/all-pages");
      setPages(res.data.pages || []);
    } catch (err) {
      console.error("Error fetching pages:", err);
      toast.error("Failed to fetch pages");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ slug: item.slug, content: item.content || "" });
    setIsEditing(true);
    setPreviewMode(false);
    // editorRefs[item.slug] = useRef(null);
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure you want to delete this page?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/delete-content/${slug}`);
      toast.success("Page deleted successfully");
      if (editingItem && editingItem.slug === slug) {
        resetForm();
      }
      fetchPages();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete page");
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({ slug: "", content: "" });
    setIsEditing(false);
    setPreviewMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.slug || !formData.content) {
      toast.error("Please fill all fields");
      return;
    }

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(formData.slug)) {
      toast.error("Slug can only contain lowercase letters, numbers, and hyphens");
      return;
    }

    setIsLoading(true);
    try {
      if (editingItem) {
        await axios.put(`http://localhost:8000/api/update-content/${editingItem.slug}`, formData);
        toast.success("✅ Page updated!");
      } else {
        await axios.post("http://localhost:8000/api/save-content", formData);
        toast.success("✅ Page created!");
      }
      fetchPages();
      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error saving page");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPages = pages.filter((page) =>
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredPages.length / itemsPerPage);
  const currentItems = filteredPages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => setCurrentPage(1), [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 pt-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Page Management</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
          >
            <Plus size={18} /> Add New Page
          </button>
        ) : (
          <button
            onClick={resetForm}
            className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2.5 rounded-lg hover:bg-gray-700 transition-colors w-full sm:w-auto"
          >
            <X size={18} /> Cancel
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6 flex items-center p-3 bg-white border border-gray-300 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search pages by slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="ml-2 p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Pages Table */}
      {!isEditing && (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg mb-6">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left text-gray-700 uppercase">
              <tr>
                <th className="px-6 py-3 font-medium">Slug</th>
                <th className="px-6 py-3 font-medium">Preview</th>
                <th className="px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-mono">/{item.slug}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({ slug: item.slug, content: item.content });
                          setPreviewMode(!previewMode);
                          editorRefs[item.slug] = useRef(null);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 hover:underline gap-1"
                      >
                        <Eye className="h-4 w-4" /> Preview
                      </button>
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-green-600 hover:text-green-800 p-1 rounded-full hover:bg-green-100 transition-colors"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.slug)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-500">
                    {searchTerm ? "No matching pages found" : "No pages found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-md space-y-6 border">
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. about-us"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <JoditEditor
              ref={editorRefs[formData.slug] || null}
              value={formData.content}
              config={config}
              onBlur={(newContent) => setFormData({ ...formData, content: newContent })}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
              disabled={isLoading}
            >
              <Save className="h-5 w-5" /> {editingItem ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              <Eye className="h-5 w-5" /> {previewMode ? "Hide Preview" : "Show Preview"}
            </button>
          </div>

          {previewMode && formData.content && (
            <div className="mt-6 p-4 bg-gray-50 border rounded-lg shadow-inner">
              <h3 className="font-semibold mb-2 text-gray-700">Preview:</h3>
              <div dangerouslySetInnerHTML={{ __html: formData.content }} />
            </div>
          )}
        </form>
      )}

      {/* Pagination */}
      {!isEditing && totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 border rounded ${currentPage === idx + 1 ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded hover:bg-gray-100"
          >
            <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
