'use client';
import ServiceNavbar from '../../../../components/serviceNavbar/ServiceNavbar';
import ResponsiveBanner from '../../../../components/banner/ResponsiveBanner';
import { useState, useEffect } from 'react';
import axios from "axios";
import { CheckCircle } from 'lucide-react';
import ConatctUs from '../../../contact-us/page';
import { useRouter } from 'next/navigation';
import Btn from '../../../../components/ui/Button';
import Image from 'next/image';

type LinkData = {
  label: string;
  href: string;
};

type Props = {
  initialData: LinkData;
  refLinks: LinkData[];
};

type Content = {
  id: number;
  slug: string;
  main_heading: string;
  main_content: string;
  main_image: string | null;
  product_image: string | null;
  product_content: string;
};

export default function SafetyDurability({ initialData, refLinks }: Props) {
  const [content, setContent] = useState<Content | null>(null);
  const navigate = useRouter();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/fetch-service/${initialData.href}`); 
        if (res.data.success) {
          setContent(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, [initialData.href]);

  return (
    <>
<div className="bg-white mx-auto w-full max-w-[1400px]">
        {/* Hero Section - Optimized for mobile */}
  <section className="relative bg-gray-100 overflow-hidden">
          <ResponsiveBanner />
        </section>

        {/* Sticky Navbar - Reduced spacing */}
  <div className="mb-2 md:mb-4">
          <ServiceNavbar refLinks={refLinks} />
        </div>
    
        {/* Promise Section - Reduced padding */}
        <section className="py-4 md:py-8 bg-gradient-surface">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-primary-soft px-3 py-1 md:px-4 md:py-2 rounded-full mb-3 md:mb-4">
                <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                <span className="text-primary font-medium text-sm md:text-base">Our Promise</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 md:mb-4">
                {content?.main_heading || initialData.label}
              </h2>
              <div
                className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content?.main_content || "Loading content..." }}
              />
            </div>
          </div>
        </section>

        {/* Banner Section - Reduced height and padding */}
        <section className="py-4 md:py-8 bg-surface">
          <div className="container mx-auto px-4">
            <div className="relative h-64 md:h-80 lg:h-96 bg-gradient-card rounded-xl md:rounded-2xl overflow-hidden shadow-strong group cursor-pointer">
              <Image
              width={100} height={100} quality={100} unoptimized={true}
                src={
                  content?.main_image
                    ? `http://localhost:8000/uploads/${content.main_image}`
                    : "https://img.freepik.com/free-photo/beautiful-car-washing-service_23-2149212223.jpg?semt=ais_hybrid&w=740"
                }
                alt="Professional automotive service"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-1 md:mb-2">Professional Service Excellence</h3>
                <p className="text-white/90 text-sm md:text-base">
                  Watch how we deliver premium automotive care
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Reduced spacing */}
        <section className="py-4 md:py-8 bg-gradient-surface">
          <div className="container mx-auto px-4">
            <div className="space-y-12 md:space-y-20">
              {/* Service Content */}
              <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-primary rounded-xl md:rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative bg-card rounded-xl md:rounded-2xl overflow-hidden shadow-medium group-hover:shadow-strong transition-all duration-300">
                    <Image
                    width={100} height={100} quality={100} unoptimized={true}
                      src={
                        content?.product_image
                          ? `http://localhost:8000/uploads/${content.product_image}`
                          : "https://media.istockphoto.com/id/1488144865/vector/extended-warranty-label-warranty-badge-vector-illustration.jpg?s=612x612&w=0&k=20&c=V8Z0XnQRgjtI9N-81RG_o7m03mJJEWnrD-poZ1ES5fo="
                      }
                      alt="Wheel alignment service"
                      className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
                <div className="space-y-4 md:space-y-6">
                  <div
                    className="prose prose-sm md:prose-lg font-roboto animate-fadeInRight"
                    dangerouslySetInnerHTML={{
                      __html: content?.product_content || "Enjoy additional peace of mind with Hyundai's Extended Warranty."
                    }}
                  />
                  <div className="flex gap-3">
                    <Btn btnName={"Book Now"} func={()=>navigate.push('/book-service')}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <ConatctUs />
    </>
  );
}