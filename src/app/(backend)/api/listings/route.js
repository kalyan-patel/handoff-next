import connectToDB from '../../../../../lib/mongoose';
import Listing from '../../../../../models/Listing';
import { NextResponse } from 'next/server';

// GET: Fetch all listings for the homepage with optional search filters
export async function GET(req) {
  try {
    await connectToDB();

    // Extract search parameters
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const userEmail = searchParams.get("user");

    // Construct filter query
    let filter = { deleted: { $ne: true } };
    if (title) {
      filter.title = { $regex: title, $options: "i" }; // Case-insensitive search
    }
    if (userEmail) {
      filter.userEmail = userEmail;
    }

    const listings = await Listing.find(filter).sort({ resolved: 1, lastUpdated: -1 });

    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: Create a new listing
export async function POST(req) {
  try {
    await connectToDB();
    const body = await req.json(); // Parse JSON payload

    const { title, description, price, userEmail, userDisplayName, imgUrls, thumbnailUrl } = body;

    if (!title || !description || !price || !userEmail || !userDisplayName || !imgUrls || !thumbnailUrl) {
      throw new Error("Missing required fields");
    }

    const newListing = new Listing({
      title,
      description,
      price,
      userEmail,
      userDisplayName,
      imgUrls: imgUrls,
      thumbnailUrl: thumbnailUrl,
    });

    const savedListing = await newListing.save();

    return NextResponse.json(savedListing, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}