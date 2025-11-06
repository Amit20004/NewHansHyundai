"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function PickDropServiceForm() {
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    serviceType: "",
    carModel: "",
    carNumber: "",
    mileage: "",
    serviceDate: "",
    serviceTime: "",
    description: "",
    serviceCenter: "",
    pickUp: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";

    if (activeTab >= 1) {
      if (!formData.serviceType.trim()) newErrors.serviceType = "Service type is required";
      if (!formData.carModel.trim()) newErrors.carModel = "Car model is required";
      if (!formData.carNumber.trim()) newErrors.carNumber = "Car number is required";
      if (!formData.mileage.trim()) newErrors.mileage = "Mileage is required";
    }

    if (activeTab === 2) {
      if (!formData.serviceDate.trim()) newErrors.serviceDate = "Service date is required";
      if (!formData.serviceTime.trim()) newErrors.serviceTime = "Service time is required";
      if (!formData.serviceCenter.trim()) newErrors.serviceCenter = "Service center is required";
      if (!formData.pickUp.trim()) newErrors.pickUp = "Please select pickup option";
      if (!formData.termsAccepted)
        newErrors.termsAccepted = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Send the data with the exact field names that the backend expects
        const response = await axios.post(
          "http://localhost:8000/api/pick-drop-service",
          {
            name: formData.name,
            mobile: formData.mobile,
            email: formData.email,
            serviceType: formData.serviceType, // Keep as serviceType, not service_type
            carModel: formData.carModel, // Keep as carModel, not car_model
            carNumber: formData.carNumber, // Keep as carNumber, not car_number
            mileage: formData.mileage,
            serviceDate: formData.serviceDate, // Keep as serviceDate, not service_date
            serviceTime: formData.serviceTime, // Keep as serviceTime, not service_time
            description: formData.description,
            serviceCenter: formData.serviceCenter, // Keep as serviceCenter, not service_center
            pickUp: formData.pickUp, // Keep as pickUp, not pick_up
            termsAccepted: formData.termsAccepted, // Keep as termsAccepted, not terms_accepted
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.status === 201) {
          toast.success("Service booked successfully!");
          // Reset form
          setFormData({
            name: "",
            mobile: "",
            email: "",
            serviceType: "",
            carModel: "",
            carNumber: "",
            mileage: "",
            serviceDate: "",
            serviceTime: "",
            description: "",
            serviceCenter: "",
            pickUp: "",
            termsAccepted: false,
          });
          setActiveTab(0);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      }
    }
  };

  const canProceed = () => {
    if (activeTab === 0)
      return formData.name && formData.mobile && formData.email;
    if (activeTab === 1)
      return (
        formData.serviceType &&
        formData.carModel &&
        formData.carNumber &&
        formData.mileage
      );
    return true;
  };

  const renderInput = (label, id, type = "text") => (
    <div className="space-y-2">
      <label className="text-slate-700 font-medium">{label}</label>
      <input
        type={type}
        value={formData[id]}
        onChange={(e) => handleInputChange(id, e.target.value)}
        className={`w-full h-12 px-4 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          errors[id] ? "border-red-500" : "border-slate-300"
        }`}
        placeholder={label}
      />
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="bg-white py-4 w-full max-w-[1400px] mx-auto">
      <Toaster position="top-center" />

      {/* Tabs Navigation */}
      <div className="flex">
        {["Personal Details", "Vehicle Details", "Service & Pickup"].map(
          (label, idx) => (
            <div
              key={idx}
              className={`flex-1 py-4 px-6 text-center cursor-pointer ${
                activeTab === idx
                  ? "bg-[#013566] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => (idx <= activeTab && canProceed() ? setActiveTab(idx) : null)}
            >
              <div className="text-sm font-medium">Step {idx + 1}</div>
              <div className="text-base font-semibold">{label}</div>
            </div>
          )
        )}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 max-w-3xl mx-auto mt-6 space-y-6">
        {/* Step 1 */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <h2 className="!text-lg font-semibold text-[#013566]">
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Name *", "name")}
              {renderInput("Mobile *", "mobile", "tel")}
              {renderInput("Email *", "email", "email")}
            </div>
            <div className="flex justify-end">
              {canProceed() && (
                <button
                  onClick={() => setActiveTab(1)}
                  className="bg-[#013566] text-white px-6 py-2 font-semibold"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {activeTab === 1 && (
          <div className="space-y-6">
            <h2 className="!text-lg font-semibold text-[#013566]">
              Vehicle Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Service Type *", "serviceType")}
              {renderInput("Car Model *", "carModel")}
              {renderInput("Car Number *", "carNumber")}
              {renderInput("Mileage *", "mileage")}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setActiveTab(0)}
                className="bg-gray-500 text-white px-6 py-2 font-semibold"
              >
                Back
              </button>
              {canProceed() && (
                <button
                  onClick={() => setActiveTab(2)}
                  className="bg-[#013566] text-white px-6 py-2 font-semibold"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}

        {/* Step 3 */}
        {activeTab === 2 && (
          <div className="space-y-6">
            <h2 className="!text-lg font-semibold text-[#013566]">
              Service & Pickup Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Service Date *", "serviceDate", "date")}
              {renderInput("Service Time *", "serviceTime", "time")}
            </div>
            <div>
              <label className="text-slate-700 font-medium">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full h-24 px-4 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description"
              />
            </div>
            {renderInput("Service Center *", "serviceCenter")}

            {/* Pickup Option */}
            <div>
              <label className="text-slate-700 font-medium">Pick Up *</label>
              <div className="flex gap-4 mt-2">
                {["Yes", "No"].map((option) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="radio"
                      value={option}
                      checked={formData.pickUp === option}
                      onChange={(e) => handleInputChange("pickUp", e.target.value)}
                    />
                    {option}
                  </label>
                ))}
              </div>
              {errors.pickUp && (
                <p className="text-red-500 text-sm">{errors.pickUp}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  handleInputChange("termsAccepted", e.target.checked)
                }
              />
              <span className="text-sm">
                I agree to receive Sms, Phone call, Email & WhatsApp Messages from Hans Hyundai on my devices.
              </span>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
            )}

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setActiveTab(1)}
                className="bg-gray-500 text-white px-6 py-2 font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.termsAccepted}
                className="bg-[#013566] text-white px-6 py-2 font-semibold disabled:bg-gray-400"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}