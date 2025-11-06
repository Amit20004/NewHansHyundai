"use client";
import React, { useState, useEffect, useRef } from "react";
import { Car, AlertCircle, ChevronDown } from "lucide-react";
import AnimatedButton from "./AnimatedButton";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  location: string;
  carType: string;
  carModel: string;
  registrationNumber: string;
  message: string;
}

interface FormErrors {
  name: string;
  mobile: string;
  email: string;
  location: string;
  carModel: string;
  registrationNumber: string;
}

const CarEnquiryForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    location: "",
    carType: "",
    carModel: "",
    registrationNumber: "",
    message: "",
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    mobile: "",
    email: "",
    location: "",
    carModel: "",
    registrationNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"new" | "used" | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const carModels = {
    Hatchback: ["Grand i10 NIOS", "i20", "Swift", "Baleno"],
    SUV: ["Creta", "Venue", "Vitara Brezza", "XUV300"],
    Sedan: ["Verna", "City", "Ciaz", "Amaze"],
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (formRef.current) {
      observer.observe(formRef.current);
    }
    return () => {
      if (formRef.current) {
        observer.unobserve(formRef.current);
      }
    };
  }, []);

  const validateField = (name: keyof FormErrors, value: string): string => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        break;
      case "mobile":
        if (!value.trim()) return "Mobile number is required";
        if (!/^\d{10}$/.test(value)) return "Mobile must be 10 digits";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Invalid email format";
        break;
      case "location":
        if (!value.trim()) return "Location is required";
        break;
      case "carModel":
        if (!value.trim()) return "Car model is required";
        break;
      case "registrationNumber":
        if (formData.carType === "used" && !value.trim())
          return "Registration number is required";
        break;
      default:
        break;
    }
    return "";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof FormErrors]) {
      const error = validateField(name as keyof FormErrors, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleCarTypeChange = (type: "new" | "used") => {
    setActiveTab(type);
    setFormData((prev) => ({
      ...prev,
      carType: type,
      carModel: "",
      registrationNumber: "",
    }));
    setErrors((prev) => ({
      ...prev,
      carModel: "",
      registrationNumber: "",
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormErrors, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      name: validateField("name", formData.name),
      mobile: validateField("mobile", formData.mobile),
      email: validateField("email", formData.email),
      location: validateField("location", formData.location),
      carModel: validateField("carModel", formData.carModel),
      registrationNumber: validateField("registrationNumber", formData.registrationNumber),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-sm shadow-lg z-50 transition-all duration-300 transform ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    } animate-[toast-in_0.3s_ease-out_forwards]`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('animate-[toast-out_0.3s_ease-in_forwards]');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.carType) {
      showToast("Please select whether you're interested in a new or used car.", 'error');
      return;
    }
    if (validateForm()) {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showToast("Form submitted successfully! We'll get back to you within 24 hours.");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        location: "",
        carType: "",
        carModel: "",
        registrationNumber: "",
        message: "",
      });
      setIsSubmitting(false);
    } else {
      showToast("Please fix the errors and try again.", 'error');
    }
  };

  return (
    <section id="contact" className="relative py-20 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Animated heading */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
        }`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent ">
            Find Your Dream Car
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Fill out the form below and our experts will help you find the perfect vehicle for your needs.
          </p>
        </div>

        {/* Wavy container */}
        <div 
          ref={formRef}
          className={`relative  overflow-hidden shadow-2xl transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        >
          <div className="relative z-10">
            <div className="grid lg:grid-cols-5">
              {/* Form section (40%) */}
              <div className="lg:col-span-2 bg-gray-400 p-8 md:p-12">
                <h3 className="text-2xl font-bold mb-6 text-white">
                  Car Enquiry Form
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4">
                    <div className="transition-all duration-300 delay-100">
                      <label htmlFor="name" className="block text-sm font-medium mb-1 text-white/90">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-sm bg-gray-50 border ${
                          errors.name ? "border-red-500" : "border-blue-500/30"
                        } focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-700 transition-all duration-300`}
                        placeholder="Enter your name"
                      />
                      {errors.name && (
                        <div className="flex items-center gap-1 text-red-300 text-sm mt-1 animate-[fade-in_0.3s_ease-out]">
                          <AlertCircle className="w-4 h-4" />
                          {errors.name}
                        </div>
                      )}
                    </div>

                    <div className="transition-all duration-300 delay-150">
                      <label htmlFor="email" className="block text-sm font-medium mb-1 text-white/90">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-sm bg-gray-50 border ${
                          errors.email ? "border-red-500" : "border-blue-500/30"
                        } focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-700 transition-all duration-300`}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <div className="flex items-center gap-1 text-red-300 text-sm mt-1 animate-[fade-in_0.3s_ease-out]">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 transition-all duration-300 delay-200">
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium mb-1 text-white/90">
                        Mobile *
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        maxLength={10}
                        className={`w-full px-4 py-3 rounded-sm bg-gray-50 border ${
                          errors.mobile ? "border-red-500" : "border-blue-500/30"
                        } focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-700 transition-all duration-300`}
                        placeholder="10-digit number"
                      />
                      {errors.mobile && (
                        <div className="flex items-center gap-1 text-red-300 text-sm mt-1 animate-[fade-in_0.3s_ease-out]">
                          <AlertCircle className="w-4 h-4" />
                          {errors.mobile}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="location" className="block text-sm font-medium mb-1 text-white/90">
                        Location *
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-sm bg-gray-50 border ${
                          errors.location ? "border-red-500" : "border-blue-500/30"
                        } focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-700 transition-all duration-300`}
                        placeholder="Your city"
                      />
                      {errors.location && (
                        <div className="flex items-center gap-1 text-red-300 text-sm mt-1 animate-[fade-in_0.3s_ease-out]">
                          <AlertCircle className="w-4 h-4" />
                          {errors.location}
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-white/90">
                        Car Type *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["new", "used"].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => handleCarTypeChange(type as "new" | "used")}
                            className={`p-3 rounded-sm border transition-all duration-300 ${
                              activeTab === type
                                ? "border-red-500 bg-gray-50  shadow-md"
                                : "border-blue-500/30 bg-gray-50 hover:border-white/50"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <Car className="w-4 h-4" />
                              <span className="font-medium text-sm capitalize text-gray-700">
                                {type === "new" ? "New" : "Used"}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {formData.carType === "new" && (
                    <div className={`transition-all duration-500 delay-300 ${
                      formData.carType === "new" ? "animate-[fade-in_0.5s_ease-out]" : ""
                    }`}>
                      <label htmlFor="carModel" className="block text-sm font-medium mb-1 text-white/90">
                        Car Model *
                      </label>
                      <div className="relative">
                        <select
                          id="carModel"
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleChange}
                          className={`w-full px-4 py-3 rounded-sm bg-gray-50 border ${
                            errors.carModel ? "border-red-500" : "border-blue-500/30"
                          } focus:outline-none focus:ring-2 focus:ring-white text-white appearance-none transition-all duration-300`}
                        >
                          <option value="" className="text-gray-700">Select a car model</option>
                          {Object.entries(carModels).map(([category, models]) => (
                            <optgroup key={category} label={category} className="text-gray-700">
                              {models.map((model) => (
                                <option key={model} value={model} className="text-gray-700">
                                  {model}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/70" />
                      </div>
                      {errors.carModel && (
                        <div className="flex items-center gap-1 text-red-300 text-sm mt-1 animate-[fade-in_0.3s_ease-out]">
                          <AlertCircle className="w-4 h-4" />
                          {errors.carModel}
                        </div>
                      )}
                    </div>
                  )}

                  {formData.carType === "used" && (
                    <div className={`transition-all duration-500 delay-300 ${
                      formData.carType === "used" ? "animate-[fade-in_0.5s_ease-out]" : ""
                    }`}>
                      <label htmlFor="registrationNumber" className="block text-sm font-medium mb-1 text-white/90">
                        Registration Number *
                      </label>
                      <input
                        type="text"
                        id="registrationNumber"
                        name="registrationNumber"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-sm bg-gray-50 border ${
                          errors.registrationNumber ? "border-red-500" : "border-blue-500/30"
                        } focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-700 transition-all duration-300`}
                        placeholder="e.g., MH12AB1234"
                      />
                      {errors.registrationNumber && (
                        <div className="flex items-center gap-1 text-red-300 text-sm mt-1 animate-[fade-in_0.3s_ease-out]">
                          <AlertCircle className="w-4 h-4" />
                          {errors.registrationNumber}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="transition-all duration-300 delay-500">
                    <label htmlFor="message" className="block text-sm font-medium mb-1 text-white/90">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-sm bg-gray-50 border border-blue-500/30 focus:outline-none focus:ring-2 focus:ring-white text-white placeholder-gray-700 transition-all duration-300"
                      placeholder="Your message here..."
                      rows={3}
                    ></textarea>
                  </div>

                  <div className="transition-all duration-300 delay-700 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2 py-3 px-6 rounded-sm bg-white/90 text-blue-600">
                          <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                       <div className="relative ">
                                     <AnimatedButton
                                       text="Find a Nearest Center"
                                       href="#"
                                       bgColor="#2563eb"
                                       hoverShadow="#fbbf24"
                                       textColor="#fff"
                                       fontSize="1rem"
                                       padding="8px 10px"
                                     />
                                   </div>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Image section (60%) */}
              <div className="lg:col-span-3 hidden lg:block relative h-full min-h-[500px]">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                  style={{
                    backgroundImage: "url('https://www.hdcarwallpapers.com/walls/hyundai_vision_t_concept_2019_4k_6-HD.jpg')"
                  }}
                ></div>
                <div className="absolute inset-0 "></div>
                
                {/* Overlay content */}
            
              </div>
            </div>
          </div>

          {/* Wavy shape divider */}
          <div className="absolute top-0 left-1/3 w-2/3 h-full z-0">
            <svg 
              viewBox="0 0 500 500" 
              preserveAspectRatio="none" 
              className="w-full h-full"
            >
              <path 
                d="M0,100 C150,200 350,0 500,100 L500,00 L0,0 Z" 
                className="fill-blue-600"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      {/* Add custom animations to tailwind.config.js */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes toast-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes toast-out {
          from { opacity: 1; transform: translateX(0); }
          to { opacity: 0; transform: translateX(20px); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </section>
  );
};

export default CarEnquiryForm;