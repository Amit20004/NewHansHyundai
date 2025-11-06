'use client';
import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast"; // <-- import toast
// import Btn from "../../components/ui/Button";
import './Contact.css';

const Index = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/api/contact", formData);
      toast.success(res.data.message || "Message sent successfully");
      setFormData({ email: "", name: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full mx-auto bg-[#ffffff] mb-5">
      {/* Toast container */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* Left Form Section */}
      <div className="w-full lg:w-[40%] contactWrapper bg-white px-6 sm:px-10 py-3 sm:py-12 relative left-20">
        <div className="mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black mb-4 tracking-wide">
            CONTACT US
          </h1>
          {/* <p className="text-gray-700 text-base md:text-lg mb-4 leading-relaxed">
            Sample text. Click to select the text box. Click again or double click to start editing the text.
          </p> */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="email"
                name="email"
                placeholder="Enter a valid email address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border !text-sm border-gray-300 text-black !placeholder-gray-700 focus:border-black focus:outline-none"
                required
              />
              <input
                type="text"
                name="name"
                placeholder="Enter your Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border !text-sm border-gray-300 text-black !placeholder-gray-700 focus:border-black focus:outline-none"
                required
              />
            </div>
            <textarea
              name="message"
              placeholder="Enter your message"
              value={formData.message}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border !text-sm border-gray-300 text-black !placeholder-gray-700 focus:border-black focus:outline-none resize-none"
              required
            />
            <button
              type="submit"
              className="bg-[#013566] cursor-pointer text-white px-6 py-2 font-semibold disabled:bg-gray-400"
            >
              Submit
            </button>          
          </form>
        </div>
      </div>

      {/* Right Map Section */}
      <div className="hidden mapSection lg:flex w-full lg:w-1/2 max-w-[190rem] h-[350px] mt-4 lg:mt-0 relative top-20 left-35">
        <iframe
          src="https://www.google.com/maps/embed?pb=..."
          width="100%"
          height="100%"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Bottom Black Bar */}
      <div className="hidden lg:flex w-full max-w-[17rem] bg-black text-white justify-center bottomBlackBar  py-4"></div>
    </div>
  );
};

export default Index;
