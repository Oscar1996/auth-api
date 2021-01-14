import mongoose from 'mongoose';
import Post from './post.interface';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

const postModel = mongoose.model<Post & mongoose.Document>('Post', postSchema);

export default postModel;
