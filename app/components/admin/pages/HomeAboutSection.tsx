"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import dynamic from "next/dynamic"
import { Edit, Trash, Plus, X } from "lucide-react"

// ✅ Fix for “ReferenceError: self is not defined”
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false })

export default function HomeAboutAdmin() {
  const [activeTab, setActiveTab] = useState("intro")
  const [data, setData] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [showForm, setShowForm] = useState(false)

  // form states
  const [heading, setHeading] = useState("")
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [value, setValue] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    fetchData(activeTab)
  }, [activeTab])

  const fetchData = async (section: string) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/home-about/${section}`)
      setData(res.data.data || [])
    } catch (err) {
      console.error("Error fetching:", err)
    }
  }

  const resetForm = () => {
    setEditingItem(null)
    setShowForm(false)
    setHeading("")
    setContent("")
    setTitle("")
    setValue("")
    setDescription("")
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setShowForm(true)
    if (activeTab === "intro") {
      setHeading(item.heading || "")
      setContent(item.content || "")
    } else if (activeTab === "stats") {
      setTitle(item.title || "")
      setValue(item.value || "")
      setDescription(item.description || "")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this item?")) return
    try {
      await axios.delete(`http://localhost:8000/api/home-about/${activeTab}/${id}`)
      fetchData(activeTab)
    } catch (err) {
      console.error("Delete error:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let payload: any = {}
      if (activeTab === "intro") {
        payload = { heading, content }
      } else if (activeTab === "stats") {
        payload = { title, value, description }
      }

      if (editingItem) {
        // UPDATE
        await axios.put("http://localhost:8000/api/put-home-about", {
          section: activeTab,
          id: editingItem.id,
          ...payload,
        })
        alert("✅ Updated successfully!")
      } else {
        // CREATE
        await axios.post(`http://localhost:8000/api/home-about/${activeTab}`, payload)
        alert("✅ Created successfully!")
      }

      fetchData(activeTab)
      resetForm()
    } catch (err) {
      console.error("Save error:", err)
      alert("❌ Error saving data")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="px-3 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Home & About Admin</h1>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add New</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { key: "intro", label: "Intro" },
              { key: "stats", label: "Highlights" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key)
                  resetForm()
                }}
                className={`flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.key
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="px-3 sm:px-6 py-4 space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {activeTab === "intro" && (
                    <>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Heading</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
                    </>
                  )}
                  {activeTab === "stats" && (
                    <>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                      <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                    </>
                  )}
                  <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {activeTab === "intro" && (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.heading}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{item.content}</td>
                      </>
                    )}
                    {activeTab === "stats" && (
                      <>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                        <td className="px-4 py-3 text-sm font-medium text-blue-600">{item.value}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{item.description}</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:bg-green-50 p-1.5 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-lg shadow-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingItem ? "Edit" : "Add"} {activeTab === "intro" ? "Intro" : "Highlight"}
              </h3>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "intro" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                      <input
                        type="text"
                        value={heading}
                        onChange={(e) => setHeading(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter heading..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <div className="border border-gray-300 rounded-lg overflow-hidden">
                        <JoditEditor
                          value={content}
                          onBlur={setContent}
                          config={{
                            height: 200,
                            toolbarAdaptive: true,
                            toolbarSticky: false,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === "stats" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter title..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter value..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter description..."
                      />
                    </div>
                  </>
                )}
              </form>
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 sm:flex-none px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
