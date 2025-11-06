"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function InsuranceEnquiryForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    vehicleRegNo: "",
    currentInsurance: "",
    termsAccepted: false,
    notRobot: false
  });

  const [errors, setErrors] = useState({});

  const insuranceCompanies = [
    "Select Current Insurance Company",
    "State Farm",
    "Geico",
    "Progressive",
    "Allstate",
    "Liberty Mutual",
    "Nationwide",
    "Farmers",
    "USAA",
    "Travelers",
    "American Family"
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.vehicleRegNo.trim()) newErrors.vehicleRegNo = "Vehicle registration number is required";
    if (!formData.currentInsurance || formData.currentInsurance === "Select Current Insurance Company") 
      newErrors.currentInsurance = "Please select your current insurance company";
    if (!formData.notRobot) newErrors.notRobot = "Please verify you're not a robot";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must agree to receive calls";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:8000/api/insurance-enquiries", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.success("Enquiry Submitted Successfully! We'll contact you shortly.");
          // Reset form
          setFormData({
            fullName: "",
            mobile: "",
            email: "",
            vehicleRegNo: "",
            currentInsurance: "",
            termsAccepted: false,
            notRobot: false
          });
        } else {
          toast.error("Failed to submit enquiry. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 bg-white">
      <Toaster position="top-center" />
      


      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Full Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className={`w-full h-12 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Full Name"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          {/* Mobile No */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Mobile No *</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              className={`w-full h-12 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.mobile ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Mobile No"
            />
            {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full h-12 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Email"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Vehicle Reg No */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Vehicle Reg. No *</label>
            <input
              type="text"
              value={formData.vehicleRegNo}
              onChange={(e) => handleInputChange("vehicleRegNo", e.target.value)}
              className={`w-full h-12 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.vehicleRegNo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Vehicle Reg. No"
            />
            {errors.vehicleRegNo && <p className="text-red-500 text-sm">{errors.vehicleRegNo}</p>}
          </div>

          {/* Current Insurance Company */}
          <div className="space-y-2">
            <label className="text-gray-700 font-medium">Select Current Insurance Company *</label>
            <select
              value={formData.currentInsurance}
              onChange={(e) => handleInputChange("currentInsurance", e.target.value)}
              className={`w-full h-12 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.currentInsurance ? "border-red-500" : "border-gray-300"
              }`}
            >
              {insuranceCompanies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
            {errors.currentInsurance && <p className="text-red-500 text-sm">{errors.currentInsurance}</p>}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={formData.termsAccepted}
              onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              By filling the above form I agree to receive a call to explain the product, even if I am registered under NDNC.
            </span>
          </div>
          {errors.termsAccepted && <p className="text-red-500 text-sm">{errors.termsAccepted}</p>}

        
          {errors.notRobot && <p className="text-red-500 text-sm">{errors.notRobot}</p>}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 font-semibold  hover:bg-blue-700 transition"
          >
            Book Now
          </button>
          <button
            type="button"
            className="bg-green-600 text-white px-6 py-3 font-semibold  hover:bg-green-700 transition"
          >
            Chat On WhatsApp
          </button>
        </div>
      </form>
    </div>
  );
}