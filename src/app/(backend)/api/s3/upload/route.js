import { NextResponse } from "next/server";
import { getPresignedUrl } from "../../../../../../lib/aws";

export async function POST(request) {
  try {
    const { fileName, fileType } = await request.json();

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }

    const { url, key } = await getPresignedUrl(fileName, fileType);

    return NextResponse.json({ url, key });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json({ error: "Failed to generate URL" }, { status: 500 });
  }
}