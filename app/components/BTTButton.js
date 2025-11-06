"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
export default function BTTButton() {
  const [visible, setVisible] = useState(false);
  const [driving, setDriving] = useState(false);

  useEffect(() => {
    const scrollFunction = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setVisible(scrollTop > 20);
    };

    window.addEventListener("scroll", scrollFunction);
    return () => window.removeEventListener("scroll", scrollFunction);
  }, []);

  const backToTop = () => {
    // Start driving animation
    setDriving(true);

    // Scroll page smoothly
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Stop driving after 2 seconds (matches scroll duration)
    setTimeout(() => {
      setDriving(false);
    }, 2000);
  };

  return (
    visible && (
      <button
        onClick={backToTop}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "20px",
          width: "60px",
          height: "60px",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
          animation: driving
            ? "drive-up 2s forwards ease-in-out"
            : "bounce 2s infinite ease-in-out",
        }}
      >
        <Image width={100} height={100} quality={100} unoptimized={true} src={"https://png.pngtree.com/png-vector/20220607/ourmid/pngtree-car-view-from-above-icon-info-graphic-silhouette-up-vector-png-image_35563706.png"}/>
        <style jsx>{`
          @keyframes bounce {
            0%,
            100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-5px);
            }
          }

          @keyframes drive-up {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-500px) rotate(-10deg);
            }
          }
        `}</style>
      </button>
    )
  );
}
