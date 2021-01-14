import { Schema, model, Document } from 'mongoose';
import User from './user.interface';

const addressSchema = new Schema({
  city: String,
  country: String,
  street: String
});

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    address: addressSchema,
    email: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    tokens: [{ token: { type: String, require: true } }]
  },
  { timestamps: true }
);

const userModel = model<User & Document>('User', userSchema);

export default userModel;
