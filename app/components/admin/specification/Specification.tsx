"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { Edit, Trash, Plus, Upload, X, ChevronLeft, ChevronRight } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import dynamic from "next/dynamic"
import Image from "next/image"

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
  loading: () => <div className="h-40 border rounded bg-gray-100 flex items-center justify-center">Loading editor...</div>
})

export default function CarSafetyAdmin() {
  const [items, setItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    car_name: ""
  })
  const [image, setImage] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Jodit Editor reference and local content state
  const editor = useRef(null)
  const [editorContent, setEditorContent] = useState("")

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-specifications")
      if (res.data && res.data.success) {
        setItems(res.data.data || [])
      } else if (res.data && Array.isArray(res.data)) {
        // in case your API returns array directly
        setItems(res.data)
      } else {
        setItems([])
      }
    } catch (err) {
      console.error(err)
      toast.error("Failed to fetch car safety items")
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // Update editorContent and form only on blur (user finished editing)
  const handleEditorChange = (content) => {
    const safeContent = content == null ? "" : content
    setEditorContent(safeContent)
    setForm(prev => ({ ...prev, description: safeContent }))
  }

  const handleImageUpload = (e) => {
    setImage(e.target.files[0] || null)
  }

  const removeImage = () => setImage(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!form.title || !form.category || !form.description || !form.car_name) {
      toast.error("Please fill all fields")
      setIsLoading(false)
      return
    }

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        // ensure non-null values appended as strings
        formData.append(key, value == null ? "" : value)
      })
      if (image) formData.append("image", image)

      if (editingId) {
        await axios.put(`http://localhost:8000/api/car-specifications/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/car-specifications", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        toast.success("Created successfully")
      }

      await fetchItems()
      resetForm()
    } catch (err) {
      console.error(err)
      toast.error(err?.response?.data?.message || "Failed to save")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || "",
      category: item.category || "",
      description: item.description || "",
      car_name: item.car_name || ""
    })
    setEditorContent(item.description || "")
    setImage(null)
    setShowForm(true)
    // keep cursor and focus behavior native to Jodit; do not force focus here
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return
    try {
      await axios.delete(`http://localhost:8000/api/car-specifications/${id}`)
      toast.success("Deleted successfully")
      fetchItems()
    } catch (err) {
      console.error(err)
      toast.error("Failed to delete")
    }
  }

  const resetForm = () => {
    setForm({ title: "", category: "", description: "", car_name: "" })
    setEditorContent("")
    setImage(null)
    setEditingId(null)
    setShowForm(false)
  }

  // Safely return HTML for dangerouslySetInnerHTML
  const renderHTML = (html) => {
    return { __html: html || "" }
  }

  // Filtering
  const filteredItems = items.filter((item) => {
    const term = searchTerm.trim().toLowerCase()
    if (!term) return true
    const title = (item.title || "").toLowerCase()
    const category = (item.category || "").toLowerCase()
    const carName = (item.car_name || "").toLowerCase()
    return title.includes(term) || category.includes(term) || carName.includes(term)
  })

  // Sorting
  const sortedItems = filteredItems.slice().sort((a, b) => {
    const dateA = new Date(a.created_at || 0)
    const dateB = new Date(b.created_at || 0)
    if (sortBy === "newest") return dateB - dateA
    if (sortBy === "oldest") return dateA - dateB
    // name sort fallback
    return (a.car_name || "").localeCompare(b.car_name || "")
  })

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / itemsPerPage))
  const currentItems = sortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Editor config - keep autofocus false and avoid forcing re-renders
  const editorConfig = {
    readonly: false,
    height: 400,
    toolbarAdaptive: false,
    toolbarSticky: true,
    enableDragAndDropFileToEditor: true,
    uploader: { insertImageAsBase64URI: true },
    saveSelectionOnBlur: true,
    autofocus: false,
    buttons: [
      'source', 'code', '|',
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', '|',
      'align', '|',
      'table', '|',
      'link', '|',
      'image', '|',
      'undo', 'redo', '|',
      'preview', 'print', 'fullsize'
    ],
    showXPathInStatusbar: true,
    showCharsCounter: true,
    showWordsCounter: true,
    table: {
      insertTable: true,
      addColumnLeft: true,
      addColumnRight: true,
      deleteColumn: true,
      addRowAbove: true,
      addRowBelow: true,
      deleteRow: true,
      mergeCells: true,
      splitCell: true,
      tableProperties: true,
      cellProperties: true
    }
  }

  // Helper to open modal safe (no external libs)
  const openDescriptionModal = (item) => {
    const modal = document.createElement("div")
    modal.className = "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-lg max-w-4xl max-h-[80vh] overflow-auto">
        <h3 class="text-lg font-bold mb-4">${(item.title || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")} - Full Description</h3>
        <div class="prose max-w-none">${item.description || ""}</div>
        <div class="mt-4 flex justify-end">
          <button class="close-modal px-4 py-2 bg-blue-600 text-white rounded">Close</button>
        </div>
      </div>
    `
    modal.querySelector(".close-modal").onclick = () => modal.remove()
    document.body.appendChild(modal)
  }

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Car Safety & Security</h1>
        <button
          onClick={() => setShowForm(prev => !prev)}
          className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <Plus size={18} />
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">{editingId ? "Edit Item" : "Add New Item"}</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Car Name</label>
                <input
                  type="text"
                  name="car_name"
                  value={form.car_name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 bg-gray-100 px-3 py-2 rounded cursor-pointer text-sm">
                    <Upload size={16} />
                    {image ? image.name : "Choose Image"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {image && (
                    <button type="button" onClick={removeImage} className="text-red-600">
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description (Rich Text Editor)</label>
              <div className="border rounded overflow-hidden">
                <JoditEditor
                  ref={editor}
                  value={editorContent}
                  config={editorConfig}
                  onBlur={(newContent) => handleEditorChange(newContent)}
                  onChange={() => { /* disabled to avoid live updates that cause cursor jumps */ }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use "Source" to edit HTML directly, or the table button to insert tables.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isLoading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by title, category or car name..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value)
            setCurrentPage(1)
          }}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name">Car Name (A-Z)</option>
        </select>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2">ID</th>
              <th className="text-left py-3 px-2">Image</th>
              <th className="text-left py-3 px-2">Title</th>
              <th className="text-left py-3 px-2">Category</th>
              <th className="text-left py-3 px-2">Description Preview</th>
              <th className="text-left py-3 px-2">Car Name</th>
              <th className="text-left py-3 px-2">Created</th>
              <th className="text-left py-3 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 align-top">{item.id}</td>
                  <td className="py-3 px-2">
                    {item.image ? (
                      <Image
                        width={100}
                        height={100}
                        quality={100}
                        unoptimized={true}
                        src={`http://localhost:8000/${item.image}`}
                        className="h-14 w-20 object-cover rounded mx-auto"
                        alt={item.title || "image"}
                      />
                    ) : (
                      <div className="h-14 w-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                        No Image
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-2 font-medium align-top">{item.title}</td>
                  <td className="py-3 px-2 align-top">{item.category}</td>
                  <td className="py-3 px-2 max-w-[200px] align-top">
                    <div
                      className="max-h-20 overflow-y-auto border rounded p-2 bg-gray-50"
                      dangerouslySetInnerHTML={renderHTML(((item.description || "").substring(0, 200)) + ((item.description || "").length > 200 ? "..." : ""))}
                    />
                    <button
                      onClick={() => openDescriptionModal(item)}
                      className="text-blue-600 text-xs mt-1 hover:underline"
                    >
                      View Full
                    </button>
                  </td>
                  <td className="py-3 px-2 align-top">{item.car_name}</td>
                  <td className="py-3 px-2 align-top">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-3 px-2 flex gap-2 align-top">
                    <button onClick={() => handleEdit(item)} className="border rounded p-1 hover:bg-green-50">
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="border rounded p-1 hover:bg-red-50">
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-8 text-center text-gray-500">
                  No items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="flex flex-col items-center gap-4 mt-5 md:hidden">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.id} className="bg-white w-[90%] max-w-md border border-gray-200 rounded-xl shadow-md p-4">
              {item.image ? (
                <Image
                  width={100}
                  height={100}
                  quality={100}
                  unoptimized={true}
                  src={`http://localhost:8000/${item.image}`}
                  className="h-32 w-full object-cover rounded-md mb-3"
                  alt={item.title || "image"}
                />
              ) : (
                <div className="h-32 w-full bg-gray-200 rounded-md mb-3 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
              <h2 className="font-semibold text-lg">{item.title}</h2>
              <p className="text-gray-600 text-sm">{item.category}</p>
              <div
                className="text-gray-500 text-sm line-clamp-3 border rounded p-2 bg-gray-50 my-2"
                dangerouslySetInnerHTML={renderHTML(((item.description || "").substring(0, 150)) + ((item.description || "").length > 150 ? "..." : ""))}
              />
              <p className="text-gray-700 font-medium">{item.car_name}</p>
              <div className="flex justify-center gap-3 mt-3">
                <button onClick={() => handleEdit(item)} className="border rounded p-2 hover:bg-green-50">
                  <Edit className="h-4 w-4 text-green-600" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="border rounded p-2 hover:bg-red-50">
                  <Trash className="h-4 w-4 text-red-600" />
                </button>
                <button onClick={() => openDescriptionModal(item)} className="border rounded p-2 hover:bg-gray-100 text-xs">
                  View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No items found.</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="p-2 border rounded disabled:opacity-50 hover:bg-gray-50"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}