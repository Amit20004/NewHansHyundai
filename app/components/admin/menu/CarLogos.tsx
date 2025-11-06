"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function CarLogosAdmin() {
  const [carLogos, setCarLogos] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    image: null
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    fetchCarLogos();
  }, []);

  const fetchCarLogos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/car-logos");
      if (res.data.success) setCarLogos(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch car logos");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("category", formData.category);
    
    if (newImage) {
      payload.append("image", newImage);
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/car-logos/${formData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Car logo updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/car-logos", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Car logo added successfully");
      }

      resetForm();
      fetchCarLogos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save car logo");
    }
  };

  const handleEdit = (logo) => {
    setFormData({
      id: logo.id,
      name: logo.name,
      category: logo.category,
      image: logo.image
    });
    
    if (logo.image) {
      setImagePreview(`http://localhost:8000${logo.image}`);
    }
    
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this car logo?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/car-logos/${id}`);
      toast.success("Car logo deleted successfully");
      fetchCarLogos();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete car logo");
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      name: "",
      category: "",
      image: null
    });
    setNewImage(null);
    setImagePreview("");
    setIsEditing(false);
  };

  return (
    <div className="p-6 max-w-[95%] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Car Logos Management</h1>
      
      {/* Add/Edit Form */}
      <div className="bg-white shadow p-6 mb-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Car Logo" : "Add Car Logo"}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Logo Name"
            value={formData.name}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Logo Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="border px-3 py-2 rounded w-full"
            />
          </div>
          
          {imagePreview && (
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium mb-1">Preview:</p>
              <Image
              width={100} height={100} quality={100} unoptimized={true} 
                src={imagePreview} 
                alt="Preview" 
                className="h-32 object-contain border rounded"
              />
            </div>
          )}
          
          <div className="col-span-1 md:col-span-2 flex gap-2">
  <button 
    type="submit" 
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
  >
    {isEditing ? "Update Logo" : "Add Logo"}
  </button>
  <button 
    type="button" 
    onClick={resetForm}
    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
  >
    Cancel
  </button>
</div>

        </form>
      </div>

      {/* Car Logos Table */}
      <div className="bg-white shadow overflow-x-auto rounded-lg">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 font-semibold text-left">#</th>
              <th className="py-3 px-4 font-semibold text-left">Logo</th>
              <th className="py-3 px-4 font-semibold text-left">Name</th>
              <th className="py-3 px-4 font-semibold text-left">Category</th>
              <th className="py-3 px-4 font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {carLogos.map((logo, i) => (
              <tr key={logo.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{i + 1}</td>
                <td className="py-3 px-4">
                  {logo.image && (
                    <Image
                    width={100} height={100} quality={100} unoptimized={true} 
                      src={`http://localhost:8000/${logo.image}`} 
                      alt={logo.name} 
                      className="h-10 w-10 object-contain"
                    />
                  )}
                </td>
                <td className="py-3 px-4">{logo.name}</td>
                <td className="py-3 px-4">{logo.category}</td>
                <td className="py-3 px-4 flex gap-2">
                  <button 
                    onClick={() => handleEdit(logo)} 
                    className="p-1 bg-green-100 rounded hover:bg-green-200"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button 
                    onClick={() => handleDelete(logo.id)} 
                    className="p-1 bg-red-100 rounded hover:bg-red-200"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}