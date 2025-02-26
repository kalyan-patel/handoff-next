import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.NEXT_PUBLIC_AWS_REGION,
});

export const getPresignedUrl = async (fileName, fileType) => {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
    Key: `${Date.now()}-${fileName}`,
    Expires: 60, // URL expiration time in seconds
    ContentType: fileType
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    return { url, key: params.Key };
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw error;
  }
};


export const uploadToS3 = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/s3/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const { imageUrl } = await response.json();
  return imageUrl; // Return the uploaded image URL
};