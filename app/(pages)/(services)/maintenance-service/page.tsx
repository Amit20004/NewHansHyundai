'use client'
import React from 'react'
import { useState } from 'react'
import {motion} from 'framer-motion'
import { Box } from '@mui/material'
import ResponsiveBanner from '../../../components/banner/ResponsiveBanner';
import BookServiceForm from '../../../components/form/ServiceForm';

export default function Page() {


    const [activeCategory, setActiveCategory] = useState("Battery and Cables");

    const maintenanceData = {
        "Battery and Cables": [
            "Driving Belts",
            "Engine and Gear box mounting",
            "Transmission fluids",
            "Dashboard Indicators",
            "Engine Oil, Air and Oil filters",
            "Brake Pods",
            "Suspension",
            "Coolant",
            "Spark Plugs",
            "Engine filters",
        ],
        "Fluids & Filters": [
            "Fuel filter",
            "AC Filter",
            "Power Steering Fluid",
            "Coolant",
            "Transmission fluids",
        ],
        "Exterior & Safety": [
            "All Lights",
            "Wheels",
            "Tire Inflation, Alignment and Rotation",
            "Wiper Blades",
            "Exhaust System",
        ],
        "Interior & Comfort": [
            "Door Mechanisms and window winding working",
            "Dashboard Indicators",
            "Hoses",
            "AC Filter",
        ],
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
        },
    };


    return (
        <div>
        <ResponsiveBanner/>
        <BookServiceForm/>
            <Box sx={{
                py: 2,
                // px: { xs: 2, md: 15 },
                width: "100%",
                maxWidth: "1397px",
                mx: "auto",
            }}>

                {/* content */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 PM-contentHeading" >
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" >
                                Periodic Maintenance Service
                            </h2>
                            <p className="max-w-3xl mx-auto text-lg text-gray-600 PM-contentPara" >
                                Keep your vehicle running at its best with our comprehensive PMS that
                                anticipates potential issues before they become major problems.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
                            {/* Categories Navigation */}
                            <div className="lg:col-span-1 space-y-2">
                                {Object.keys(maintenanceData).map((category) => (
                                    <motion.button
                                        key={category}
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setActiveCategory(category)}
                                        className={`w-full text-left px-6 py-3 rounded-lg transition-all ${activeCategory === category
                                                ? "bg-gray-900 text-white shadow-lg"
                                                : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                                            }`}
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Maintenance Items */}
                            <motion.div
                                key={activeCategory}
                                initial="hidden"
                                animate="visible"
                                variants={containerVariants}
                                className="lg:col-span-3 bg-white rounded-xl shadow-xl overflow-hidden"
                            >
                                <div className="p-6 sm:p-8">
                                    <motion.h3
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                        className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200"
                                    >
                                        {activeCategory}
                                    </motion.h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {maintenanceData[activeCategory].map((item, index) => (
                                            <motion.div
                                                key={index}
                                                variants={itemVariants}
                                                whileHover={{ scale: 1.02 }}
                                                className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <svg
                                                        className="h-5 w-5 text-blue-500"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-gray-700 font-medium">{item}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Benefits Section */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true }}
                            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 xs:mt-1 PM-benefitSection"

                        >
                            {[
                                {
                                    title: "Enhanced Safety",
                                    icon: "🛡️",
                                    description:
                                        "Regular checks ensure all safety systems are functioning properly.",
                                },
                                {
                                    title: "Improved Efficiency",
                                    icon: "⛽",
                                    description:
                                        "Maintained vehicles run more efficiently, saving you fuel costs.",
                                },
                                {
                                    title: "Longer Lifespan",
                                    icon: "⏳",
                                    description:
                                        "Preventive maintenance extends your vehicle's operational life.",
                                },
                            ].map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-xl shadow-lg border  border-gray-100"
                                >
                                    <div className="text-4xl mb-4">{benefit.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

            </Box>

        </div>
    )
}

