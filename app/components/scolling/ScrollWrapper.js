'use client';

import { useEffect } from 'react';
import { useAnimation, motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { usePathname } from 'next/navigation';
import Navbar from '../Navbar';
import Footer from '../MainFooter';
import StickyFooter from '..//StickyFooter';
import TopNavbar from '../TopNavbar';

export default function ScrollAnimateWrapper({ children }) {
   const pathname = usePathname();
  const hideNavbar = pathname?.startsWith("/admin");
  const hideTopNavbar = pathname?.startsWith("/admin");
  const hideFooter = pathname?.startsWith("/admin");
  const hideStickyFooter = pathname?.startsWith("/admin");
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.15,
    triggerOnce: true,
  });

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="scroll-fade-in"
    >
      {!hideTopNavbar && <TopNavbar/>}
            {!hideNavbar && <Navbar />}
    
      {children}
              {!hideFooter && <Footer/>}
            {!hideStickyFooter && <StickyFooter/>}

    </motion.div>
  );
}
