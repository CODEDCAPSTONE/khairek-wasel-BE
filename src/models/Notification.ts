import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { type: String, required: true },   // e.g. "Furniture", "Clothes", etc.
  itemId: { type: String, required: true },     // Reference to item (optional: could use ObjectId if linked)
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Notification', notificationSchema);
