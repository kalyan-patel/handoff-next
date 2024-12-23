"use client";

import { useState } from 'react';

export default function ImageCarousel({ imgUrls }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imgUrls.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imgUrls.length) % imgUrls.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden w-full h-96 rounded-lg border-2">
        <img
          src={imgUrls[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-contain" // add "object-cover" to crop image into the box (adds whitespace)
        />
      </div>

      {/* Left Arrow */}
      <button
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
        onClick={prevSlide}
      >
        &#60;
      </button>

      {/* Right Arrow */}
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
        onClick={nextSlide}
      >
        &#62;
      </button>
    </div>
  );
}