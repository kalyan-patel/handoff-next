import { NextResponse } from 'next/server';
import Conversation from '../../../../../models/Conversation';

export async function GET(req) {
  try {
    const userEmail = req.nextUrl.searchParams.get('email');

    const conversations = await Conversation.find({ users: userEmail }).sort({ updatedAt: -1 })

    return NextResponse.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.error();
  }
}


export async function POST(req) {
  try {
    const { owner, interestedUser, topic, firstMessage } = await req.json();

    if (!owner || !interestedUser || !firstMessage) {
      return NextResponse.json(
        { error: 'Owner ID and message are required' },
        { status: 400 }
      );
    }

    const newConversation = new Conversation({
      users: [owner, interestedUser],
      topic: topic,
      messages: [
        {
          sender: interestedUser,
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