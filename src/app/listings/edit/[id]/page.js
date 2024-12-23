"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { uploadToCloudinary } from "../../../../../lib/cloudinary";

export default function EditListing({ params }) {
  const { id } = React.use(params);
  const titleRef = useRef();
  const descRef = useRef();
  const priceRef = useRef();
  const imgRef = useRef();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [listingData, setListingData] = useState(null);
  const [images, setImages] = useState([]);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const { currentUser } = useAuth();

  const router = useRouter();

  useEffect(() => {
    async function fetchListingData() {
      const response = await fetch(`/api/listings/${id}`);
      if (response.ok) {
        const data = await response.json();
        setListingData(data);
        setImages(data.imgUrls);
        setThumbnailIndex(data.imgUrls.indexOf(data.thumbnailUrl));
      } else {
        setError("Failed to fetch listing data.");
      }
    }

    fetchListingData();
  }, [id]);


  if (!currentUser || listingData && listingData.user !== currentUser.email) {
    return <div>You are not the owner of this listing.</div>;
  }

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

      const listingDataToUpdate = {
        title: titleRef.current.value,
        description: descRef.current.value,
        price: priceRef.current.value,
        user: currentUser.email,
        imgUrls: [...images, ...uploadedImageUrls],
        thumbnailUrl: uploadedImageUrls[thumbnailIndex] || images[thumbnailIndex],
        lastUpdated: Date.now(),
      };

      const response = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingDataToUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to update the listing.");
      }

      router.push(`/listings/${id}`);
    } catch (err) {
      setError("Failed to update listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isDeleted: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete the listing.");
      }

      router.push("/");
    } catch (err) {
      setError("Failed to delete the listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (!listingData) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Edit Listing</h2>
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
              defaultValue={listingData.title}
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
              defaultValue={listingData.description}
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
              defaultValue={listingData.price}
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
            {loading ? "Updating..." : "Update Listing"}
          </button>
        </form>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 mt-4"
        >
          {loading ? "Deleting..." : "Delete Listing"}
        </button>
      </div>
    </div>

  );
}