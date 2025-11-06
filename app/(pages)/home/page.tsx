"use client";
import Carousel from "../../components/Carousel";
import ActionPanel from "../../components/ActionPanel";
import HomeFeatures from "../../components/HomeFeatures";
import CarCarousel from "../../components/CarCarousel";
import Services from "../../components/Services";
import AboutSection from "../../components/AboutSection";
import ParllaxSection from "../../components/ParllaxSection";

// import ProductSection from '../../components/ProductSection'
import ScrollFadeIn from "../../components/scolling/ScrollFadIn";
import ContactUs from "../../(pages)/contact-us/page";
import { useRef } from "react";

export default function Home() {
  const carCarouselRef = useRef(null);

  return (
    <>
      <ScrollFadeIn>
        <Carousel />
      </ScrollFadeIn>
      <ScrollFadeIn delay={0.1}>
        <ActionPanel />
      </ScrollFadeIn>
       <ScrollFadeIn delay={0.4}>
        <AboutSection />
      </ScrollFadeIn>
      <ScrollFadeIn delay={0.5}>
        <div ref={carCarouselRef}>
          <CarCarousel />
        </div>{" "}
      </ScrollFadeIn>
      <HomeFeatures carCarouselRef={carCarouselRef} /> {/* pass ref down */}
      <ScrollFadeIn delay={0.3}>
        <ParllaxSection />
      </ScrollFadeIn>
     
      <ScrollFadeIn delay={0.6}>
        <ContactUs />
      </ScrollFadeIn>
      {/* <ScrollFadeIn delay={0.6}><ProductSection /></ScrollFadeIn> */}
      <ScrollFadeIn delay={0.6}>
        <Services />
      </ScrollFadeIn>
      
    </>
  );
}
