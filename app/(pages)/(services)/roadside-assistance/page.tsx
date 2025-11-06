"use client";
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner";

export default function RoadsideAssistanceForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    model: "",
    serviceCenter: "",
    comments: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const carModels = [
    "Hyundai Accent", "Hyundai Aura", "Hyundai Elantra", "Hyundai Ioniq 6",
    "Hyundai Sonata", "Hyundai Verna", "Hyundai i10", "Hyundai i20",
    "Hyundai Creta", "Hyundai Alcazar", "Hyundai Tucson", "Hyundai Santa Fe",
    "Hyundai Palisade", "Hyundai Kona", "Hyundai Kona Electric", "Hyundai Ioniq 5",
  ];

  const serviceCenters = [
    "Moti Nagar Service Center",
    "Naraina Service Center",
    "Okhla Service Center",
    "Gurgaon Service Center",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.name || !formData.email || !formData.mobile || !formData.model || !formData.serviceCenter) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    if (!formData.agree) {
      toast.error("Please agree to receive communications");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/roadside-assistance", formData);
      toast.success(res.data.message || "Request submitted successfully!");

      // Reset form
      setFormData({
        name: "",
        email: "",
        mobile: "",
        model: "",
        serviceCenter: "",
        comments: "",
        agree: false,
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full mx-auto bg-white p-6">
      <ResponsiveBanner />
      <Toaster position="top-right" reverseOrder={false} />

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mt-5 text-black">Roadside Assistance Request</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Name */}
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name *"
            className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address *"
            className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />

          {/* Mobile */}
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Phone Number *"
            className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
            required
          />

          {/* Model */}
          <select
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 text-black focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Car Model *</option>
            {carModels.map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </select>

          {/* Service Center */}
          <select
            name="serviceCenter"
            value={formData.serviceCenter}
            onChange={handleChange}
            className="w-full px-4 py-1 border border-gray-300 text-black focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Select Service Center *</option>
            {serviceCenters.map((center, index) => (
              <option key={index} value={center}>{center}</option>
            ))}
          </select>

          {/* Comments */}
          <textarea
            name="comments"
            value={formData.comments}
            onChange={handleChange}
            placeholder="Comments (Optional)"
            rows="3"
            className="w-full px-4 py-1 border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none "
          ></textarea>
        </div>

        {/* Checkbox */}
        <div className="flex items-start pt-2 mx-auto w-full max-w-full">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={formData.agree}
            onChange={handleChange}
            className="mt-1 mr-3"
            required
          />
          <label htmlFor="agree" className="text-sm text-gray-700">
            I agree to receive calls, e-mails, WhatsApp messages, and SMS from HANS HYUNDAI.
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 mx-auto max-w-[40%] hover:bg-blue-700 text-white px-6 py-3 text-base font-semibold transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
