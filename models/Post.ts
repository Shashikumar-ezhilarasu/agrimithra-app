import mongoose, { Schema, Document } from 'mongoose';

export interface IPost extends Document {
  userId: string;
  userName: string;
  userImage?: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: {
    userId: string;
    userName: string;
    content: string;
    timestamp: Date;
  }[];
  createdAt: Date;
}

const PostSchema = new Schema<IPost>({
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  userImage: String,
  content: { type: String, required: true },
  imageUrl: String,
  likes: { type: Number, default: 0 },
  comments: [{
    userId: String,
    userName: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
