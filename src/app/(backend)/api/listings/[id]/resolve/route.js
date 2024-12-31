import { NextResponse } from 'next/server';
import connectToDB from '../../../../../../../lib/mongoose';
import Listing from '../../../../../../../models/Listing';

// PATCH: Mark a listing as resolved
export async function PATCH(req, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const { isResolved } = await req.json();

    const updatedListing = await Listing.findByIdAndUpdate(
      id,
      { resolved: isResolved },
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