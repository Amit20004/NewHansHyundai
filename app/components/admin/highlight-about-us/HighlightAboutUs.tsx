import React, { useState, useEffect } from "react";
import axios from "axios";

const AboutUsAdmin = () => {
  const [aboutUsData, setAboutUsData] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    section_title: "",
    heading: "",
    description: "",
    image: null,
    car_name: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch all about us data
  const fetchAboutUsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/inside-about-us");
      setAboutUsData(response.data.data);
      setLoading(false);
    } catch (err) {
      if(err) 
      {
        console.error(err);
      }
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutUsData();
  }, []);

  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem({ ...newItem, [name]: value });
  };

  const handleNewFileChange = (e) => {
    setNewItem({ ...newItem, image: e.target.files[0] });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleEditFileChange = (e) => {
    setEditingItem({ ...editingItem, image: e.target.files[0] });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("section_title", newItem.section_title);
      formData.append("heading", newItem.heading);
      formData.append("description", newItem.description);
      formData.append("car_name", newItem.car_name);
      if (newItem.image) formData.append("image", newItem.image);

      await axios.post("http://localhost:8000/api/inside-about-us", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccessMessage("Item created successfully");
      setNewItem({ section_title: "", heading: "", description: "", image: null, car_name: "" });
      document.getElementById("new-image").value = "";
      fetchAboutUsData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if(err)
        {
          console.error(err);
        }
      setError("Failed to create item");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("section_title", editingItem.section_title);
      formData.append("heading", editingItem.heading);
      formData.append("description", editingItem.description);
      formData.append("car_name", editingItem.car_name);
      formData.append("existing_image", editingItem.image_url);

      if (editingItem.image) formData.append("image", editingItem.image);

      await axios.put(
        `http://localhost:8000/api/inside-about-us/${editingItem.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setSuccessMessage("Item updated successfully");
      setEditingItem(null);
      fetchAboutUsData();
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if(err)
        {
          console.error(err);
        }
      setError("Failed to update item");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:8000/api/inside-about-us/${id}`);
        setSuccessMessage("Item deleted successfully");
        fetchAboutUsData();
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (err) {
        if(err)
        {
          console.error(err);
        }
        setError("Failed to delete item");
      }
    }
  };

  const filteredData = aboutUsData.filter((item) =>
    (item.section_title + item.heading + item.car_name)
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">About Us Section Admin</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-center">
          {successMessage}
        </div>
      )}

      {/* Create Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New About Us Item</h2>
        <form onSubmit={handleCreate}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Section Title</label>
              <input
                type="text"
                name="section_title"
                value={newItem.section_title}
                onChange={handleNewInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Heading</label>
              <input
                type="text"
                name="heading"
                value={newItem.heading}
                onChange={handleNewInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={newItem.description}
                onChange={handleNewInputChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image</label>
              <input
                id="new-image"
                type="file"
                name="image"
                onChange={handleNewFileChange}
                className="w-full p-2 border rounded"
                accept="image/*"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Car Name</label>
              <input
                type="text"
                name="car_name"
                value={newItem.car_name}
                onChange={handleNewInputChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
          >
            Add Item
          </button>
        </form>
      </div>

      {/* Edit Form */}
      {editingItem && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">Edit About Us Item</h2>
          <form onSubmit={handleUpdate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Section Title</label>
                <input
                  type="text"
                  name="section_title"
                  value={editingItem.section_title}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heading</label>
                <input
                  type="text"
                  name="heading"
                  value={editingItem.heading}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingItem.description}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Current Image</label>
                {editingItem.image_url && (
                  <img
                    src={`http://localhost:8000/${editingItem.image_url}`}
                    alt="Current"
                    className="h-20 object-cover rounded mb-2"
                  />
                )}
                <input
                  type="file"
                  name="image"
                  onChange={handleEditFileChange}
                  className="w-full p-2 border rounded"
                  accept="image/*"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Car Name</label>
                <input
                  type="text"
                  name="car_name"
                  value={editingItem.car_name}
                  onChange={handleEditInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Update
              </button>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex justify-center my-4">
        <input
          type="text"
          placeholder="Search by title, heading, or car name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-1/2 shadow-sm"
        />
      </div>

      {/* Data Table - Mobile Responsive */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">About Us Items</h2>
        
        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{item.section_title}</h3>
                  <span className="text-sm text-gray-500">ID: {item.id}</span>
                </div>
                
                <div className="space-y-2">
                  <p><span className="font-medium">Heading:</span> {item.heading}</p>
                  <p><span className="font-medium">Car Name:</span> {item.car_name}</p>
                  
                  {item.image_url && (
                    <div className="mt-2">
                      <img
                        src={`http://localhost:8000/${item.image_url}`}
                        alt="About us"
                        className="h-24 w-full object-cover rounded"
                      />
                    </div>
                  )}
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-200 flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200 flex-1"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">
              No matching items found
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">ID</th>
                <th className="px-4 py-3 whitespace-nowrap">Section Title</th>
                <th className="px-4 py-3 whitespace-nowrap">Heading</th>
                <th className="px-4 py-3 whitespace-nowrap">Image</th>
                <th className="px-4 py-3 whitespace-nowrap">Car Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.section_title}</td>
                    <td className="px-4 py-3">{item.heading}</td>
                    <td className="px-4 py-3">
                      {item.image_url && (
                        <img
                          src={`http://localhost:8000/${item.image_url}`}
                          alt="About us"
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">{item.car_name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No matching items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AboutUsAdmin;