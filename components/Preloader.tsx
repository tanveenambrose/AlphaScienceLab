"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePreloader } from "./PreloaderContext";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setPreloaderFinished } = usePreloader();

  useEffect(() => {
    // Disable scrolling while preloader is active
    document.body.style.overflow = "hidden";

    if (videoRef.current) {
      videoRef.current.playbackRate = 1.3;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn("Autoplay with sound prevented, reverting to muted autoplay:", error);
          if (videoRef.current) {
             videoRef.current.muted = true;
             videoRef.current.play();
          }
        });
      }
    }

    // Fallback: If the video fails to load or play, hide the preloader after a max of 12 seconds
    // to prevent infinite loading.
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 12000);

    return () => {
      clearTimeout(timeout);
      document.body.style.overflow = "";
    };
  }, []);

  // When preloader closes, restore body scrolling
  useEffect(() => {
    if (!isLoading) {
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      setPreloaderFinished(true);
    }
  }, [isLoading, setPreloaderFinished]);

  const handleVideoEnd = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black overflow-hidden"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            onEnded={handleVideoEnd}
            className="w-full h-full object-cover md:object-contain bg-black"
          >
            <source src="/assests/ASL_PV.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
