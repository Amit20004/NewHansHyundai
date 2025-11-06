"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function ServiceEnquiry() {
  const [carData, setCarData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [formData, setFormData] = useState({
    id: null,
    carMake: "",
    carModel: "",
    serviceType: "",
    status: "",
    notes: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCarData();
  }, []);

  const fetchCarData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/fetch-service-bookings"
      );
      if (res.data.success) {
        setCarData(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching car data:", err);
      toast.error("Failed to fetch service bookings");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/book-service/${formData.id}`,
        formData
      );
      toast.success("Updated successfully");
      setFormData({
        id: null,
        carMake: "",
        carModel: "",
        serviceType: "",
        status: "",
        notes: "",
      });
      setIsEditing(false);
      fetchCarData();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating form");
    }
  };

  const handleEdit = (car) => {
    setFormData({
      id: car.id,
      carMake: car.car_make || "",
      carModel: car.car_model || "",
      serviceType: car.service_type || "",
      status: car.status || "",
      notes: car.notes || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/service/${id}`);
      toast.success("Deleted successfully");
      fetchCarData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking");
    }
  };

  // Filter
  const filteredCars = carData.filter((car) => {
    const matchesSearch =
      car.car_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.service_type?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      car.car_model === selectedCategory;
    const matchesStatus =
      selectedStatus === "All Status" || car.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const currentCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  );

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Edit Form */}
      {isEditing && (
        <div className="bg-white p-6 shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Edit Service Booking</h2>
          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              name="carMake"
              placeholder="Car Make"
              value={formData.carMake}
              onChange={handleInputChange}
              className="border px-3 py-2 "
              required
            />
            <input
              type="text"
              name="carModel"
              placeholder="Car Model"
              value={formData.carModel}
              onChange={handleInputChange}
              className="border px-3 py-2 "
              required
            />
            <input
              type="text"
              name="serviceType"
              placeholder="Service Type"
              value={formData.serviceType}
              onChange={handleInputChange}
              className="border px-3 py-2 "
              required
            />
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleInputChange}
              className="border px-3 py-2 rounded"
              required
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>

            <textarea
              name="notes"
              placeholder="Notes"
              rows={3}
              value={formData.notes}
              onChange={handleInputChange}
              className="border px-3 py-2 col-span-1 md:col-span-2"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 col-span-1 md:col-span-2"
            >
              Update Booking
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 shadow-sm mb-5">
        <input
          type="text"
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 w-full sm:w-64 text-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 w-full sm:w-auto text-sm"
        >
          <option>All Categories</option>
          {[...new Set(carData.map((c) => c.car_model).filter(Boolean))].map(
            (cat, i) => (
              <option key={i}>{cat}</option>
            )
          )}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border px-3 py-2 w-full sm:w-auto text-sm"
        >
          <option>All Status</option>
          {[...new Set(carData.map((c) => c.status).filter(Boolean))].map(
            (status, i) => (
              <option key={i}>{status}</option>
            )
          )}
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block bg-white border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                S.No.
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Car Make
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Car Model
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Service Type
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentCars.map((car, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-4 px-2">
                  {(currentPage - 1) * carsPerPage + index + 1}
                </td>
                <td className="py-4 px-2">{car.car_make || "N/A"}</td>
                <td className="py-4 px-2">{car.car_model || "N/A"}</td>
                <td className="py-4 px-2">{car.service_type || "N/A"}</td>
                <td className="py-4 px-2">
                  <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 -full">
                    {car.status}
                  </span>
                </td>
                <td className="py-4 px-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(car)}
                    className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Edit className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={() => handleDelete(car.id)}
                    className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
      <div className="md:hidden mt-5 space-y-4">
        {currentCars.map((car, index) => (
          <div
            key={index}
            className="bg-white p-4 shadow-sm border border-gray-200 space-y-2"
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{car.car_model}</h2>
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 -full">
                {car.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">{car.service_type || "N/A"}</p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleEdit(car)}
                className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
              >
                <Edit className="h-4 w-4 text-green-600" />
              </button>
              <button
                onClick={() => handleDelete(car.id)}
                className="h-8 w-8 hover:bg-gray-100 flex items-center justify-center"
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
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 disabled:opacity-50 text-xs sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </button>
          <span className="text-xs sm:text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1 border border-gray-300 disabled:opacity-50 text-xs sm:text-sm"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
