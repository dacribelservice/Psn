"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  id: string;
  image_url: string;
  title_es?: string;
  title_en?: string;
  subtitle_es?: string;
  subtitle_en?: string;
}

interface TutorialSliderProps {
  banners: Banner[];
  language: string;
}

export function TutorialSlider({ banners, language }: TutorialSliderProps) {
  const [[currentSlide, direction], setSlide] = useState([0, 0]);

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    if (banners.length === 0) return;
    const nextSlide = (currentSlide + newDirection + banners.length) % banners.length;
    setSlide([nextSlide, newDirection]);
  };

  const setPage = (index: number) => {
    const newDir = index > currentSlide ? 1 : -1;
    setSlide([index, newDir]);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    })
  };

  if (banners.length === 0) {
    return (
      <div className="w-full aspect-[9/16] bg-white/5 rounded-[2rem] border border-white/10 flex items-center justify-center p-8 text-center">
        <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">
          Tutorial en preparación...
        </p>
      </div>
    );
  }

  return (
    <div className="relative group w-full max-w-[320px] mx-auto">
      <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)] border border-white/10 bg-black/40">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={banners[currentSlide].id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 touch-none cursor-grab active:cursor-grabbing"
          >
            <img
              src={banners[currentSlide].image_url}
              alt="Tutorial Step"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay for Text Visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 pb-12">
              <h4 className="text-white font-black text-sm tracking-tight mb-1 uppercase">
                {language === 'es' ? banners[currentSlide].title_es : banners[currentSlide].title_en}
              </h4>
              <p className="text-primary font-bold text-[10px] tracking-widest uppercase opacity-80">
                {language === 'es' ? banners[currentSlide].subtitle_es : banners[currentSlide].subtitle_en}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx)}
              className="relative h-1.5 focus:outline-none"
            >
              {idx === currentSlide ? (
                <motion.div
                  layoutId="tutorial-pill"
                  className="w-6 bg-primary rounded-full h-full shadow-[0_0_10px_rgba(242,185,47,0.5)]"
                />
              ) : (
                <div className="w-1.5 bg-white/20 rounded-full h-full hover:bg-white/40 transition-all" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows (Visible on hover in PC) */}
      <button 
        onClick={() => paginate(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <span className="material-symbols-outlined text-sm">arrow_back_ios_new</span>
      </button>
      <button 
        onClick={() => paginate(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity z-30"
      >
        <span className="material-symbols-outlined text-sm">arrow_forward_ios</span>
      </button>
    </div>
  );
}
