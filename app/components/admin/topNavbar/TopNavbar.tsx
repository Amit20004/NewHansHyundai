"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Trash, Edit, Plus, Save, X } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"

export default function TopNavbarAdminPanel() {
  const [navbarInfo, setNavbarInfo] = useState({ id: "", email: "", phone: "", locations: [] })
  const [icons, setIcons] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingInfo, setEditingInfo] = useState(false)
  const [editingIconId, setEditingIconId] = useState(null)
  const [newIcon, setNewIcon] = useState({ platform: "", url: "", iconClass: "" })
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLocation, setNewLocation] = useState("")

  // Fetch data
  useEffect(() => {
    fetchNavbarData()
  }, [])

  const fetchNavbarData = async () => {
    try {
      setIsLoading(true)
      const res = await axios.get("http://localhost:8000/api/topnavbar")
      if (res.data) {
        let locationsData = []
        if (res.data.navbarInfo) {
          if (Array.isArray(res.data.navbarInfo.locations)) {
            locationsData = res.data.navbarInfo.locations
          } else if (typeof res.data.navbarInfo.locations === "string") {
            try {
              locationsData = JSON.parse(res.data.navbarInfo.locations)
            } catch(err) {
              console.error("Error parsing locations JSON:", err)
              if (res.data.navbarInfo.locations) {
                locationsData = [res.data.navbarInfo.locations]
              }
            }
          }
        }

        setNavbarInfo({
          id: res.data.navbarInfo?.id || "",
          email: res.data.navbarInfo?.email || "",
          phone: res.data.navbarInfo?.phone || "",
          locations: locationsData,
        })
        setIcons(res.data.icons || [])
      }
    } catch (err) {
      console.error("Error fetching navbar data:", err)
      toast.error("Failed to fetch navbar data")
    } finally {
      setIsLoading(false)
    }
  }

  // Delete Icon
  const handleDeleteIcon = async (id) => {
    if (!confirm("Are you sure you want to delete this icon?")) return
    try {
      const res = await axios.delete(`http://localhost:8000/api/icon/${id}`)
      if (res.data.message) {
        setIcons(icons.filter((icon) => icon.id !== id))
        toast.success("Icon deleted successfully")
      }
    } catch (err) {
      console.error("Error deleting icon:", err)
      toast.error("Failed to delete icon")
    }
  }

  // Save Contact Info
  const handleSaveInfo = async () => {
    try {
      const res = await axios.put(`http://localhost:8000/api/topnavbar/${navbarInfo.id}`, {
        email: navbarInfo.email,
        phone: navbarInfo.phone,
        locations: navbarInfo.locations,
      })
      if (res.data.message) {
        setEditingInfo(false)
        toast.success("Contact info updated successfully")
      }
    } catch (err) {
      console.error("Error updating navbar info:", err)
      toast.error("Failed to update contact info")
    }
  }



 // ✅ Corrected Add Icon Function
const handleAddIcon = async () => {
  try {
    const res = await axios.post("http://localhost:8000/api/icon", {
      platform: newIcon.platform,
      url: newIcon.url,
      iconClass: newIcon.iconClass,  // ✅ send correct field
    });
    if (res.data.message) {
      setNewIcon({ platform: "", url: "", iconClass: "" }); // ✅ reset properly
      setShowAddForm(false);
      fetchNavbarData();
      toast.success("Icon added successfully");
    }
  } catch (err) {
    console.error("Error adding icon:", err);
    toast.error("Failed to add icon");
  }
};

// ✅ Corrected Save Icon Function
const handleSaveIcon = async (icon) => {
  try {
    const res = await axios.put(`http://localhost:8000/api/icon/${icon.id}`, {
      platform: icon.platform,
      url: icon.url,
      iconClass: icon.iconClass, // ✅ correct key
    });
    if (res.data.message) {
      setEditingIconId(null);
      fetchNavbarData();
      toast.success("Icon updated successfully");
    }
  } catch (err) {
    console.error("Error updating icon:", err);
    toast.error("Failed to update icon");
  }
};


  // Location handlers
  // const addLocation = () => {
  //   if (newLocation.trim()) {
  //     setNavbarInfo({
  //       ...navbarInfo,
  //       locations: [...navbarInfo.locations, newLocation.trim()],
  //     })
  //     setNewLocation("")
  //   }
  // }
  // const removeLocation = (index) => {
  //   const updatedLocations = [...navbarInfo.locations]
  //   updatedLocations.splice(index, 1)
  //   setNavbarInfo({ ...navbarInfo, locations: updatedLocations })
  // }
  // const updateLocation = (index, value) => {
  //   const updatedLocations = [...navbarInfo.locations]
  //   updatedLocations[index] = value
  //   setNavbarInfo({ ...navbarInfo, locations: updatedLocations })
  // }

  // Filter icons
  const filteredIcons = icons.filter(
    (icon) =>
      icon.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
      icon.url.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      <Toaster position="top-right" />
      <h1 className="text-lg sm:text-xl font-bold mb-4">Top Navbar Admin Panel</h1>

      {/* Contact Info */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="text-base sm:text-lg font-semibold">Contact Information</h2>
          {!editingInfo ? (
            <button
              onClick={() => setEditingInfo(true)}
              className="bg-blue-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              <Edit size={16} /> Edit Info
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={handleSaveInfo}
                className="bg-green-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm hover:bg-green-700 transition-colors flex-1 sm:flex-none"
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={() => setEditingInfo(false)}
                className="bg-gray-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-600 transition-colors flex-1 sm:flex-none"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <p>Loading...</p>
        ) : editingInfo ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={navbarInfo.email}
                onChange={(e) => setNavbarInfo({ ...navbarInfo, email: e.target.value })}
                className="border px-3 py-2 rounded w-full text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                value={navbarInfo.phone}
                onChange={(e) => setNavbarInfo({ ...navbarInfo, phone: e.target.value })}
                className="border px-3 py-2 rounded w-full text-sm"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <span className="font-medium sm:w-20 text-sm">Email:</span>
              <span className="text-sm break-all">{navbarInfo.email || "Not set"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0">
              <span className="font-medium sm:w-20 text-sm">Phone:</span>
              <span className="text-sm">{navbarInfo.phone || "Not set"}</span>
            </div>
          </div>
        )}
      </div>

      {/* Social Icons */}
      <div>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
          <h2 className="text-base sm:text-lg font-semibold">Social Icons</h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search by platform or URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
            />
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-colors w-full sm:w-auto whitespace-nowrap"
            >
              <Plus size={16} /> Add New Icon
            </button>
          </div>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
            <h3 className="font-medium mb-3 text-sm sm:text-base">Add New Social Icon</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-1">Platform *</label>
                <input
                  type="text"
                  value={newIcon.platform}
                  onChange={(e) => setNewIcon({ ...newIcon, platform: e.target.value })}
                  className="border px-3 py-2 rounded w-full text-sm"
                  placeholder="Facebook, Twitter"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-1">URL *</label>
                <input
                  type="url"
                  value={newIcon.url}
                  onChange={(e) => setNewIcon({ ...newIcon, url: e.target.value })}
                  className="border px-3 py-2 rounded w-full text-sm"
                  placeholder="https://example.com"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium mb-1">Icon Class *</label>
<input
  type="text"
  value={newIcon.iconClass}
  onChange={(e) => setNewIcon({ ...newIcon, iconClass: e.target.value })}
  className="border px-3 py-2 rounded w-full text-sm"
  placeholder="fa-brands fa-instagram"
/>

                <p className="text-xs text-gray-500 mt-1">Example: fa-brands fa-instagram, fa-brands fa-facebook</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm order-2 sm:order-1"
              >
                Cancel
              </button>
              <button
  onClick={handleAddIcon}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm order-1 sm:order-2"
  disabled={!newIcon.platform || !newIcon.url || !newIcon.iconClass} // ✅ FIXED
>
  Add Icon
</button>

            </div>
          </div>
        )}

        {/* Icons Table */}
       {/* Icons Table */}
<div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
  <table className="w-full min-w-[600px] text-sm">
    <thead className="bg-gray-50">
      <tr>
        <th className="text-left py-3 px-2 font-semibold text-gray-700 w-16">ID</th>
        <th className="text-left py-3 px-2 font-semibold text-gray-700">Platform</th>
        <th className="text-left py-3 px-2 font-semibold text-gray-700 hidden sm:table-cell">Icon</th>
        <th className="text-left py-3 px-2 font-semibold text-gray-700">URL</th>
        <th className="text-left py-3 px-2 font-semibold text-gray-700 w-20">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredIcons.length > 0 ? (
        filteredIcons.map((icon) => (
          <tr key={icon.id} className="border-b border-gray-100 hover:bg-gray-50">
            {/* ID */}
            <td className="py-3 px-2 text-xs sm:text-sm">{icon.id}</td>

            {/* Platform */}
            <td className="py-3 px-2">
              {editingIconId === icon.id ? (
                <input
                  type="text"
                  value={icon.platform}
                  onChange={(e) =>
                    setIcons(icons.map((i) => (i.id === icon.id ? { ...i, platform: e.target.value } : i)))
                  }
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              ) : (
                <span className="text-xs sm:text-sm">{icon.platform || "N/A"}</span>
              )}
            </td>

            {/* Icon Class */}
            <td className="py-3 px-2 hidden sm:table-cell">
              {editingIconId === icon.id ? (
                <input
                  type="text"
                  value={icon.iconClass || ""}
                  placeholder="fa-brands fa-linkedin-in"
                  onChange={(e) =>
                    setIcons(icons.map((i) => (i.id === icon.id ? { ...i, iconClass: e.target.value } : i)))
                  }
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              ) : icon.iconClass ? (
                <div className="flex items-center">
                  <i className={`${icon.iconClass} text-lg sm:text-xl mr-2`}></i>
                  <span className="text-xs text-gray-500 hidden lg:inline">{icon.iconClass}</span>
                </div>
              ) : (
                <span className="text-xs sm:text-sm">No icon</span>
              )}
            </td>

            {/* URL */}
            <td className="py-3 px-2">
              {editingIconId === icon.id ? (
                <input
                  type="url"
                  value={icon.url}
                  onChange={(e) =>
                    setIcons(icons.map((i) => (i.id === icon.id ? { ...i, url: e.target.value } : i)))
                  }
                  className="border px-2 py-1 rounded w-full text-sm"
                />
              ) : (
                <span className="max-w-[120px] sm:max-w-xs truncate block text-xs sm:text-sm">
                  {icon.url || "N/A"}
                </span>
              )}
            </td>

            {/* Actions */}
            <td className="py-3 px-2">
              {editingIconId === icon.id ? (
                <div className="flex gap-1">
                  <button
                    onClick={() => handleSaveIcon({
                      id: icon.id,
                      platform: icon.platform,
                      iconClass: icon.iconClass, // ✅ send correct key
                      url: icon.url,
                    })}
                    className="h-8 w-8 hover:bg-green-100 rounded flex items-center justify-center border border-green-200 transition-colors touch-manipulation"
                    title="Save"
                  >
                    <Save className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => setEditingIconId(null)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200 transition-colors touch-manipulation"
                    title="Cancel"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <button
                    onClick={() => setEditingIconId(icon.id)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200 transition-colors touch-manipulation"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteIcon(icon.id)}
                    className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200 transition-colors touch-manipulation"
                    title="Delete"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
            {isLoading ? "Loading..." : "No icons found"}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>
    </div>
  )
}
