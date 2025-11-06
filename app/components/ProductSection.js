import React from "react";
import Button from "./ui/Button";
import Image from "next/image";
const services = [
  {
    id: 1,
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Interior/March/800x530_2.jpg",
    title: "Exterior Hand Wash & Wax",
    description:
      "Gentle yet thorough hand wash using pH-balanced soaps, followed by premium wax to protect your paint and enhance shine.",
  },
  {
    id: 2,
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Interior/March/800x530_2.jpg",
    title: "Interior Deep Cleaning",
    description:
      "From carpets to headliners, steam and shampoo treatment leaves your cabin fresh, sanitized, and like new inside.",
  },
  {
    id: 3,
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Interior/March/800x530_2.jpg",
    title: "Paint Correction",
    description:
      "Buff away swirl marks and scratches with multi-stage polishing that restores paint clarity and depth.",
  },
  {
    id: 4,
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Interior/March/800x530_2.jpg",
    title: "Ceramic Coating Protection",
    description:
      "Add years of protection with hydrophobic ceramic coating against UV, dirt, and scratches.",
  },
  {
    id: 5,
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Interior/March/800x530_2.jpg",
    title: "Engine Bay Detailing",
    description:
      "Degrease and shine your engine bay for a professional finish and improved resale value.",
  },
  {
    id: 6,
    image: "https://www.hyundai.com/content/dam/hyundai/in/en/data/find-a-car/Verna/Interior/March/800x530_2.jpg",
    title: "Headlight Restoration",
    description:
      "We sand, polish, and seal your headlights so they shine bright and clear again.",
  },
];

export default function ProductSection() {
  return (
    <section className=" py-5 bg-black">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Premium Car Detailing</h2>
        <p className="text-gray-300 mb-10">
          From deep interior cleaning to long-lasting ceramic coating.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-5">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative group overflow-hidden rounded-sm shadow-md"
            >
              <Image
                src={service.image}
                alt={service.title}
                className="w-full h-72 object-cover transition duration-300 group-hover:blur-sm"
                width={100}
                height={100}
              />

              {/* Overlay */}
              <div className="absolute inset-0 text-black opacity-0 hover:opacity-100 hover:backdrop-blur-lg transition duration-300 flex flex-col justify-center items-center p-6">
                <p className="text-sm mb-4 !text-white">{service.description}</p>
                <Button btnName={"view more"} color={"white"}/>
              </div>

              {/* Top left number */}
              <div className="absolute top-2 left-3 text-black text-2xl font-bold z-10">
                0{service.id}
              </div>

              {/* Bottom Title */}
              <div className="absolute bottom-3 w-full text-center z-10">
                <h4 className="text-lg font-semibold text-black">{service.title}</h4>
              </div>

              {/* Gradient Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-blue-200 to-transparent"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
