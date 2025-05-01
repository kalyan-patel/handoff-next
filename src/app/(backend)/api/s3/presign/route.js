import { getPresignedUrl } from "../../../../../../lib/aws";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { fileName, fileType } = await request.json();

  try {
    const { url, key } = await getPresignedUrl(fileName, fileType);
    return NextResponse.json({
      url,
      key,
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to get presigned URL" }, { status: 500 });
  }
}
