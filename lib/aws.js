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
  console.log("IN U2S3");
  console.log(file.type, file.name);
  console.log(file);

  const response = await fetch("/api/s3/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });

  if (!response.ok) {
    throw new Error("Failed to get pre-signed URL");
  }

  const { url, key } = await response.json();
  console.log("Generated pre-signed URL:", url);

  try {
    const uploadResponse = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text(); // Capture error details from the response
      console.error("Upload failed:", uploadResponse.status, errorText);
      throw new Error(
        `Failed to upload file to S3. Status: ${uploadResponse.status}, Error: ${errorText}`
      );
    }

    console.log(process.env.AWS_BUCKET_NAME)
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw error;
  }
};