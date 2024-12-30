import { NextResponse } from 'next/server';
import Conversation from '../../../../../../../models/Conversation';  // Make sure this path is correct

export async function POST(req, { params }) {
  const { id } = await params;  // Get conversation ID
  const { sender, content, timestamp } = await req.json();

  try {
    const conversation = await Conversation.findById(id);
    
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    conversation.messages.push({ sender, content, timestamp });
    await conversation.save();

    return NextResponse.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error("Error sending message:", error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}