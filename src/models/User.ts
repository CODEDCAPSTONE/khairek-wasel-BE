import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  type: { type: String, default: 'user' },
  language: { type: String, default: 'en' },
  image: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
