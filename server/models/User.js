import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /[^@\s]+@[^@\s]+\.[^@\s]+/,
    },
    password: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created', updatedAt: 'updated' } }
);

export default mongoose.model('User', userSchema);
