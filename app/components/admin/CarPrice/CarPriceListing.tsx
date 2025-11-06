"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function VehicleAdmin() {
  const [vehicles, setVehicles] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    model: "",
    fuel_type: "",
    transmission: "",
    variant: "",
    price: "",
    features: [],
    images: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/vehicles");
      if (res.data.success) setVehicles(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch vehicles");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("model", formData.model);
    payload.append("fuel_type", formData.fuel_type);
    payload.append("transmission", formData.transmission);
    payload.append("variant", formData.variant);
    payload.append("price", formData.price);
    payload.append("features", JSON.stringify(formData.features.split(",").map(f => f.trim())));

    newImages.forEach((img) => payload.append("images", img));

    try {
      if (isEditing) {
        await axios.put(`http://localhost:8000/api/vehicles/${formData.id}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Vehicle updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/vehicles", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Vehicle added successfully");
      }

      setFormData({
        id: null,
        model: "",
        fuel_type: "",
        transmission: "",
        variant: "",
        price: "",
        features: [],
        images: []
      });
      setNewImages([]);
      setIsEditing(false);
      fetchVehicles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save vehicle");
    }
  };

  const handleEdit = (vehicle) => {
    setFormData({
      id: vehicle.id,
      model: vehicle.model,
      fuel_type: vehicle.fuel_type,
      transmission: vehicle.transmission,
      variant: vehicle.variant,
      price: vehicle.price,
      features: Array.isArray(vehicle.features) ? vehicle.features.join(", ") : vehicle.features,
      images: vehicle.images || []
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/vehicles/${id}`);
      toast.success("Vehicle deleted successfully");
      fetchVehicles();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete vehicle");
    }
  };

  return (
    <div className="p-4 max-w-full mx-auto">
      {/* Add/Edit Form */}
      <div className="bg-white shadow p-4 mb-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Vehicle" : "Add Vehicle"}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="model"
            placeholder="Model"
            value={formData.model}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="fuel_type"
            placeholder="Fuel Type"
            value={formData.fuel_type}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="transmission"
            placeholder="Transmission"
            value={formData.transmission}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="variant"
            placeholder="Variant"
            value={formData.variant}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
            required
          />
          <input
            type="text"
            name="features"
            placeholder="Features (comma separated)"
            value={formData.features}
            onChange={handleInputChange}
            className="border px-3 py-2 rounded"
          />
          <div className="md:col-span-2">
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="border px-3 py-2 w-full rounded"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 md:col-span-2 rounded">
            {isEditing ? "Update Vehicle" : "Add Vehicle"}
          </button>
        </form>
      </div>

      {/* Vehicles Table with Horizontal Scroll */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">#</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Model</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Fuel</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Transmission</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Variant</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Price</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Features</th>
                <th className="py-3 px-4 text-left font-semibold border-b whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length ? vehicles.map((v, i) => (
                <tr key={v.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 whitespace-nowrap">{i + 1}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{v.model}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{v.fuel_type}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{v.transmission}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{v.variant}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{v.price}</td>
                  <td className="py-3 px-4 max-w-xs">
                    <div className="truncate max-w-[200px]">
                      {Array.isArray(v.features) ? v.features.join(", ") : v.features}
                    </div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(v)} className="p-1 bg-green-100 rounded">
                        <Edit className="h-4 w-4 text-green-600" />
                      </button>
                      <button onClick={() => handleDelete(v.id)} className="p-1 bg-red-100 rounded">
                        <Trash className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="8" className="py-8 px-4 text-center text-gray-500">No vehicles found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}