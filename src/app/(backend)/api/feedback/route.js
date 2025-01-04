import connectToDB from '../../../../../lib/mongoose'; 
import Feedback from '../../../../../models/Feedback';
import { NextResponse } from 'next/server';

// GET: Fetch all feedback entries
export async function GET() {
  try {
   
    await connectToDB();

    const feedback = await Feedback.find().sort({ _id: -1 }); 

    return new Response(JSON.stringify(feedback), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: Create a new feedback entry
export async function POST(req) {
  try {
    await connectToDB();

    const body = await req.json();

    const { text, userEmail } = body;

    if (!text || !userEmail) {
      throw new Error("Missing required fields: 'text' and 'userEmail'");
    }

    const newFeedback = new Feedback({
      text,
      userEmail,
    });

    const savedFeedback = await newFeedback.save();

    return NextResponse.json(savedFeedback, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}