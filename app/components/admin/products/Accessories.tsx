"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [carData, setCarData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedAccessory, setSelectedAccessory] = useState("All Accessories");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/car-accessories");
        if (res.data.success) {
          setCarData(res.data.data);
          console.log(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching car data:", err);
      }
    };
    fetchCarData();
  }, []);

  const filteredCars = carData
    .filter((car) => {
      const matchesSearch =
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.name?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" || car.model === selectedCategory;

      const matchesAccessories =
        selectedAccessory === "All Accessories" || car.name === selectedAccessory;

      const matchesStatus =
        selectedStatus === "All Status" || car.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus && matchesAccessories;
    })
    .sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      const priceA = parseFloat(String(a.price || 0).replace(/[^0-9.]/g, ""));
      const priceB = parseFloat(String(b.price || 0).replace(/[^0-9.]/g, ""));

      switch (sortBy) {
        case "newest":
          return dateB - dateA;
        case "oldest":
          return dateA - dateB;
        case "price-high":
          return priceB - priceA;
        case "price-low":
          return priceA - priceB;
        default:
          return 0;
      }
    });

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const currentCars = filteredCars.slice(
    (currentPage - 1) * carsPerPage,
    currentPage * carsPerPage
  );

  return (
    <div className="relative top-20 px-3 sm:px-6 w-full max-w-[95%] mx-auto">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search cars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-64 text-sm"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option>All Categories</option>
          {[...new Set(carData.map((c) => c.model).filter(Boolean))].map((cat, i) => (
            <option key={i}>{cat}</option>
          ))}
        </select>
        <select
          value={selectedAccessory}
          onChange={(e) => setSelectedAccessory(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option>All Accessories</option>
          {[...new Set(carData.map((c) => c.name).filter(Boolean))].map((acc, i) => (
            <option key={i}>{acc}</option>
          ))}
        </select>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option>All Status</option>
          {[...new Set(carData.map((c) => c.status).filter(Boolean))].map((status, i) => (
            <option key={i}>{status}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="price-high">Price: High to Low</option>
          <option value="price-low">Price: Low to High</option>
        </select>
      </div>

      {/* Table for Desktop */}
      <div className="hidden md:block mt-5 bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
        <table className="w-full min-w-[650px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">S.No.</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Model Name</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Accessory Category</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Accessory</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Price</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-2 font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCars.map((car, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-2">
                  <div className="font-medium">{car.id}</div>
                  <div className="text-xs text-gray-500">Added {car.created_at}</div>
                </td>
                <td className="py-4 px-2">{car.model || "N/A"}</td>
                <td className="py-4 px-2">{car.category || "N/A"}</td>
                <td className="py-4 px-2">{car.name || "N/A"}</td>
                <td className="py-4 px-2">{car.price || "N/A"}</td>
                <td className="py-4 px-2">{car.description || "N/A"}</td>
                <td className="py-4 px-2">{car.status || "N/A"}</td>
                <td className="py-4 px-2">
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Eye className="h-4 w-4 text-blue-600" />
                    </button>
                    <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center">
                      <Trash className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card layout for Mobile */}
 {/* Card layout for Mobile */}
<div className="md:hidden mt-5 space-y-4 relative z-0">
  {currentCars.map((car, index) => (
    <div
      key={index}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col gap-3"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold text-gray-800">
            {car.model || "N/A"}
          </h2>
          <p className="text-xs text-gray-500">
            ID: {car.id} • Added {car.created_at || "—"}
          </p>
        </div>
        <span
          className={`px-2 py-0.5 rounded text-xs font-medium ${
            car.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {car.status || "N/A"}
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div>
          <p className="text-gray-500">Category</p>
          <p className="font-medium">{car.category || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Accessory</p>
          <p className="font-medium">{car.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Price</p>
          <p className="font-medium">{car.price || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500">Description</p>
          <p className="font-medium break-words">{car.description || "N/A"}</p>
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="flex justify-end items-center gap-2 pt-3 border-t border-gray-100">
        <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200">
          <Eye className="h-4 w-4 text-blue-600" />
        </button>
        <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200">
          <Edit className="h-4 w-4 text-green-600" />
        </button>
        <button className="h-8 w-8 hover:bg-gray-100 rounded flex items-center justify-center border border-gray-200">
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
