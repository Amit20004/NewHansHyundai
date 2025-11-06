'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ResponsiveBanner from '../../../components/banner/ResponsiveBanner';
import axios from 'axios';
import ContactUs from '../../contact-us/page'

const DocumentationPage = () => {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/documentation")
    .then(res => {
      const flatData = res.data.data;

      // Group items by heading
      const grouped = {};
      flatData.forEach(row => {
        const heading = row.heading || 'Untitled';
        if (!grouped[heading]) {
          grouped[heading] = {
            heading,
            highlight_color: row.highlight_color || 'text-blue-600',
            items: [],
          };
        }
        grouped[heading].items.push(row.item);
      });

      setSections(Object.values(grouped));
    })
    .catch(err => console.error("Failed to load data:", err));
  }, []);

  return (
    <>
      <ResponsiveBanner />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[1400px] mx-auto px-4 py-8 md:px-6 md:py-12"
      >
        {/* Header Section */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="!text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed max-w-4xl">
            Flexible, transparent, quick and cost-effective. Our car loan offers a convenient car buying experience with faster approval and doorstep service. We are dealing with most of the leading banks which gives you the great advantage to choose the right company for you. It also gives you the easiest repayment options. We have two types of car loans one is new car loan and second is used car loan.
          </p>
        </motion.div>

        {/* Documentation Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
              className="bg-white overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300 rounded-lg"
            >
              <div className="p-6 md:p-8">
                <div className={`uppercase tracking-wide text-sm ${section.highlight_color} font-semibold mb-1`}>
                  Documentation Requirements
                </div>
                <h2 className="!text-xl md:!text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {section.items.map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: 0.05 * index,
                        type: 'spring',
                        stiffness: 100
                      }}
                    >
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <ContactUs/>
    </>
  );
};

export default DocumentationPage;