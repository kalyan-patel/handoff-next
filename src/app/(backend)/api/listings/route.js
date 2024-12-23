import connectToDB from '../../../../../lib/mongoose';
import Listing from '../../../../../models/Listing';
import { NextResponse } from 'next/server';


// GET: Fetch all listings for the homepage
export async function GET() {
  try {
    await connectToDB();
    const listings = await Listing.find({ deleted: { $ne: true } }).sort({ lastUpdated: -1 })
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

    const { title, description, price, user, imgUrls, thumbnailUrl } = body;

    if (!title || !description || !price || !user || !imgUrls || !thumbnailUrl) {
      throw new Error("Missing required fields");
    }

    const newListing = new Listing({
      title,
      description,
      price,
      user,
      imgUrls: imgUrls,
      thumbnailUrl: thumbnailUrl,
    });

    const savedListing = await newListing.save();

    return NextResponse.json(savedListing, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}