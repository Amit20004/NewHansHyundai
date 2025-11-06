"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function FindMorePanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentLocationIndex, setCurrentLocationIndex] = useState(0);
  const [animateLocation, setAnimateLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    enquiryType: "",
    model: "",
    location: "",
    agreeToMarketing: false
  });
  const [isModelDropdownEnabled, setIsModelDropdownEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captchaValue, setCaptchaValue] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [captchaNum1, setCaptchaNum1] = useState(0);
  const [captchaNum2, setCaptchaNum2] = useState(0);

  const enquiryTypes = ["New Car", "Service", "Insurance", "Used Car"];
  const carModels = [
    "Hyundai Accent", "Hyundai Aura", "Hyundai Elantra", "Hyundai Ioniq 6",
    "Hyundai Sonata", "Hyundai Verna", "Hyundai i10", "Hyundai i20", "Hyundai i30",
    "Hyundai Creta", "Hyundai Alcazar", "Hyundai Tucson", "Hyundai Santa Fe",
    "Hyundai Palisade", "Hyundai Kona", "Hyundai Kona Electric", "Hyundai Ioniq 5",
    "Hyundai Ioniq 9", "Hyundai Santa Cruz", "Hyundai Veloster N", "Hyundai Nexo"
  ];

  // Generate captcha on component mount and when form opens
  useEffect(() => {
    generateCaptcha();
  }, [isOpen]);

  // Fetch locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/locations');
        if (response.data.success) {
          setLocations(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching locations", error);
        toast.error("Failed to load locations");
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  // Set up location rotation animation
  useEffect(() => {
    if (locations.length > 1) {
      const interval = setInterval(() => {
        setAnimateLocation(true);
        setTimeout(() => {
          setCurrentLocationIndex((prevIndex) => 
            (prevIndex + 1) % locations.length
          );
          setAnimateLocation(false);
        }, 500); // Half of the animation duration
      }, 3000); // Change every 3 seconds

      return () => clearInterval(interval);
    }
  }, [locations]);

  // Generate captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    setCaptchaNum1(num1);
    setCaptchaNum2(num2);
    setCaptchaValue(`${num1 + num2}`);
    setUserCaptchaInput("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "enquiryType" ? { location: "" } : {}) // reset location
    }));

    if (name === "enquiryType") {
      // Enable model dropdown only for relevant enquiry types
      const shouldEnableModel = 
        value === "New Car" || value === "Used Car" || value === "Service" || value === "Insurance";
      setIsModelDropdownEnabled(shouldEnableModel);
      
      // Clear model selection if disabling the dropdown
      if (!shouldEnableModel) {
        setFormData(prev => ({ ...prev, model: "" }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate captcha
    if (userCaptchaInput !== captchaValue) {
      toast.error("Incorrect captcha answer");
      setIsSubmitting(false);
      generateCaptcha();
      return;
    }
    
    // Validate required fields
    if (!formData.name || !formData.email || !formData.contactNumber || !formData.enquiryType) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }
    
    // Only validate model if the dropdown is enabled
    if (isModelDropdownEnabled && !formData.model) {
      toast.error("Please select a model");
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.agreeToMarketing) {
      toast.error("Please agree to receive communications");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:8000/api/side-form-enquiry", {
        name: formData.name,
        email: formData.email,
        contact_number: formData.contactNumber,
        enquiry_type: formData.enquiryType,
        model: formData.model,
        location: formData.location,
        agree_to_marketing: formData.agreeToMarketing
      });
      
      toast.success(res.data.message || "Enquiry submitted successfully");
      setFormData({
        name: "",
        email: "",
        contactNumber: "",
        enquiryType: "",
        model: "",
        location: "",
        agreeToMarketing: false
      });
      setIsModelDropdownEnabled(false);
      setIsOpen(false);
      generateCaptcha();
    } catch (error) {
      console.error("Error submitting enquiry form", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Navbar Button */}
      <button 
        onClick={() => setIsOpen(true)} 
        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
      >
        Make Enquiry Now
      </button>

      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Dark Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible" 
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sliding Panel - Made narrower to match reference image */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header with brand name and close button */}
        <div className="p-3 flex justify-between items-center sticky top-0 bg-white z-10 border-b">
          <div className="text-lg font-bold text-blue-800">HANS HYUNDAI</div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-800 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Panel Content */}
        <div className="flex flex-col w-full mx-auto bg-white p-4">
          {/* Form Section */}
          <div className="w-full">
            <h2 className="!text-lg font-bold text-blue-900  text-left">
              ENQUIRE NOW
            </h2>
            {/* Location display with animation */}
              <h3 className="!text-sm">Our Locations</h3>

          {locations.length > 0 && (
            <div className="text-left mb-2 overflow-hidden h-8">
              <div 
                className={`text-sm text-gray-600 transition-opacity duration-500 ${
                  animateLocation ? "opacity-0" : "opacity-100"
                }`}
              >
                {locations[currentLocationIndex]?.address}
              </div>
            </div>
          )}
            <form onSubmit={handleSubmit} className="space-y-2 absolute bottom-10">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Full Name *"
                  className="w-full px-3 py-2 text-xs border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address *"
                  className="w-full px-3 py-2 text-xs border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Contact Number */}
              <div>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  placeholder="Phone Number *"
                  className="w-full px-3 py-2 text-xs border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Enquiry Type */}
              <div>
                <select
                  name="enquiryType"
                  value={formData.enquiryType}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 text-black focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select Enquiry Type *</option>
                  {enquiryTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Model Selection (always visible but conditionally disabled) */}
              <div>
                <select
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  disabled={!isModelDropdownEnabled}
                  className={`w-full px-3 py-2 text-xs border border-gray-300 text-black focus:border-blue-500 focus:outline-none ${
                    !isModelDropdownEnabled ? "bg-gray-100 text-gray-500" : ""
                  }`}
                  required={isModelDropdownEnabled}
                >
                  <option value="">Select a Model {isModelDropdownEnabled ? "*" : ""}</option>
                  {carModels.map((model, index) => (
                    <option key={index} value={model}>{model}</option>
                  ))}
                </select>
              </div>

              {/* Location Selection */}
              <div>
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 text-xs border border-gray-300 text-black focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select a Location *</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location.address}>{location.address}</option>
                  ))}
                </select>
              </div>

              {/* Captcha */}
              <div className="flex items-center space-x-2 pt-1">
                <div className="flex items-center bg-gray-100 px-2 py-1 text-sm font-mono">
                  {captchaNum1} + {captchaNum2} =
                </div>
                <input
                  type="text"
                  value={userCaptchaInput}
                  onChange={(e) => setUserCaptchaInput(e.target.value.replace(/\D/, ''))}
                  placeholder="Answer"
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 text-black placeholder-gray-500 focus:border-blue-500 focus:outline-none"
                  required
                />
                <button 
                  type="button" 
                  onClick={generateCaptcha}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  ↻
                </button>
              </div>

              {/* Checkbox */}
              <div className="flex items-start pt-1">
                <input
                  type="checkbox"
                  id="agreeToMarketing"
                  name="agreeToMarketing"
                  checked={formData.agreeToMarketing}
                  onChange={handleInputChange}
                  className="mt-1 mr-2"
                  required
                />
                <label htmlFor="agreeToMarketing" className="text-xs text-gray-700">
                  I agree to receive calls, e-mail, WhatsApp messages, and SMS from HANS HYUNDAI.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-semibold transition-colors duration-300 disabled:bg-gray-400 mt-2"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}