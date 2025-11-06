"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { Edit, Trash, Save, X, Eye } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function AboutUsAdmin() {
  const editorRefs = {
    p1: useRef(null),
    p2: useRef(null),
    p3: useRef(null),
    p4: useRef(null),
  };

  const [aboutData, setAboutData] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    page_heading: "",
    p1: "",
    p2: "",
    p3: "",
    p4: "",
    img1: null,
    img2: null,
    img1Preview: null,
    img2Preview: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 200,
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
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing your content here..."
    }),
    []
  );

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/about-us");
      if (res.data.success) {
        const baseURL = "http://localhost:8000/";
        const img1Path = res.data.data.img1 ? `${baseURL}${res.data.data.img1}` : null;
        const img2Path = res.data.data.img2 ? `${baseURL}${res.data.data.img2}` : null;

        setAboutData({ ...res.data.data, img1: img1Path, img2: img2Path });

        setFormData({
          company_name: res.data.data.company_name || "",
          page_heading: res.data.data.page_heading || "",
          p1: res.data.data.p1 || "",
          p2: res.data.data.p2 || "",
          p3: res.data.data.p3 || "",
          p4: res.data.data.p4 || "",
          img1: null,
          img2: null,
          img1Preview: img1Path,
          img2Preview: img2Path,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching about data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: content }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
        [`${fieldName}Preview`]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "img1Preview" && key !== "img2Preview" && value !== null) {
          if (key === "img1" || key === "img2") {
            if (value instanceof File) payload.append(key, value);
          } else {
            payload.append(key, value);
          }
        }
      });

      if (aboutData) {
        await axios.put(`http://localhost:8000/api/about-us/${aboutData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("About content updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/about-us", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("About content created successfully");
      }

      fetchAboutData();
      setIsEditing(false);
      setPreviewMode(false);
    } catch (err) {
      console.error("Error saving about content:", err);
      toast.error("Error saving content: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete the about content?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/about-us/${aboutData.id}`);
      setAboutData(null);
      setFormData({
        company_name: "",
        page_heading: "",
        p1: "",
        p2: "",
        p3: "",
        p4: "",
        img1: null,
        img2: null,
        img1Preview: null,
        img2Preview: null,
      });
      toast.success("About content deleted successfully");
    } catch (err) {
      console.error("Error deleting about content:", err);
      toast.error("Error deleting content: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 max-w-5xl">
      <Toaster position="top-right" />

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          About Us Management
        </h1>
        <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
          {aboutData && !isEditing && (
            <>
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
              >
                <Eye className="h-4 w-4" /> {previewMode ? "Hide Preview" : "Show Preview"}
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
              >
                <Trash className="h-4 w-4" /> Delete
              </button>
            </>
          )}
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            >
              <Edit className="h-4 w-4" /> {aboutData ? "Edit" : "Create"} Content
            </button>
          ) : (
            <button
              onClick={() => {
                setIsEditing(false);
                setPreviewMode(false);
                if (aboutData) {
                  setFormData({
                    company_name: aboutData.company_name || "",
                    page_heading: aboutData.page_heading || "",
                    p1: aboutData.p1 || "",
                    p2: aboutData.p2 || "",
                    p3: aboutData.p3 || "",
                    p4: aboutData.p4 || "",
                    img1: null,
                    img2: null,
                    img1Preview: aboutData.img1 || null,
                    img2Preview: aboutData.img2 || null,
                  });
                }
              }}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              <X className="h-4 w-4" /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      {previewMode && aboutData && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 border">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Preview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <Image
              width={100} height={100} quality={100} unoptimized={true}
                src={aboutData.img1 || "/placeholder-image.jpg"}
                alt="About Us"
                className="w-full h-auto object-cover rounded-lg"
              />
              <span className="text-xs sm:text-sm text-gray-500 tracking-widest uppercase mt-2 block">
                {aboutData.company_name}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mt-1">{aboutData.page_heading}</h2>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Image
              width={100} height={100} quality={100} unoptimized={true}
                src={aboutData.img2 || aboutData.img1 || "/placeholder-image.jpg"}
                alt="About Us"
                className="w-full h-auto object-cover rounded-lg"
              />
              <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-4">
                {["p1", "p2", "p3", "p4"].map(
                  (field) =>
                    aboutData[field] && <div key={field} dangerouslySetInnerHTML={{ __html: aboutData[field] }} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-6 border">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Page Heading</label>
              <input
                type="text"
                name="page_heading"
                value={formData.page_heading}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Image Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["img1", "img2"].map((imgField) => (
              <div key={imgField}>
                <label className="block text-sm font-medium mb-1">Image {imgField === "img1" ? "1" : "2"}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, imgField)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {formData[`${imgField}Preview`] && (
                  <div className="mt-2">
                    <Image
                    width={100} height={100} quality={100} unoptimized={true}
                      src={formData[`${imgField}Preview`]}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Paragraph Editors */}
          {["p1", "p2", "p3", "p4"].map((field, idx) => (
            <div key={field} className="border rounded p-3 bg-gray-50">
              <label className="block text-sm font-medium mb-1">Paragraph {idx + 1}</label>
              <JoditEditor
                ref={editorRefs[field]}
                value={formData[field]}
                config={config}
                onBlur={(content) => handleEditorChange(content, field)}
              />
            </div>
          ))}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              <Save className="h-5 w-5" /> Save
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
            >
              <Eye className="h-5 w-5" /> {previewMode ? "Hide Preview" : "Show Preview"}
            </button>
          </div>
        </form>
      )}

      {/* View Mode */}
      {!isEditing && aboutData && (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-1 text-gray-700">Company Name:</h3>
                <p className="text-gray-900 text-sm">{aboutData.company_name}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-gray-700">Page Heading:</h3>
                <p className="text-gray-900 text-sm">{aboutData.page_heading}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aboutData.img1 && (
                <Image
                width={100} height={100} quality={100} unoptimized={true}
                  src={aboutData.img1}
                  alt="About 1"
                  className="w-full h-40 sm:h-48 object-cover rounded border"
                />
              )}
              {aboutData.img2 && (
                <Image
                width={100} height={100} quality={100} unoptimized={true}
                  src={aboutData.img2}
                  alt="About 2"
                  className="w-full h-40 sm:h-48 object-cover rounded border"
                />
              )}
            </div>

            {["p1", "p2", "p3", "p4"].map(
              (field, idx) =>
                aboutData[field] && (
                  <div key={field} className="border rounded p-3 bg-gray-50">
                    <h3 className="font-semibold mb-2 text-gray-700 text-sm">Paragraph {idx + 1}:</h3>
                    <div className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: aboutData[field] }} />
                  </div>
                )
            )}
          </div>
        </div>
      )}

      {!isEditing && !aboutData && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-base sm:text-lg">No about content found.</p>
          <p className="mt-1 text-sm">Click &quot;Create Content&quot; to get started.</p>
        </div>
      )}
    </div>
  );
}
