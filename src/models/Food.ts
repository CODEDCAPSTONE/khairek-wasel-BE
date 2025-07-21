import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  details: { type: String, required: true },
  quantity: { type: String, required: true },
  address: { type: String, required: true },
  location: { type: String, required: true },
  contact: { type: String, required: true },
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  status: { type: String, required: true, enum: ['available', 'unavailable'] },
  image: { type: String, required: false }, 
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Food', foodSchema);
