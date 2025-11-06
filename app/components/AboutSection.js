'use client'
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "./ui/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AutoDetailSection = () => {
  const router = useRouter();
  const [aboutData, setAboutData] = useState(null);

  // Fetch About Us data from backend
  const fetchAboutData = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/get-home-about2");
      setAboutData(res.data.data[0]);
    } catch (err) {
      console.error("Failed to fetch About Us data:", err);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  if (!aboutData) {
    return <p className="text-center py-10">Loading...</p>;
  }

  return (
<section className="bg-background py-5 sm:py-12 mb-0 sm:mb-10 px-10 home-about-section">
      <div className="max-w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Images Section - Left Side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
            {/* Left Column - Large Image */}
            <div className="flex flex-col">
              <div className="overflow-hidden h-full">
                <Image
                width={100} height={100} quality={100} unoptimized={true}
                  src={`http://localhost:8000${aboutData.image_url1}`}
                  alt="Professional car detailing exterior"
                  className="w-full h-auto object-cover shadow-md min-h-[220px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]"
                />
              </div>
            </div>

            {/* Right Column - Second Image */}
            <div className="flex flex-col gap-4">
              <div className="overflow-hidden relative sm:top-6 lg:top-16 shadow-lg flex-1">
                <Image
                width={100} height={100} quality={100} unoptimized={true}
                  src={`http://localhost:8000${aboutData.image_url2}`}
                  alt="Professional car detailing interior"
                  className="w-full max-w-full h-auto object-cover  shadow-md min-h-[220px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px]"
                />
              </div>
            </div>
          </div>

          {/* Content Section - Right Side */}
          <div className="space-y-4 text-center lg:text-left">
            <div className="text-primary font-semibold tracking-wider uppercase">
              <h2>ABOUT US</h2>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-foreground leading-tight">
              {aboutData.main_heading}
            </h2>

            <p className="!text-muted-foreground text-base md:text-lg leading-relaxed">
              {aboutData.description}
            </p>

            <div className="pt-2">
              <Button
                btnName={"Read More"}
                func={() => router.push("/about-us")}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AutoDetailSection;
