import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now },
});

const conversationSchema = new mongoose.Schema({
  users: { type: [String], required: true },
  topic: { type: String },
  messages: { type: [messageSchema], required: true }
}, { timestamps: true }); // Automatically creates createdAt and updatedAt fields


// Check if the model already exists before defining it
export default mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);