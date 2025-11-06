"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import ResponsiveBanner from "../../../components/banner/ResponsiveBanner";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Gallery = () => {
  const pathname = usePathname();
  const branch = pathname?.split("/").filter(Boolean).pop(); // last part of the URL
  console.log("Slug from URL:", branch);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!branch) return; // wait until branch is ready

    const fetchGallery = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/gallery/${branch}`
        );
if (res.data.success) {
  let imagesData = res.data.data.images;

  // If it's a string, parse it into an array
  if (typeof imagesData === "string") {
    try {
      imagesData = JSON.parse(imagesData);
    } catch (e) {
      console.error("Error parsing image array:", e);
      imagesData = [];
    }
  }

  setImages(imagesData);
  console.log("Fetched images:", imagesData);
}
else {
          setError(res.data.message || "Failed to load gallery");
        }
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError("Error fetching gallery");
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [branch]);
  console.log("Type of images:", typeof images);
  console.log("Is Array?", Array.isArray(images));

  // if (!metaData) return;

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading gallery...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <>
      <ResponsiveBanner />
      <div className="bg-white px-4 sm:px-6 lg:px-20 py-4 sm:py-10">
        <div className="max-w-7xl mx-auto relative p-5">
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="absolute inset-0 bg-gray-200 z-0"
          />
          <div className="relative z-10 grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.isArray(images) && images.length > 0 ? (
              images.map((src, index) => (
                <motion.div
                  key={index}
                  className="overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Image
                  width={100} height={100} quality={100} unoptimized={true}
                    src={`http://localhost:8000${src}`}
                    alt={`Gallery ${index + 1}`}
              
                    className="object-cover w-full h-auto"
                  />
                </motion.div>
              ))
            ) : (
              <p className="col-span-full text-center text-gray-500">
                No images found
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;
