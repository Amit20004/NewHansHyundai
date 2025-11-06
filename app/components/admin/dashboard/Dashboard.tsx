'use client'
import axios from "axios";
import { Car, CreditCard, TestTube, BookOpen, ArrowRight, Eye, Edit, Trash } from "lucide-react"
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [carData, setCarData] = useState([]);
  const [serviceData, setServiceData] = useState([]);

  const fetchCarData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/car-data");
      if (response.data.success) {
        setCarData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching car data:", err);
    }
  };

  const fetchServiceData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/fetch-service-bookings");
      if (response.data.success) {
        setServiceData(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching service data:", err);
    }
  };

  useEffect(() => {
    fetchCarData();
    fetchServiceData();
  }, []);

  const stats = [
    {
      title: "Total Cars",
      value: carData.length,
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      trendUp: true,
    },
    {
      title: "Loan",
      value: "14",
      icon: CreditCard,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      trend: "+5 this month",
      trendUp: true,
    },
    {
      title: "Testdrive",
      value: "1",
      icon: TestTube,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      trend: "No change",
      trendUp: null,
    },
    {
      title: "Carbooking",
      value: "0",
      icon: BookOpen,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      trend: "No bookings",
      trendUp: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-6 mt-10 md:mt-0">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 shadow-xs hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                    <div className="flex items-end gap-2">
                      <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                      {stat.trend && (
                        <p className={`text-xs ${stat.trendUp ? 'text-green-600' : 'text-gray-500'}`}>
                          {stat.trend}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className={`p-2 md:p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 md:h-5 md:w-5 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Content Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Latest Cars */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
              <div className="px-4 py-3 md:px-5 md:py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Latest Cars</h3>
                <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 md:px-5 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-3 py-2 md:px-5 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                      <th className="px-3 py-2 md:px-5 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-3 py-2 md:px-5 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xs:table-cell">Status</th>
                      <th className="px-3 py-2 md:px-5 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {carData.map((car, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 md:px-5 md:py-4 whitespace-nowrap">
                          <div className="font-medium text-xs md:text-sm text-gray-900">{car.name}</div>
                          <div className="text-xs text-gray-500">Added {car.created_at}</div>
                        </td>
                        <td className="px-3 py-3 md:px-5 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500 hidden sm:table-cell">
                          {car.body_style || "N/A"}
                        </td>
                        <td className="px-3 py-3 md:px-5 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-gray-900">
                          {car.start_price || "N/A"}
                        </td>
                        <td className="px-3 py-3 md:px-5 md:py-4 whitespace-nowrap hidden xs:table-cell">
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            {car.status}
                          </span>
                        </td>
                        <td className="px-3 py-3 md:px-5 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-500">
                          <div className="flex items-center gap-1 md:gap-2">
                            <button className="p-1 rounded hover:bg-gray-100 text-blue-600">
                              <Eye className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100 text-green-600">
                              <Edit className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-100 text-red-600">
                              <Trash className="h-3 w-3 md:h-4 md:w-4" />
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

          {/* Latest Services */}
          <div>
            <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
              <div className="px-4 py-3 md:px-5 md:py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">Latest Services</h3>
                <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium flex items-center gap-1">
                  View All
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="grid grid-cols-3 gap-2 md:gap-4 px-3 py-2 md:px-5 md:py-3 bg-gray-50">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">S.No.</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Heading</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Car Type</span>
                </div>
                {serviceData.map((service) => (
                  <div key={service.id} className="grid grid-cols-3 gap-2 md:gap-4 px-3 py-3 md:px-5 md:py-4 hover:bg-gray-50 transition-colors">
                    <span className="text-xs md:text-sm font-medium text-gray-900">{service.id}</span>
                    <div className="overflow-hidden">
                      <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{service.service_type}</div>
                      <div className="text-xs text-gray-500">Active service</div>
                    </div>
                    <div className="text-xs md:text-sm text-gray-900 truncate">
                      {service.car_make}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 pb-2 text-center">
          <p className="text-xs text-gray-500 font-medium">POWERED BY HANS HYUNDAI</p>
        </div>
      </div>
    </div>
  );
} 