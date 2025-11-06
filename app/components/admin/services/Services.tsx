// ContentManagement.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Eye,
  Edit,
  Trash,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function ContentManagement() {
  const [contentData, setContentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    slug: "",
    main_heading: "",
    main_content: "",
    main_image: null,
    product_image: null,
    product_content: "",
  });

  // Jodit editor config
  // const editorConfig = {
  //   readonly: false,
  //   height: 300,
  //   toolbarAdaptive: false,
  //   toolbarButtonSize: "medium",
  //   buttons: [
  //     "bold",
  //     "italic",
  //     "underline",
  //     "strikethrough",
  //     "|",
  //     "ul",
  //     "ol",
  //     "|",
  //     "outdent",
  //     "indent",
  //     "|",
  //     "font",
  //     "fontsize",
  //     "brush",
  //     "|",
  //     "align",
  //     "|",
  //     "link",
  //     "|",
  //     "undo",
  //     "redo",
  //     "|",
  //     "preview",
  //     "print",
  //   ],
  // };

  useEffect(() => {
    fetchContentData();
  }, []);

  const fetchContentData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/fetch-service");
      if (res.data.success) {
        setContentData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching content data:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();

      // Append all form data to the payload
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          payload.append(key, value);
        }
      });

      if (isEditing) {
        await axios.put(
          `http://localhost:8000/api/put-service/${formData.id}`,
          payload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/post-service", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Created successfully");
      }

      fetchContentData();
      setIsFormOpen(false);
      setIsEditing(false);
      resetForm();
    } catch (err) {
      console.error("Error saving content:", err);
      alert("Error saving content: " + err.message);
    }
  };

  const handleEdit = (content) => {
    setIsEditing(true);
    setFormData({
      ...content,
      main_image: null, // keep file null until changed
      product_image: null, // keep file null until changed
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/delete-service/${id}`);
      fetchContentData();
      alert("Deleted successfully");
    } catch (err) {
      console.error("Error deleting content:", err);
      alert("Error deleting content: " + err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      slug: "",
      main_heading: "",
      main_content: "",
      main_image: null,
      product_image: null,
      product_content: "",
    });
  };

  const filteredContent = contentData
    .filter((item) => {
      const matchesSearch =
        item.main_heading?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.slug?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const currentItems = filteredContent.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Filters + Add button */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <button
          onClick={() => {
            setIsFormOpen(true);
            setIsEditing(false);
            resetForm();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Add Content
        </button>
      </div>

      {/* Content Form (Add/Edit) */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-5 bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-3"
        >
          <h2 className="font-semibold text-lg">
            {isEditing ? "Edit Content" : "Add New Content"}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slug */}
            <div className="flex flex-col">
              <label
                htmlFor="slug"
                className="text-sm font-medium text-gray-700"
              >
                Slug (URL Identifier) *
              </label>
              <input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="e.g. wheel-alignment-service"
                className="border px-3 py-2 rounded text-sm"
                required
              />
            </div>

            {/* Main Heading */}
            <div className="flex flex-col">
              <label
                htmlFor="main_heading"
                className="text-sm font-medium text-gray-700"
              >
                Main Heading *
              </label>
              <input
                id="main_heading"
                name="main_heading"
                value={formData.main_heading}
                onChange={handleInputChange}
                placeholder="Enter main heading"
                className="border px-3 py-2 rounded text-sm"
                required
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-col">
            <label
              htmlFor="main_content"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Main Content
            </label>
            <div className="bg-white border rounded-lg shadow-sm p-2">
              <JoditEditor
                value={formData.main_content}
                config={{
                  readonly: false,
                  placeholder: "Start typing main content...",
                  height: 300,
                }}
                onBlur={(newContent) =>
                  handleEditorChange("main_content", newContent)
                }
              />
            </div>
          </div>

          {/* Product Content */}
          <div className="flex flex-col">
            <label
              htmlFor="product_content"
              className="text-sm font-medium text-gray-700 mb-2"
            >
              Product Content
            </label>
            <div className="bg-white border rounded-lg shadow-sm p-2">
              <JoditEditor
                value={formData.product_content}
                config={{
                  readonly: false,
                  placeholder: "Start typing product content...",
                  height: 300,
                }}
                onBlur={(newContent) =>
                  handleEditorChange("product_content", newContent)
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="flex flex-col">
              <label
                htmlFor="main_image"
                className="text-sm font-medium text-gray-700"
              >
                Main Image{" "}
                {isEditing &&
                  formData.main_image &&
                  typeof formData.main_image === "string" && (
                    <span className="text-xs text-gray-500">
                      (Current: {formData.main_image})
                    </span>
                  )}
              </label>
              <input
                id="main_image"
                type="file"
                name="main_image"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
                accept="image/*"
              />
            </div>

            {/* Product Image */}
            <div className="flex flex-col">
              <label
                htmlFor="product_image"
                className="text-sm font-medium text-gray-700"
              >
                Product Image{" "}
                {isEditing &&
                  formData.product_image &&
                  typeof formData.product_image === "string" && (
                    <span className="text-xs text-gray-500">
                      (Current: {formData.product_image})
                    </span>
                  )}
              </label>
              <input
                id="product_image"
                type="file"
                name="product_image"
                onChange={handleFileChange}
                className="border px-3 py-2 rounded text-sm"
                accept="image/*"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              {isEditing ? "Update Content" : "Add Content"}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsFormOpen(false);
                setIsEditing(false);
                resetForm();
              }}
              className="px-4 py-2 bg-gray-300 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Slug
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Main Heading
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Created
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Updated
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-2">
                  <div className="font-medium">{item.slug}</div>
                </td>
                <td className="py-4 px-2">{item.main_heading}</td>
                <td className="py-4 px-2">
                  <div className="text-xs text-gray-500">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="text-xs text-gray-500">
                    {item.updated_at
                      ? new Date(item.updated_at).toLocaleDateString()
                      : "Never"}
                  </div>
                </td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <a
                      href={`/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 text-blue-600" />
                    </a>
                    <button
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card layout */}
      <div className="md:hidden mt-5 space-y-4">
        {currentItems.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{item.slug}</h2>
            </div>
            <p className="text-sm text-gray-600">{item.main_heading}</p>
            <p className="text-xs text-gray-500">
              Created: {new Date(item.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500">
              Updated:{" "}
              {item.updated_at
                ? new Date(item.updated_at).toLocaleDateString()
                : "Never"}
            </p>
            <div className="flex gap-2 pt-2">
              <a
                href={`/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <Eye className="h-4 w-4 text-blue-600" />
              </a>
              <button
                onClick={() => handleEdit(item)}
                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
              >
                <Edit className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center"
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
