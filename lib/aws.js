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
  const presignRes = await fetch("/api/s3/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
    }),
  });

  if (!presignRes.ok) throw new Error("Failed to get presigned URL");

  const { url, key } = await presignRes.json();

  const uploadRes = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });

  if (!uploadRes.ok) throw new Error("Failed to upload image");

  return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
};
