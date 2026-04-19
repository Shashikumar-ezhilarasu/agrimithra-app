import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityCircle extends Document {
  name: string;
  description: string;
  category: string;
  memberCount: number;
  image?: string;
  isJoined?: boolean;
}

const CommunityCircleSchema = new Schema<ICommunityCircle>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  memberCount: { type: Number, default: 0 },
  image: String,
});

export default mongoose.models.CommunityCircle || mongoose.model<ICommunityCircle>('CommunityCircle', CommunityCircleSchema);
