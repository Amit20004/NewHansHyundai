"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown, FiChevronUp, FiX } from "react-icons/fi";
import axios from "axios";
import Btn from "../../../components/ui/Button";
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner";
import AccessoryForm from "../../../components/form/AccessoryForm";
import ScrollFadeIn from "../../../components/scolling/ScrollFadIn";
import Image from "next/image";

const CarAccessoriesPage = () => {
  const [carAccessories, setCarAccessories] = useState([]);
  const [selectedModel, setSelectedModel] = useState("All Models");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [carModels, setCarModels] = useState(["All Models"]);
  const [categories, setCategories] = useState(["All Categories"]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formRef = useRef(null);

  const scrollToForm = (product) => {
    setSelectedProduct(product);
    setSelectedImage(product); // store the whole product for modal
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    const fetchAccessories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/car-accessories", {
          params: {
            model: selectedModel === "All Models" ? "" : selectedModel,
            category: selectedCategory === "All Categories" ? "" : selectedCategory,
          },
        });
        if (res.data.success) setCarAccessories(res.data.data);
      } catch (error) {
        console.error("Failed to fetch accessories:", error);
      }
    };

    const fetchModels = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/car-models");
        if (res.data.success) setCarModels(["All Models", ...res.data.data]);
      } catch (err) {
        console.error("Failed to fetch models:", err);
      }
    };

    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/car-accessory-categories");
        if (res.data.success) setCategories(["All Categories", ...res.data.data]);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchModels();
    fetchCategories();
    fetchAccessories();
  }, [selectedModel, selectedCategory]);

  const filteredAccessories = carAccessories.filter(
    (item) =>
      (selectedModel === "All Models" || item.model === selectedModel) &&
      (selectedCategory === "All Categories" || item.category === selectedCategory)
  );

  return (
    <>
      <ScrollFadeIn delay={0}>
        <ResponsiveBanner />
      </ScrollFadeIn>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[1397px]">
        {/* Dropdown for Models */}
        <ScrollFadeIn delay={0.1}>
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-md">
              <Dropdown
                label="Select Car Model"
                selected={selectedModel}
                options={carModels}
                show={showModelDropdown}
                setShow={setShowModelDropdown}
                onSelect={setSelectedModel}
              />
            </div>
          </div>
        </ScrollFadeIn>

        {/* Category Filter */}
        <ScrollFadeIn delay={0.2}>
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2  text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#013566] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </ScrollFadeIn>

        {/* Accessories Grid */}
        <ScrollFadeIn delay={0.3}>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory + selectedModel}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredAccessories.length > 0 ? (
                filteredAccessories.map((item) => (
                  <ProductCard
                    key={item._id || item.id}
                    item={item}
                    scrollToForm={scrollToForm}
                  />
                ))
              ) : (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="col-span-full text-center py-12"
                >
                  <p className="text-gray-500 text-lg">No accessories found for your filters.</p>
                  <button
                    onClick={() => {
                      setSelectedModel("All Models");
                      setSelectedCategory("All Categories");
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white  hover:bg-blue-700 transition"
                  >
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </ScrollFadeIn>
      </div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
              width={100} height={100} quality={100} unoptimized={true}
                src={selectedImage.image_url}
                alt={selectedImage.name || "Enlarged accessory"}
                className="w-full h-full object-contain max-h-[80vh]"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
              >
                <FiX size={32} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form at Bottom */}
      <div ref={formRef}>
        <AccessoryForm selectedProduct={selectedProduct} />
      </div>
    </>
  );
};

const ProductCard = ({ item, scrollToForm }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      layout
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }} 
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ layout: { duration: 0.6 }, duration: 0.3 }}
      className="relative bg-white shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-55">
        <Image width={100} height={100} quality={100} unoptimized={true} src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
      </div>

      <motion.div
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: isHovered ? 0 : 1, y: isHovered ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-1 text-center bg-gray-100"
      >
        <h5 className="text-lg font-bold text-gray-800 truncate">{item.name}</h5>
        <p className="text-sm text-gray-500">{item.category}</p>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            key="buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3"
          >
            <Btn btnName={"Check Now"} func={() => scrollToForm(item)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const Dropdown = ({ label, selected, options, show, setShow, onSelect }) => (
  <div className="relative">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <button
      onClick={() => setShow(!show)}
      className="w-full flex justify-between items-center bg-white border border-gray-300  px-4 py-3 text-left shadow-sm hover:shadow-md transition-all duration-300"
    >
      <span className="font-medium">{selected}</span>
      {show ? <FiChevronUp className="text-gray-500" /> : <FiChevronDown className="text-gray-500" />}
    </button>
    {show && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute z-10 mt-1 w-full bg-white shadow-xl  py-1 border border-gray-200"
      >
        {options.map((option) => (
          <div
            key={option}
            onClick={() => {
              onSelect(option);
              setShow(false);
            }}
            className={`px-4 py-3 hover:bg-blue-50 cursor-pointer transition ${
              selected === option ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-700"
            }`}
          >
            {option}
          </div>
        ))}
      </motion.div>
    )}
  </div>
);

export default CarAccessoriesPage;
