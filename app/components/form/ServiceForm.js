"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function BookServiceTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    carMake: "",
    carModel: "",
    carYear: "",
    licensePlate: "",
    serviceType: "",
    preferredDate: "",
    preferredTime: "",
    additionalServices: [],
    notes: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.carMake.trim()) newErrors.carMake = "Car make is required";
    if (!formData.carModel.trim()) newErrors.carModel = "Car model is required";
    if (!formData.carYear.trim()) newErrors.carYear = "Car year is required";
    if (!formData.licensePlate.trim()) newErrors.licensePlate = "License plate is required";
    if (!formData.serviceType) newErrors.serviceType = "Service type is required";
    if (!formData.preferredDate) newErrors.preferredDate = "Preferred date is required";
    if (!formData.preferredTime) newErrors.preferredTime = "Preferred time is required";
    if (!formData.termsAccepted) newErrors.termsAccepted = "You must accept the terms and conditions";

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
        const response = await axios.post("http://localhost:8000/api/book-service", formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          toast.success("Service Booked Successfully! We'll contact you shortly.");
          console.log("Form submitted:", formData);
          // Optionally reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            carMake: "",
            carModel: "",
            carYear: "",
            licensePlate: "",
            serviceType: "",
            preferredDate: "",
            preferredTime: "",
            additionalServices: [],
            notes: "",
            termsAccepted: false,
          });
          setActiveTab(0);
        } else {
          toast.error("Failed to book service. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  const canProceed = () => {
    if (activeTab === 0)
      return formData.firstName && formData.lastName && formData.email && formData.phone;
    if (activeTab === 1)
      return formData.carMake && formData.carModel && formData.carYear && formData.licensePlate;
    return true;
  };

  const renderInput = (label, id, type = "text") => (
    <div className="space-y-2">
      <label htmlFor={id} className="text-slate-700 font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={formData[id]}
        onChange={(e) => handleInputChange(id, e.target.value)}
        className={`w-full h-12 px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
        {["Personal Info", "Vehicle Info", "Service Info"].map((label, idx) => (
          <div
            key={idx}
            className={`flex-1 py-4 px-6 text-center cursor-pointer ${
              activeTab === idx ? "bg-[#013566] text-white" : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => (idx <= activeTab && canProceed() ? setActiveTab(idx) : null)}
          >
            <div className="text-sm font-medium">Step {idx + 1}</div>
            <div className="text-base font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white p-6 max-w-3xl mx-auto mt-6 space-y-6">
        {/* Step 1 */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <h2 className="!text-lg font-semibold text-[#013566]">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("First Name *", "firstName")}
              {renderInput("Last Name *", "lastName")}
              {renderInput("Email *", "email", "email")}
              {renderInput("Phone *", "phone", "tel")}
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
            <h2 className="!text-lg font-semibold text-[#013566]">Vehicle Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Car Make *", "carMake")}
              {renderInput("Car Model *", "carModel")}
              {renderInput("Car Year *", "carYear")}
              {renderInput("License Plate *", "licensePlate")}
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
            <h2 className="!text-lg font-semibold text-[#013566]">Service Details</h2>
            {renderInput("Service Type *", "serviceType")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput("Preferred Date *", "preferredDate", "date")}
              {renderInput("Preferred Time *", "preferredTime", "time")}
            </div>

            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Additional Services</label>
              <div className="flex flex-wrap gap-4">
                {["Car Wash", "Interior Cleaning", "Tire Rotation", "Battery Check"].map(
                  (service) => (
                    <label key={service} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.additionalServices.includes(service)}
                        onChange={(e) =>
                          handleInputChange(
                            "additionalServices",
                            e.target.checked
                              ? [...formData.additionalServices, service]
                              : formData.additionalServices.filter((s) => s !== service)
                          )
                        }
                      />
                      {service}
                    </label>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => handleInputChange("termsAccepted", e.target.checked)}
              />
              <span className="text-sm">
                I agree to the{" "}
                <a href="#" className="text-blue-600 underline">
                  terms & conditions
                </a>
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
