import mongoose from 'mongoose';


const feedbackSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userEmail: { type: String, required: true }
});

// Check if the model already exists before defining it
export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);