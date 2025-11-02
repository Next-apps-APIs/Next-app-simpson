"use client";

import { useState, useEffect, useRef } from "react";
import { SimpsonModalTrailerInterface } from "../types/SimpsonModalTrailerInterface";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { SIMPSONS_VIDEO } from "../utils/constants";
import { FaTimes, FaPlay, FaYoutube } from "react-icons/fa";

export default function SimpsonsModalTrailer({
  isOpen,
  onClose,
  videoId = SIMPSONS_VIDEO.ID,
  videoTitle = SIMPSONS_VIDEO.TITLE,
}: SimpsonModalTrailerInterface) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Extract just the video ID from the URL if a full URL is provided
  const extractVideoId = (url: string): string => {
    if (!url) return "";
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2]?.length === 11 ? match[2] : "";
  };

  const embedUrl = `https://www.youtube.com/embed/${extractVideoId(videoId)}?autoplay=1&mute=1&rel=0&showinfo=0`;

  // Handle click outside to close
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  // Handle keyboard navigation, body scroll, and component lifecycle
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  // Animation variants for modal
  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  const modalVariants: Variants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
          onClick={handleClickOutside}
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop with Simpsons theme */}
          <motion.div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              backgroundImage: 'url(https://res.cloudinary.com/dd1xsnzcm/image/upload/v1639999999/clouds_bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            className="relative w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border-2 border-white/20"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-100 relative">
              <div className="flex items-center space-x-3">
                <FaYoutube className="text-red-500 text-2xl" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {videoTitle}
                </h2>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative pt-[56.25%] bg-gray-900/10 m-2 rounded-lg overflow-hidden shadow-inner border border-white/10">
              <div className="absolute inset-0 bg-linear-to-br from-transparent via-white/10 to-white/5 pointer-events-none z-10"></div>
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={videoTitle}
                loading="lazy"
              />
              {/* Play button overlay (shows before video loads) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <FaPlay className="text-yellow-400 text-6xl drop-shadow-2xl" />
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-white/20 relative">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-black font-medium text-sm">
                    🎬 D’oh! Enjoy the show!
                  </span>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-900 bg-yellow-400 hover:bg-yellow-500 
                    rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all duration-200 
                    shadow-sm cursor-pointer"
                  >
                    Close Video
                  </button>
                </div>
              </div>

              <div className="mt-2 text-center">
                <p className="text-xs text-shadow-black font-medium">
                  "I’m not lazy, I’m on energy-saving mode." – Homer Simpson
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
