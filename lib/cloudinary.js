// import Pica from "pica";

// const resizeImage = async (file) => {
//   const pica = new Pica();
//   const img = document.createElement("img");
//   img.src = URL.createObjectURL(file);

//   await new Promise((resolve) => (img.onload = resolve));

//   const canvas = document.createElement("canvas");
//   canvas.width = 800; // Desired width
//   canvas.height = (img.height / img.width) * 800; // Maintain aspect ratio

//   return pica.resize(img, canvas).then((result) => {
//     return new Promise((resolve) => result.toBlob(resolve, file.type));
//   });
// };


export const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "handoff-next");

  // AVOID DEFAULT TRANSFORMS
  formData.append("resource_type", "image");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dul38rcde/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to upload image to Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};