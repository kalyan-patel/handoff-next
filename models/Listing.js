import mongoose from 'mongoose';


const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  imgUrls: { type: [String], required: true },
  thumbnailUrl: { type: String, required: true },
  user: { type: String, required: true },
  postDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false },
  deleted: { type: Boolean, default: false }
});

// Check if the model already exists before defining it
export default mongoose.models.Listing || mongoose.model('Listing', listingSchema);