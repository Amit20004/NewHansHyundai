'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import '../../(pages)/contact-us/Contact.css';

const AccessoryForm = ({ selectedProduct }) => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    message: ""
  });
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/car-accessories");
        setProducts(res.data.data || []);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Failed to load products");
      }
    };
    fetchProducts();
  }, []);

  // Update form when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        productId: selectedProduct.id.toString()
      }));
    }
  }, [selectedProduct]);

  const currentProduct = products.find(p => p.id.toString() === formData.productId);

  const handleProductChange = (productId) => {
    setFormData(prev => ({ ...prev, productId }));
    setIsSelectOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/enquiries", formData);
      toast.success(res.data.message || "Enquiry submitted successfully!");
      setFormData({
        productId: "",
        customerName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        pincode: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting enquiry form", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full mx-auto bg-[#ffffff]">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Left Form Section */}
      <div className="w-full lg:w-[60%] contactWrapper bg-white px-6 sm:px-10 py-3 sm:py-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4 tracking-wide">
          PRODUCT ENQUIRY
        </h1>
        <p className="text-gray-700 text-base md:text-lg mb-4 leading-relaxed">
          Fill out the form below to enquire about our products. We&apos;ll get back to you with detailed information and pricing.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="w-full px-4 py-3 border border-gray-300 text-left text-black placeholder-gray-400 focus:border-black focus:outline-none"
              >
                {formData.productId
                  ? products.find(p => p.id.toString() === formData.productId)?.name +
                    " - " +
                    products.find(p => p.id.toString() === formData.productId)?.model
                  : "Select a product"}
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  ▼
                </span>
              </button>
              {isSelectOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-lg max-h-60 overflow-auto">
                  {products.map(product => (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => handleProductChange(product.id.toString())}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-none bg-transparent cursor-pointer"
                    >
                      {product.name} - {product.model}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              name="customerName"
              placeholder="Enter your Name"
              value={formData.customerName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 text-black placeholder-gray-400 focus:border-black focus:outline-none"
              required
            />
          </div>

          {/* Other form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 text-black" required />
            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 text-black" required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 text-black" required />
            <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 text-black" />
          </div>
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="w-full px-4 py-3 border border-gray-300 text-black" />
          <textarea name="message" placeholder="Message" value={formData.message} onChange={handleInputChange} rows={5} className="w-full px-4 py-3 border border-gray-300 text-black resize-none" />

          <button type="submit" className="bg-[#013566] text-white px-6 py-3 font-semibold disabled:bg-gray-400">
            Submit
          </button>
        </form>
      </div>

      {/* Right Product Details Section */}
      <div className="w-full lg:w-[40%] bg-gray-50 p-6 flex items-center justify-center mt-4 lg:mt-0">
        {currentProduct ? (
          <div className="w-full max-w-md">
            <div className=" relative mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={currentProduct.image_url || "/placeholder.svg"}
                alt={currentProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold text-black mb-4">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Name</span>
                  <span className="text-gray-900">{currentProduct.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Model</span>
                  <span className="text-gray-900">{currentProduct.model}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-600">Category</span>
                  <span className="text-gray-900">{currentProduct.category}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="font-medium text-gray-600">Availability</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border 
                      ${currentProduct.availability?.toLowerCase() === "yes" 
                        ? "text-green-600 border-green-600 bg-green-100" 
                        : "text-red-600 border-red-600 bg-red-100"
                      }`}
                  >
                    {currentProduct.availability?.toLowerCase() === "yes" 
                      ? "Stock Available" 
                      : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md text-center">
            <div className="aspect-square bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
              <span className="text-gray-500">Select a product to view details</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessoryForm;
