import { NextResponse } from 'next/server';
import connectToDB from '../../../../../../lib/mongoose';
import Listing from '../../../../../../models/Listing';

// GET: Fetch a listing by ID
export async function GET(req, { params }) {
  try {
    console.log("IN THE GET REQUEST");

    await connectToDB();

    const { id } = params;
    const listing = await Listing.findById(id);

    console.log("LISTING FROM INSIDE THE GET REQ");
    console.log(listing);

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json(listing, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: Update a listing by ID
export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const data = await req.json();

    const updatedListing = await Listing.findByIdAndUpdate(id, data, { new: true });

    if (!updatedListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

// PATCH: Soft delete by setting { deleted: true }
export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const { id } = params
    
    const data = await req.json();
    
    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { deleted: true },
      { new: true }
    );

    if (!updatedListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE: Delete a listing by ID (NOT ACTUALLY USED, USER INSTEAD SENDS A PATCH REQ WHICH IS A SOFT DELETE)
export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;

    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}