import { NextResponse } from "next/server";
import { getPresignedUrl } from "../../../../../../lib/aws";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileType = file.type;
    const fileName = file.name;

    const { url, key } = await getPresignedUrl(fileName, fileType);

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
