"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import axios from "axios"
import { Edit, Trash, Plus, Save, X, ChevronDown, ChevronUp } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

export default function DocumentationAdmin() {
  const [documentationData, setDocumentationData] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expandedRows, setExpandedRows] = useState({})

  const editorRefs = useRef({})

  const [formData, setFormData] = useState({
    heading: "",
    // login_ht_cider: "",
    item: "",
    // group_key: "",
    page_heading: "",
    page_paragraph: "",
  })

  const config = useMemo(
    () => ({
      readonly: false,
      height: 200,
      buttons: [
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "outdent",
        "indent",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "align",
        "|",
        "link",
        "|",
        "undo",
        "redo",
        "|",
        "preview",
        "fullsize",
        "source", // add 'source' here
      ],
      toolbarAdaptive: false,
      enableDragAndDropFileToEditor: true,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing your content here...",
    }),
    [],
  )

  useEffect(() => {
    fetchDocumentationData()
  }, [])

  const fetchDocumentationData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/documentation")
      if (res.data.success) {
        setDocumentationData(res.data.data)
      }
      setLoading(false)
    } catch (err) {
      console.error("Error fetching documentation data:", err)
      setError(err.message)
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEditorChange = (content, fieldName) => {
    setFormData((prev) => ({ ...prev, [fieldName]: content }))
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setIsCreating(false)
    setFormData({
      heading: item.heading || "",
      login_ht_cider: item.login_ht_cider || "",
      item: item.item || "",
      group_key: item.group_key || "",
      page_number: item.page_number || "",
      page_partgraph: item.page_partgraph || "",
    })
  }

  const handleCreate = () => {
    setIsCreating(true)
    setEditingId(null)
    setFormData({
      heading: "",
      // login_ht_cider: "",
      item: "",
      // group_key: "",
      page_heading: "",
      page_paragraph: "",
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setIsCreating(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Update existing
        await axios.put(`http://localhost:8000/api/documentation/${editingId}`, formData)
        alert("Documentation item updated successfully")
      } else if (isCreating) {
        // Create new
        await axios.post("http://localhost:8000/api/documentation", formData)
        alert("Documentation item created successfully")
      }

      fetchDocumentationData()
      setEditingId(null)
      setIsCreating(false)
    } catch (err) {
      console.error("Error saving documentation item:", err)
      alert("Error saving content: " + (err.response?.data?.message || err.message))
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this documentation item?")) return
    try {
      await axios.delete(`http://localhost:8000/api/documentation/${id}`)
      alert("Documentation item deleted successfully")
      fetchDocumentationData()
    } catch (err) {
      console.error("Error deleting documentation item:", err)
      alert("Error deleting content: " + (err.response?.data?.message || err.message))
    }
  }

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Documentation Management</h1>

        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full sm:w-auto"
        >
          <Plus className="h-4 w-4" /> Add New Item
        </button>
      </div>

      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4 sm:space-y-6 border mb-6"
        >
          <h2 className="text-lg sm:text-xl font-semibold">Create New Documentation Item</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Heading</label>
              <input
                type="text"
                name="heading"
                value={formData.heading}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Login @ HT Cider</label>
              <input
                type="text"
                name="login_ht_cider"
                value={formData.login_ht_cider}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Item</label>
            <input
              type="text"
              name="item"
              value={formData.item}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              required
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Group Key</label>
              <input
                type="text"
                name="group_key"
                value={formData.group_key}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Page Heading</label>
              <input
                type="text"
                name="page_heading"
                value={formData.page_heading}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
          </div>

          <div className="border rounded p-4 bg-gray-50">
            <label className="block text-sm font-medium mb-2 text-gray-700">Page Paragraph Content</label>
            <JoditEditor
              ref={(el) => (editorRefs.current["page_paragraph_new"] = el)}
              value={formData.page_paragraph}
              config={config}
              onBlur={(content) => handleEditorChange(content, "page_partgraph")}
              onChange={(content) => handleEditorChange(content, "page_partgraph")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full sm:w-auto"
            >
              <Save className="h-5 w-5" /> Create Item
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors w-full sm:w-auto"
            >
              <X className="h-5 w-5" /> Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Heading
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                >
                  Group Key
                </th>
                <th
                  scope="col"
                  className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentationData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-3 sm:px-6 py-4 text-center text-sm text-gray-500">
                    No documentation items found.
                  </td>
                </tr>
              ) : (
                documentationData.map((item) => (
                  <>
                    <tr key={item.id} className={editingId === item.id ? "bg-blue-50" : ""}>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-500">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="heading"
                            value={formData.heading}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div className="line-clamp-2 sm:line-clamp-1">{item.heading}</div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="item"
                            value={formData.item}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          <div className="line-clamp-1">{item.item}</div>
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                        {editingId === item.id ? (
                          <input
                            type="text"
                            name="group_key"
                            value={formData.group_key}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                          />
                        ) : (
                          item.group_key
                        )}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1 sm:gap-2">
                          {editingId === item.id ? (
                            <>
                              <button onClick={handleSubmit} className="text-green-600 hover:text-green-900 p-1">
                                <Save className="h-4 w-4" />
                              </button>
                              <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900 p-1">
                                <X className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-blue-600 hover:text-blue-900 p-1"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900 p-1"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => toggleRowExpansion(item.id)}
                                className="text-purple-600 hover:text-purple-900 p-1"
                              >
                                {expandedRows[item.id] ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRows[item.id] && editingId !== item.id && (
                      <tr>
                        <td colSpan="5" className="px-3 sm:px-6 py-4 bg-gray-50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-sm">Login @ HT Cider:</h4>
                              <p className="text-sm">{item.login_ht_cider || "N/A"}</p>
                            </div>
                            <div>
                              <h4 className="font-semibold text-sm">Page Number:</h4>
                              <p className="text-sm">{item.page_number || "N/A"}</p>
                            </div>
                            {/* Show item and group key on mobile in expanded view */}
                            <div className="sm:hidden">
                              <h4 className="font-semibold text-sm">Item:</h4>
                              <p className="text-sm">{item.item || "N/A"}</p>
                            </div>
                            <div className="sm:hidden md:block">
                              <h4 className="font-semibold text-sm">Group Key:</h4>
                              <p className="text-sm">{item.group_key || "N/A"}</p>
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <h4 className="font-semibold text-sm">Page Part/Graph Content:</h4>
                              <div
                                className="prose prose-sm max-w-none mt-2"
                                dangerouslySetInnerHTML={{ __html: item.page_partgraph || "No content" }}
                              />
                            </div>
                            <div className="col-span-1 sm:col-span-2">
                              <h4 className="font-semibold text-sm">Timestamps:</h4>
                              <p className="text-sm">Created: {new Date(item.created_at).toLocaleString()}</p>
                              <p className="text-sm">Updated: {new Date(item.updated_at).toLocaleString()}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {editingId === item.id && (
                      <tr>
                        <td colSpan="5" className="px-3 sm:px-6 py-4 bg-blue-50">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">Login @ HT Cider</label>
                              <input
                                type="text"
                                name="login_ht_cider"
                                value={formData.login_ht_cider}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium mb-2 text-gray-700">Page Number</label>
                              <input
                                type="text"
                                name="page_number"
                                value={formData.page_number}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>

                            <div className="col-span-1 lg:col-span-2">
                              <label className="block text-sm font-medium mb-2 text-gray-700">
                                Page Part/Graph Content
                              </label>
                              <JoditEditor
                                ref={(el) => (editorRefs.current[`page_partgraph_${item.id}`] = el)}
                                value={formData.page_partgraph}
                                config={config}
                                onBlur={(content) => handleEditorChange(content, "page_partgraph")}
                                onChange={(content) => handleEditorChange(content, "page_partgraph")}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
