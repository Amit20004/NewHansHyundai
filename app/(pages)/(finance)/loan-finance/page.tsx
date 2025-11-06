"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner"
import axios from "axios"

interface CarLogo {
  id: number
  name: string
  category: string
  image: string
}

interface FormData {
  // Car selection
  selectedCar: string
  carVariant: string
  carColor: string

  // Loan details
  loanAmount: string
  loanDuration: string
  employmentType: string
  annualIncome: string
  timeFrame: string

  // Personal details
  title: string
  name: string
  email: string
  mobile: string
  panNo: string
  address1: string
  address2: string
  city: string
  area: string
  pincode: string
  agreeTerms: boolean
  errors: {
    name: string
    email: string
    mobile: string
    panNo: string
    address1: string
    pincode: string
  }
}

// ---------- REUSABLE INPUTS ----------
const CustomSelect = ({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-12 px-4 bg-white border border-gray-300 rounded-none appearance-none text-gray-700 font-medium text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
  </div>
)

const CustomInput = ({
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  error = "",
}: {
  value: string
  onChange: (value: string) => void
  placeholder: string
  type?: string
  required?: boolean
  error?: string
}) => (
  <div className="w-full">
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full h-12 px-4 bg-white border border-gray-300 text-gray-700 text-sm focus:outline-none focus:border-gray-400 focus:ring-0"
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
)

export default function LoanInquiryPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    selectedCar: "",
    carVariant: "",
    carColor: "",
    loanAmount: "",
    loanDuration: "",
    employmentType: "",
    annualIncome: "",
    timeFrame: "",
    title: "",
    name: "",
    email: "",
    mobile: "",
    panNo: "",
    address1: "",
    address2: "",
    city: "",
    area: "",
    pincode: "",
    agreeTerms: false,
    errors: {
      name: "",
      email: "",
      mobile: "",
      panNo: "",
      address1: "",
      pincode: "",
    },
  })

  const [carLogos, setCarLogos] = useState<CarLogo[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")

  // Fetch car logos from backend
  useEffect(() => {
    const fetchCarLogos = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/car-logos")
        if (res.data.success) {
          setCarLogos(res.data.data)
          if (res.data.data.length > 0) {
            setActiveCategory(res.data.data[0].category) // default first category
          }
        }
      } catch (error) {
        console.error("Error fetching car logos:", error)
      }
    }
    fetchCarLogos()
  }, [])

  const validateField = (field: string, value: string) => {
    let error = ""
    switch (field) {
      case "name":
        if (!value.trim()) error = "Please enter name"
        break
      case "email":
        if (!value.trim()) error = "Please enter email"
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Please enter valid email"
        break
      case "mobile":
        if (!value.trim()) error = "Please enter mobile number"
        break
      case "panNo":
        if (!value.trim()) error = "Please enter PAN number"
        break
      case "address1":
        if (!value.trim()) error = "Please enter address"
        break
      case "pincode":
        if (!value.trim()) error = "Please enter pincode"
        break
    }

    setFormData((prev) => ({
      ...prev,
      errors: { ...prev.errors, [field]: error },
    }))
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (typeof value === "string" && field !== "agreeTerms") {
      validateField(field as string, value)
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/loan-enquiry", {
        selectedCar: formData.selectedCar,
        carVariant: formData.carVariant,
        carColor: formData.carColor,
        loanAmount: formData.loanAmount,
        loanDuration: formData.loanDuration,
        employmentType: formData.employmentType,
        annualIncome: formData.annualIncome,
        timeFrame: formData.timeFrame,
        title: formData.title,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        panNo: formData.panNo,
        address1: formData.address1,
        address2: formData.address2,
        city: formData.city,
        area: formData.area,
        pincode: formData.pincode,
      })

      if (response.data.success) {
        alert("Loan enquiry submitted successfully!")
        setFormData({
          selectedCar: "",
          carVariant: "",
          carColor: "",
          loanAmount: "",
          loanDuration: "",
          employmentType: "",
          annualIncome: "",
          timeFrame: "",
          title: "",
          name: "",
          email: "",
          mobile: "",
          panNo: "",
          address1: "",
          address2: "",
          city: "",
          area: "",
          pincode: "",
          agreeTerms: false,
          errors: {
            name: "",
            email: "",
            mobile: "",
            panNo: "",
            address1: "",
            pincode: "",
          },
        })
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("There was an error submitting your inquiry. Please try again.")
    }
  }

  const canProceedToNext = () => {
    if (activeTab === 0) {
      return formData.selectedCar !== ""
    }
    if (activeTab === 1) {
      return (
        formData.loanAmount &&
        formData.loanDuration &&
        formData.employmentType &&
        formData.annualIncome &&
        formData.timeFrame
      )
    }
    return true
  }

  // Extract categories
  const categories = Array.from(new Set(carLogos.map((c) => c.category)))

  return (
    <div className="min-h-screen bg-white w-full max-w-[1400px] mx-auto">
      <ResponsiveBanner />

      {/* Step Tabs */}
      <div className="flex">
        {["Choose your Car", "Loan Details", "Personal Details"].map((label, i) => (
          <div
            key={i}
            className={`flex-1 py-4 px-6 text-center cursor-pointer ${
              activeTab === i ? "bg-[#013566] text-white" : "bg-gray-200 text-gray-600"
            }`}
            onClick={() => (i <= activeTab ? setActiveTab(i) : null)}
          >
            <div className="text-sm font-medium">Step {i + 1}</div>
            <div className="text-base font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="p-2 max-w-7xl mx-auto w-full">
        {/* Step 1: Car Logos */}
        {activeTab === 0 && (
          <div>
            {/* Category Tabs */}
            <div className="flex space-x-4  mb-6">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeCategory === cat
                      ? "border-b-2 border-[#013566] text-[#013566]"
                      : "text-gray-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Cars Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {carLogos
                .filter((car) => car.category === activeCategory)
                .map((car) => (
                  <div
                    key={car.id}
                    className={` cursor-pointer flex flex-col items-center p-3 transition-all ${
                      formData.selectedCar === car.name.toString()
                        ? " bg-blue-100"
                        : ""
                    }`}
                    onClick={() => handleInputChange("selectedCar", car.name.toString())}
                  >
                    <Image
                      src={`http://localhost:8000/${car.image}`}
                      alt={car.name}
                      width={200}
                      height={200}
                      className="object-contain "
                    />
                    <h3 className="font-semibold !text-sm text-gray-800">{car.name}</h3>
                  </div>
                ))}
            </div>

            {formData.selectedCar && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setActiveTab(1)}
                  className="bg-[#013566] text-white px-8 py-3 font-semibold hover:bg-red-700 transition-colors"
                >
                  NEXT
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Loan Details */}
        {activeTab === 1 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <CustomInput
                value={formData.loanAmount}
                onChange={(v) => handleInputChange("loanAmount", v)}
                placeholder="Loan Amount"
                type="number"
              />
              <CustomSelect
                value={formData.loanDuration}
                onChange={(v) => handleInputChange("loanDuration", v)}
                placeholder="Loan Duration"
                options={[
                  { value: "1", label: "1 Year" },
                  { value: "2", label: "2 Years" },
                  { value: "3", label: "3 Years" },
                  { value: "4", label: "4 Years" },
                  { value: "5", label: "5 Years" },
                ]}
              />
              <CustomSelect
                value={formData.employmentType}
                onChange={(v) => handleInputChange("employmentType", v)}
                placeholder="Employment Type"
                options={[
                  { value: "salaried", label: "Salaried" },
                  { value: "self-employed", label: "Self Employed" },
                ]}
              />
              <CustomInput
                value={formData.annualIncome}
                onChange={(v) => handleInputChange("annualIncome", v)}
                placeholder="Annual Income"
                type="number"
              />
              <CustomSelect
                value={formData.timeFrame}
                onChange={(v) => handleInputChange("timeFrame", v)}
                placeholder="Purchase Time Frame"
                options={[
                  { value: "immediately", label: "Immediately" },
                  { value: "1-3 months", label: "1-3 Months" },
                  { value: "3-6 months", label: "3-6 Months" },
                  { value: "6+ months", label: "6+ Months" },
                ]}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setActiveTab(0)}
                className="bg-gray-500 text-white px-8 py-3 font-semibold hover:bg-gray-600 transition-colors"
              >
                BACK
              </button>
              <button
                onClick={() => setActiveTab(2)}
                disabled={!canProceedToNext()}
                className="bg-[#013566] text-white px-8 py-3 font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                NEXT
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Details */}
        {activeTab === 2 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <CustomSelect
                value={formData.title}
                onChange={(v) => handleInputChange("title", v)}
                placeholder="Title"
                options={[
                  { value: "mr", label: "Mr" },
                  { value: "mrs", label: "Mrs" },
                  { value: "ms", label: "Ms" },
                ]}
              />
              <CustomInput
                value={formData.name}
                onChange={(v) => handleInputChange("name", v)}
                placeholder="Full Name"
                required
                error={formData.errors.name}
              />
              <CustomInput
                value={formData.email}
                onChange={(v) => handleInputChange("email", v)}
                placeholder="Email"
                type="email"
                required
                error={formData.errors.email}
              />
              <CustomInput
                value={formData.mobile}
                onChange={(v) => handleInputChange("mobile", v)}
                placeholder="Mobile"
                required
                error={formData.errors.mobile}
              />
              <CustomInput
                value={formData.panNo}
                onChange={(v) => handleInputChange("panNo", v)}
                placeholder="PAN Number"
                required
                error={formData.errors.panNo}
              />
              <CustomInput
                value={formData.address1}
                onChange={(v) => handleInputChange("address1", v)}
                placeholder="Address Line 1"
                required
                error={formData.errors.address1}
              />
              <CustomInput
                value={formData.address2}
                onChange={(v) => handleInputChange("address2", v)}
                placeholder="Address Line 2"
              />
              <CustomInput
                value={formData.city}
                onChange={(v) => handleInputChange("city", v)}
                placeholder="City"
              />
              <CustomInput
                value={formData.area}
                onChange={(v) => handleInputChange("area", v)}
                placeholder="Area"
              />
              <CustomInput
                value={formData.pincode}
                onChange={(v) => handleInputChange("pincode", v)}
                placeholder="Pincode"
                required
                error={formData.errors.pincode}
              />
            </div>

            <div className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-600">
                I agree to the terms and conditions
              </span>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setActiveTab(1)}
                className="bg-gray-500 text-white px-8 py-3 font-semibold hover:bg-gray-600 transition-colors"
              >
                BACK
              </button>
              <button
                onClick={handleSubmit}
                disabled={!formData.agreeTerms}
                className="bg-[#013566] text-white px-8 py-3 font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
