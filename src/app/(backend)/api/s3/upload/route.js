import { NextResponse } from "next/server";
import { getPresignedUrl } from "../../../../../../lib/aws";
import sharp from "sharp";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file"); // Get file from request

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    let fileBuffer = Buffer.from(await file.arrayBuffer());
    let fileType = file.type;
    let fileName = file.name;

    console.log(fileType)
    console.log(fileName)

    // Convert HEIC to JPEG
    if (fileType === "image/heic" || fileName.endsWith(".heic")) {
      try {
        fileBuffer = await sharp(fileBuffer).toFormat("jpeg").toBuffer();
        fileType = "image/jpeg";
        fileName = fileName.replace(".heic", ".jpg");
      } catch (error) {
        console.error("HEIC conversion failed:", error);
        return NextResponse.json({ error: "HEIC conversion failed" }, { status: 500 });
      }
    }

    // Get S3 pre-signed URL
    const { url, key } = await getPresignedUrl(fileName, fileType);

    // Upload the converted file to S3
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": fileType },
      body: fileBuffer,
    });

    return NextResponse.json({
      imageUrl: `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}