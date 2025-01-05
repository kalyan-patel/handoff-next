import { NextResponse } from 'next/server';
import connectToDB from '../../../../../lib/mongoose';
import Conversation from '../../../../../models/Conversation';

export async function GET(req) {
  try {
    await connectToDB();
    const userEmail = req.nextUrl.searchParams.get('email');

    const conversations = await Conversation.find({ userEmails: userEmail }).sort({ updatedAt: -1 })

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.error();
  }
}


export async function POST(req) {
  try {
    await connectToDB();
    const { ownerEmail, ownerDisplayName, interestedUserEmail, interestedUserDisplayName, topic, firstMessage } = await req.json();

    if (!ownerEmail || !ownerDisplayName || !interestedUserEmail || !interestedUserDisplayName || !firstMessage) {
      return NextResponse.json(
        { error: 'Owner IDs and first message are required' },
        { status: 400 }
      );
    }

    const newConversation = new Conversation({
      userEmails: [ownerEmail, interestedUserEmail],
      userDisplayNames: [ownerDisplayName, interestedUserDisplayName],
      topic: topic,
      messages: [
        {
          sender: interestedUserEmail,
          content: firstMessage,
          timestamp: new Date().toISOString(),
        }
      ]
    })

    const savedConversation = await newConversation.save();

    return NextResponse.json({ message: "Conversation created successfully" });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.error();
  }
}