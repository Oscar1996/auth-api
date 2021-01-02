import mongoose from 'mongoose';
import User from './user.interface';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
