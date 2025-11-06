'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  HelpCircle,
  Lightbulb,
  Car,
  Settings,
  ShoppingCart,
  Wrench,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import heroDealership from "../../assets/carChanging/amazon_Grey_6.png";
import ResponsiveBanner from "../../components/banner/ResponsiveBanner";
import Image from "next/image";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const categoryIcons: Record = {
  All: Car,
  Inventory: ShoppingCart,
  Sales: ShoppingCart,
  Service: Wrench,
  System: Settings,
  General: HelpCircle, // fallback icon
};

const Index = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaqId, setOpenFaqId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const faqsPerPage = 5;

  // 🔹 Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/faq-categories");
        if (res.data.success) {
          const fetched = res.data.data;
          setCategories(["All", ...fetched]);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Fetch FAQs (all or by category)
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const url =
          activeCategory === "All"
            ? "http://localhost:8000/api/faq"
            : `http://localhost:8000/api/faq?category=${encodeURIComponent(activeCategory)}`;
        const res = await axios.get(url);
        if (res.data.success) setFaqs(res.data.data);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };
    fetchFaqs();
  }, [activeCategory]);

  // 🔹 Search + pagination
  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFaqs.length / faqsPerPage);
  const indexOfLastFaq = currentPage * faqsPerPage;
  const indexOfFirstFaq = indexOfLastFaq - faqsPerPage;
  const currentFaqs = filteredFaqs.slice(indexOfFirstFaq, indexOfLastFaq);

  const toggleFaq = (id: number) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveBanner />

      {/* 🔹 Hero Section */}
      <header
        className="relative overflow-hidden py-5 px-4 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(135deg, hsla(210, 100%, 20%, 0.95) 0%, hsla(210, 80%, 35%, 0.9) 50%, hsla(200, 70%, 45%, 0.85) 100%), url(${heroDealership})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="!text-5xl md:text-7xl font-bold text-black py-3">
            Search Your Questions Queries here
          </h1>

          {/* 🔹 Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-14 pr-6 py-4 text-lg border focus:outline-none focus:ring-4 focus:ring-white/10 transition-all"
            />
          </div>

          {/* 🔹 Dynamic Category Tabs */}
          <div className="flex flex-wrap justify-center gap-4 py-3">
            {categories.map((category) => {
              const IconComponent =
                categoryIcons[category as keyof typeof categoryIcons] ||
                HelpCircle;
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-6 py-3 !text-black font-semibold transition-all duration-300 flex items-center gap-2 ${
                    activeCategory === category
                      ? "bg-white !text-black shadow-[0_8px_20px_rgba(0,0,0,0.3)] scale-105"
                      : "bg-white/15 text-white hover:bg-white/25 border-white/30 backdrop-blur-sm"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* 🔹 FAQ Section */}
      <main className="max-w-7xl mx-auto px-4 py-5">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Image */}
          <div className="relative overflow-hidden shadow-2xl sticky top-8 hidden lg:block">
            <Image
            width={100} height={100} quality={100} unoptimized={true} 
              src={
                "https://hanshyundaihpromise.com/cdn/shop/files/hpromisebanner.jpg?v=1747817820&width=3840"
              }
              alt="Dealership workspace"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - FAQ Cards */}
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="text-center py-20">
                <Car className="w-20 h-20 mx-auto mb-6 text-muted-foreground/30" />
                <p className="text-2xl text-muted-foreground font-medium">
                  No questions found. Try a different search or category.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {currentFaqs.map((faq) => (
                    <div
                      key={faq.id}
                      className="bg-card border-2 border-border overflow-hidden transition-all duration-300 hover:border-primary/40"
                      style={{
                        boxShadow:
                          openFaqId === faq.id
                            ? "var(--shadow-elegant)"
                            : "0 4px 12px rgba(0,0,0,0.05)",
                      }}
                    >
                      {/* Question */}
                      <button
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full px-2 py-2 flex items-center justify-between text-left hover:bg-muted/30 transition-all duration-300"
                      >
                        <div className="flex items-center gap-5 flex-1">
                          <div
                            className="relative flex-shrink-0 p-3 transition-all duration-300"
                            style={{
                              background:
                                openFaqId === faq.id
                                  ? "hsl(var(--accent) / 0.15)"
                                  : "hsl(var(--primary) / 0.1)",
                            }}
                          >
                            {openFaqId === faq.id ? (
                              <Lightbulb
                                className="w-7 h-7 text-accent transition-all duration-300"
                                style={{
                                  filter: "drop-shadow(var(--shadow-glow))",
                                  animation:
                                    "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                                }}
                              />
                            ) : (
                              <HelpCircle className="w-7 h-7 text-primary transition-all duration-300" />
                            )}
                          </div>
                          <span className="!text-lg md:text-xl font-medium text-foreground">
                            {faq.question}
                          </span>
                        </div>

                        <svg
                          className={`w-6 h-6 text-primary transition-transform duration-300 flex-shrink-0 ml-4 ${
                            openFaqId === faq.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* Answer */}
                      <div
                        className="overflow-hidden transition-all duration-500 ease-in-out"
                        style={{
                          maxHeight: openFaqId === faq.id ? "600px" : "0",
                          opacity: openFaqId === faq.id ? 1 : 0,
                        }}
                      >
                        <div className="px-8 py-7 bg-gradient-to-br from-muted/40 to-muted/20 border-t-2 border-border/50">
                          <p className="text-foreground/90 leading-relaxed text-base md:text-lg">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className={`p-2 transition-all ${
                        currentPage === 1
                          ? "text-muted-foreground cursor-not-allowed opacity-50"
                          : "text-primary hover:bg-primary/10"
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-10 h-10 font-semibold transition-all ${
                            currentPage === page
                              ? "bg-primary text-blue shadow-lg"
                              : "text-foreground hover:bg-muted"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        )
                      }
                      disabled={currentPage === totalPages}
                      className={`p-2 transition-all ${
                        currentPage === totalPages
                          ? "text-muted-foreground cursor-not-allowed opacity-50"
                          : "text-primary hover:bg-primary/10"
                      }`}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
