// 'use client'
// import ResponsiveBanner from '@/app/components/banner/ResponsiveBanner';
// import axios from 'axios';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';

// const AboutPage = () => {
//     const [aboutData, setAboutData] = useState({
//         img1: '',
//         company_name: '',
//         page_heading: '',
//         p1: '',
//         p2: '',
//         p3: '',
//         p4:''
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get("http://localhost:8000/api/about-us");
//                 if (response.status === 200) {
//                     setAboutData(response.data.data || {});
//                     setLoading(false);
//                     console.log("about data", response.data.data);
//                 } else {
//                     setError("Failed to fetch about data");
//                     setLoading(false);
//                 }
//             } catch (error) {
//                 setError(error.message || "Something went wrong");
//                 setLoading(false);
//                 console.error("Error fetching about data:", error);
//             }
//         };

//         fetchData();
//     }, []);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <div>Loading....</div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center min-h-screen">
//                 <h1>{error}</h1>
//             </div>
//         );
//     }

//     return (
//         <>
//             {/* <ResponsiveBanner/> */}
//             <div className="bg-white py-5 px-4 sm:px-6 lg:px-8 min-h-screen">
//                 <div className="max-w-7xl mx-auto">
//                     {/* Responsive Grid for images and Text */}
//                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                         {/* First Column - Image and Text */}
//                         <div className="space-y-8">
//                             <div className="w-full h-auto aspect-square">
//                                 <Image
//                                     src={`http://localhost:8000${aboutData.img1}`}
//                                     alt="Curved Architecture"
//                                     className="w-full h-full object-cover"
//                                     width={500}
//                                     height={500}
//                                 />
//                                 <span className="text-sm text-gray-500 tracking-widest uppercase mb-2 block mt-4">
//                                     {aboutData.company_name}
//                                 </span>
//                                 <h2 className="text-4xl font-bold text-gray-900 force-font">
//                                     {aboutData.page_heading}
//                                 </h2>
//                             </div>
//                         </div>

//                         {/* Second Column - Larger Image and Text */}
//                         <div className="lg:col-span-2 space-y-8">
//                             <div className="w-full h-auto aspect-video">
//                                 <Image
//                                     src={`http://localhost:8000${aboutData.img2}`}
//                                     alt="About us"
//                                     className="w-full h-full object-cover"
//                                     width={1000}
//                                     height={500}
//                                 />
//                             </div>

//                             {/* Text Content with HTML rendering */}
//                             <div className="text-gray-700 text-base leading-relaxed space-y-4">
//                                 {aboutData.p1 && (
//                                     <div dangerouslySetInnerHTML={{ __html: aboutData.p1 }} />
//                                 )}
//                                 {aboutData.p2 && (
//                                     <div dangerouslySetInnerHTML={{ __html: aboutData.p2 }} />
//                                 )}
//                                 {aboutData.p3 && (
//                                     <div dangerouslySetInnerHTML={{ __html: aboutData.p3 }} />
//                                 )}
//                                 {aboutData.p4 && (
//                                     <div dangerouslySetInnerHTML={{ __html: aboutData.p4 }} />
//                                 )}
//                                 <p>
//                                     Our experienced team is dedicated to making your car ownership smooth, exciting, and worry-free. We offer a full range of services including sales, financing, genuine Hyundai accessories, and professional maintenance.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default AboutPage;
"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import { motion } from "framer-motion";
import ResponsiveBanner from "../../components/banner/ResponsiveBanner";

export default function AboutUsPage() {
  const [tabs, setTabs] = useState([{ id: "whoWeAre", label: "Who We Are" }]);
  const [activeTab, setActiveTab] = useState("whoWeAre");
  const [aboutData, setAboutData] = useState({});
  const [galleryData, setGalleryData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch About Us Data
        const aboutRes = await axios.get("http://localhost:8000/api/about-us");
        setAboutData(aboutRes.data.data || {});

        // Fetch All Galleries
        const galleriesRes = await axios.get("http://localhost:8000/api/galleries");
        const galleries = galleriesRes.data.data || [];

        // Generate dynamic tabs from DB
        const newTabs = [
          { id: "whoWeAre", label: "Who We Are" },
          ...galleries.map((g) => ({
            id: g.slug,
            label: g.title,
          })),
        ];

        // Store all gallery data by slug
        const galleryObj = {};
        galleries.forEach((g) => {
          try {
            galleryObj[g.slug] =
              typeof g.image_array === "string"
                ? JSON.parse(g.image_array)
                : g.image_array;
          } catch {
            galleryObj[g.slug] = [];
          }
        });

        setTabs(newTabs);
        setGalleryData(galleryObj);
      } catch (err) {
        console.error("Error fetching About Us or Galleries:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading)
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Loading About Us...
      </div>
    );

  return (
    <div className="bg-white">
      {/* Banner */}
      <ResponsiveBanner />

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-center gap-6 px-4 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-3 text-sm sm:text-base font-medium border-b-2 transition-all duration-200 ${
                activeTab === tab.id
                  ? "border-[#002844] text-[#002844]"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {activeTab === "whoWeAre" ? (
          <WhoWeAreSection aboutData={aboutData} />
        ) : (
          <GallerySection
            title={tabs.find((t) => t.id === activeTab)?.label || "Gallery"}
            images={galleryData[activeTab] || []}
          />
        )}
      </div>
    </div>
  );
} 

/* ------------------------------------------
   🔵 Reused About Us (from your commented code)
------------------------------------------- */
function WhoWeAreSection({ aboutData }) {
  return (
    <motion.div
      key="whoWeAre"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Left Side - Image + Info */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 relative ">
            {aboutData.page_heading}
          </h1>
        {aboutData.img1 && (
          <Image
            src={`http://localhost:8000${aboutData.img1}`}
            alt="About Image"
            width={500}
            height={500}
            className="w-full h-auto object-cover"
          />
        )}
        <div>
          
          <p className="text-sm text-gray-600 uppercase tracking-widest">
            {aboutData.company_name}
          </p>
        </div>
      </div>

          {/* Right Side - Text */}
      <div className="lg:col-span-2 space-y-5 text-gray-700 leading-relaxed sm:relative top-[3.4rem] mb-5">
        {[aboutData.p1, aboutData.p2, aboutData.p3, aboutData.p4].map(
          (content, i) =>
            content && (
              <div key={i} dangerouslySetInnerHTML={{ __html: content }} />
            )
        )}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------
   🖼️ Reusable Gallery Section
------------------------------------------- */
function GallerySection({ title, images }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="mt-5"
    >
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{title}</h1>
     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
  {Array.isArray(images) && images.length > 0 ? (
    images.map((src, index) => (
      <motion.div
        key={index}
        className="overflow-hidden shadow-md"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        viewport={{ once: true }}
      >
        <Image
        width={100} height={100} quality={100} unoptimized={true}
          src={`http://localhost:8000${src}`}
          alt={`${title} ${index + 1}`}
          className="object-cover w-full h-48 sm:h-56 md:h-64  transition-transform duration-300 hover:scale-105"
        />
      </motion.div>
    ))
  ) : (
    <p className="col-span-full text-center text-gray-500">
      No images found
    </p>
  )}
</div>

    </motion.div>
  );
}
