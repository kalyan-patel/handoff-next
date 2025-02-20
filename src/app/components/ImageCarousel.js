"use client";

import { useState } from "react";

export default function ImageCarousel({ imgUrls }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imgUrls || imgUrls.length === 0) {
    return <p>No images available.</p>;
  }

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imgUrls.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + imgUrls.length) % imgUrls.length);
  };

  return (
    <div className="relative w-full h-80 md:h-96 lg:h-[32rem] rounded-lg bg-gradient-to-b from-purple-500 via-indigo-400 to-blue-300">
      <div className="overflow-hidden w-full h-full rounded-lg">
        <img
          src={imgUrls[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>

      {imgUrls.length > 1 && (
        <>
          {/* Left Arrow */}
          <button
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 hover:scale-110 transition-all duration-200"
            onClick={prevSlide}
            aria-label="Previous Slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-800"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Right Arrow */}
          <button
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 hover:scale-110 transition-all duration-200"
            onClick={nextSlide}
            aria-label="Next Slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-800"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  );
}