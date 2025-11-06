"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { Edit, Trash, Plus, X } from "lucide-react"
import Image from "next/image"
// import Home from "@/app/(pages)/home/page"

export default function HomeAbout2Section ()  {
  const [sections, setSections] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    main_heading: "",
    description: "",
    image_url1: "",
    image_url2: "",
  })
  const [imageFiles, setImageFiles] = useState({ image1: null, image2: null })

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Fetch all
  const fetchSections = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get-home-about2")
      setSections(res.data.data || [])
    } catch (err) {
      console.error("Fetch failed", err)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e, key) => {
    setImageFiles({ ...imageFiles, [key]: e.target.files[0] })
  }

  const saveSection = async () => {
    try {
      const form = new FormData()
      form.append("main_heading", formData.main_heading)
      form.append("description", formData.description)

      // Handle images
      if (imageFiles.image1) {
        form.append("image1", imageFiles.image1)
      } else if (formData.image_url1) {
        form.append("image_url1", formData.image_url1)
      }

      if (imageFiles.image2) {
        form.append("image2", imageFiles.image2)
      } else if (formData.image_url2) {
        form.append("image_url2", formData.image_url2)
      }

      if (editingId) {
        await axios.put(`http://localhost:8000/api/put-home-about2/${editingId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Updated successfully")
      } else {
        await axios.post("http://localhost:8000/api/home-about2", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        alert("Added successfully")
      }

      setFormData({ main_heading: "", description: "", image_url1: "", image_url2: "" })
      setImageFiles({ image1: null, image2: null })
      setEditingId(null)
      setShowForm(false)
      fetchSections()
    } catch (err) {
      console.error("Save failed", err)
      alert("Save failed")
    }
  }

  const startEdit = (section) => {
    setFormData({
      main_heading: section.main_heading,
      description: section.description,
      image_url1: section.image_url1 || "",
      image_url2: section.image_url2 || "",
    })
    setEditingId(section.id)
    setShowForm(true)
  }

  const deleteSection = async (id) => {
    if (!window.confirm("Delete this section?")) return
    try {
      await axios.delete(`http://localhost:8000/api/home-about2/${id}`)
      fetchSections()
    } catch (err) {
      console.error("Delete failed", err)
      alert("Delete failed")
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({ main_heading: "", description: "", image_url1: "", image_url2: "" })
    setImageFiles({ image1: null, image2: null })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Home About 2 Editor</h1>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Section</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6">
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Main Heading
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image 1
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image 2
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sections.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.main_heading}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.image_url1 ? (
                        <Image
                        width={100} height={100} quality={100} unoptimized={true}

                          src={`http://localhost:8000${item.image_url1}`}
                          alt="Preview1"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.image_url2 ? (
                        <Image
                        width={100} height={100} quality={100} unoptimized={true}

                          src={`http://localhost:8000${item.image_url2}`}
                          alt="Preview2"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteSection(item.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
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

        <div className="md:hidden space-y-4">
          {sections.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-900 text-sm leading-tight">{item.main_heading}</h3>
                <div className="flex gap-1 ml-2">
                  <button
                    onClick={() => startEdit(item)}
                    className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteSection(item.id)}
                    className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.description}</p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Image 1</p>
                  {item.image_url1 ? (
                    <Image
                      width={100} height={100} quality={100} unoptimized={true}
                      src={`http://localhost:8000${item.image_url1}`}
                      alt="Preview1"
                      className="w-full h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Image 2</p>
                  {item.image_url2 ? (
                    <Image
                      width={100} height={100} quality={100} unoptimized={true}
                      src={`http://localhost:8000${item.image_url2}`}
                      alt="Preview2"
                      className="w-full h-20 object-cover rounded"
/>
                  ) : (
                    <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No image</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {sections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No sections found. Add your first section!</p>
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={cancelEdit}></div>

            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg w-full">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingId ? "Edit Section" : "Add New Section"}
                  </h3>
                  <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading</label>
                    <input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter main heading"
                      name="main_heading"
                      value={formData.main_heading}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image 1 File</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "image1")}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image 2 File</label>
                      <input
                        type="file"
                        onChange={(e) => handleFileChange(e, "image2")}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image 1 URL (optional)</label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                        name="image_url1"
                        value={formData.image_url1}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Image 2 URL (optional)</label>
                      <input
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://..."
                        name="image_url2"
                        value={formData.image_url2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={saveSection}
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  {editingId ? "Update" : "Save"}
                </button>
                <button
                  onClick={cancelEdit}
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// export default 
