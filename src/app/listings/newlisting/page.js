"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '../../contexts/AuthContext';
import {uploadToCloudinary } from '../../../../lib/cloudinary'

export default function NewListing() {
  const titleRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const imgRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const { currentUser } = useAuth();

  const router = useRouter();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 files
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setImages(filePreviews);
  };

  const handleThumbnailSelect = (index) => {
    setThumbnailIndex(index);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const uploadedImageUrls = [];
      for (let i = 0; i < imgRef.current.files.length; i++) {
        const file = imgRef.current.files[i];
        const imageUrl = await uploadToCloudinary(file);
        uploadedImageUrls.push(imageUrl);
      }
  
      const listingData = {
        title: titleRef.current.value,
        description: descRef.current.value,
        price: priceRef.current.value,
        user: currentUser.email,
        imgUrls: uploadedImageUrls,
        thumbnailUrl: uploadedImageUrls[thumbnailIndex],
      };
  
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create the listing.");
      }
  
      router.push("/");
    } catch (err) {
      setError("Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Add a Listing</h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              ref={titleRef}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="description" className="block font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              ref={descRef}
              required
              rows="3"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
          <div>
            <label htmlFor="price" className="block font-medium mb-1">
              Price
            </label>
            <input
              id="price"
              type="number"
              name="price"
              ref={priceRef}
              required
              max="10000"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="images" className="block font-medium mb-1">
              Upload Images (Max 4)
            </label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              ref={imgRef}
              className="w-full"
            />
            <div className="flex gap-4 mt-4 overflow-x-auto">
              {images.map((src, index) => (
                <div
                  key={index}
                  className={`relative w-20 h-20 border rounded-lg overflow-hidden ${
                    thumbnailIndex === index
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute bottom-0 left-0 w-full bg-gray-800 text-white text-sm py-1"
                    onClick={() => handleThumbnailSelect(index)}
                  >
                    {thumbnailIndex === index ? "Thumbnail" : "Set Thumbnail"}
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}