"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function BookServiceTabs() {
  const [activeTab, setActiveTab] = useState(0);

  const [formData, setFormData] = useState({
    salutation: "Mr.",
    name: "",
    email: "",
    mobile: "",
    otp: "",
    model: "",
    state: "",
    city: "",
    dealer: "",
    comments: "",
    termsAccepted: false,
  });

  // const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile number is required";
    if (!formData.otp.trim()) newErrors.otp = "OTP is required";
    if (activeTab === 1) {
      if (!formData.model) newErrors.model = "Model is required";
      if (!formData.state) newErrors.state = "State is required";
      if (!formData.city) newErrors.city = "City is required";
      if (!formData.dealer) newErrors.dealer = "Dealer is required";
    }
    if (activeTab === 2) {
      if (!formData.termsAccepted)
        newErrors.termsAccepted = "You must accept the terms";
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

  // Send OTP
  const sendOtp = async () => {
    if (!formData.mobile.trim()) {
      toast.error("Please enter your mobile number first");
      return;
    }
    try {
      // Replace URL with your API endpoint
      const res = await axios.post("http://localhost:8000/api/send-otp", {
        mobile: formData.mobile,
      });
      if (res.status === 200) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error sending OTP");
    }
  };

  // Submit form
  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        // Replace URL with your API endpoint
        const response = await axios.post(
          "http://localhost:8000/api/test-drive",
          formData
        );

        if (response.status === 200) {
          toast.success("Form submitted successfully!");
          console.log("Form Data:", formData);

          // Reset form
          setFormData({
            salutation: "Mr.",
            name: "",
            email: "",
            mobile: "",
            otp: "",
            model: "",
            state: "",
            city: "",
            dealer: "",
            comments: "",
            termsAccepted: false,
          });
          setActiveTab(0);
          setOtpSent(false);
        } else {
          toast.error("Submission failed. Try again.");
        }
      } catch (error) {
        console.error("Submit error:", error);
        toast.error("Something went wrong.");
      }
    }
  };

  const canProceed = () => {
    if (activeTab === 0)
      return formData.name && formData.mobile && formData.otp;
    if (activeTab === 1)
      return formData.model && formData.state && formData.city && formData.dealer;
    return true;
  };

  const renderInput = (label, id, type = "text") => (
    <div className="space-y-2">
      <label htmlFor={id} className="text-slate-700 font-medium">
        {label}
      </label>
      <div className="flex gap-2">
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
        {extra}
      </div>
      {errors[id] && <p className="text-red-500 text-sm">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="bg-white py-4 w-full max-w-[1400px] mx-auto">
      <Toaster position="top-center" />

      {/* Tabs */}
      <div className="flex">
        {["Personal Info", "Vehicle & Location", "Comments"].map((label, idx) => (
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

      {/* Panels */}
      <div className="bg-white p-6 max-w-3xl mx-auto mt-6 space-y-6">
        {/* Step 1 */}
        {activeTab === 0 && (
          <div className="space-y-6">
            <h2 className="!text-lg font-semibold text-[#013566]">Personal Information</h2>

            {/* Salutation */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.salutation === "Mr."}
                  onChange={() => handleInputChange("salutation", "Mr.")}
                />
                Mr.
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={formData.salutation === "Ms."}
                  onChange={() => handleInputChange("salutation", "Ms.")}
                />
                Ms.
              </label>
            </div>

            {renderInput("Name *", "name")}
            {renderInput("Email", "email", "email")}
            {renderInput(
              "Mobile *",
              "mobile",
              "tel",
              true,
              <button
                type="button"
                onClick={sendOtp}
                className="bg-blue-600 text-white px-4 py-2"
              >
                Send OTP
              </button>
            )}
            {renderInput("Enter OTP *", "otp")}

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
            <h2 className="!text-lg font-semibold text-[#013566]">Vehicle & Location</h2>

            {/* Model */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Model Interested In *</label>
              <select
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className={`w-full h-12 border px-4 ${
                  errors.model ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select Model</option>
                <option value="New Creta">New Creta</option>
                <option value="i20">i20</option>
                <option value="Venue">Venue</option>
              </select>
              {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
            </div>

            {/* State */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">State *</label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className={`w-full h-12 border px-4 ${
                  errors.state ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select State</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">City *</label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className={`w-full h-12 border px-4 ${
                  errors.city ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select City</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
              </select>
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            {/* Dealer */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Dealer *</label>
              <select
                value={formData.dealer}
                onChange={(e) => handleInputChange("dealer", e.target.value)}
                className={`w-full h-12 border px-4 ${
                  errors.dealer ? "border-red-500" : "border-slate-300"
                }`}
              >
                <option value="">Select Dealer</option>
                <option value="Dealer 1">Dealer 1</option>
                <option value="Dealer 2">Dealer 2</option>
              </select>
              {errors.dealer && <p className="text-red-500 text-sm">{errors.dealer}</p>}
            </div>

            <div className="flex justify-between">
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
            <h2 className="!text-lg font-semibold text-[#013566]">Additional Comments</h2>

            {/* Comments */}
            <div className="space-y-2">
              <label className="text-slate-700 font-medium">Comments</label>
              <textarea
                value={formData.comments}
                onChange={(e) => handleInputChange("comments", e.target.value)}
                rows={4}
                className="w-full border px-4 py-2 border-slate-300"
                placeholder="Your comments..."
              ></textarea>
            </div>

            {/* Terms */}
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
