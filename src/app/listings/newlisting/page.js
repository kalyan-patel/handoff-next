"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { uploadToS3 } from "../../../../lib/aws";

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
    const files = Array.from(e.target.files).slice(0, 4);
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
      for (let i = 0; i < Math.min(imgRef.current.files.length, 4); i++) {
        const file = imgRef.current.files[i];
        const imageUrl = await uploadToS3(file);
        uploadedImageUrls.push(imageUrl);
      }

      const listingData = {
        title: titleRef.current.value,
        description: descRef.current.value,
        price: priceRef.current.value,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName,
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
    <div className="flex justify-center items-center min-h-[calc(100dvh-7rem)] p-3">
      <div className="w-full max-w-md bg-white shadow-md border rounded-xl p-6">
        <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">Add a Listing</h2>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 text-md">
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              ref={titleRef}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              ref={descRef}
              required
              rows="3"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Price ($)</label>
            <input
              type="number"
              ref={priceRef}
              required
              max="10000"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Upload Images (Max 4)</label>
            <input
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
                    thumbnailIndex === index ? "border-blue-500" : "border-gray-300"
                  }`}
                >
                  <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
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
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
