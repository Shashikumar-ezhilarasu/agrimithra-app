import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  mediaType?: 'text' | 'image' | 'audio' | 'video';
  mediaUrl?: string;
}

export interface IChat extends Document {
  userId: string;
  messages: IMessage[];
  lastUpdated: Date;
  title: string;
}

const MessageSchema = new Schema<IMessage>({
  id: String,
  type: { type: String, enum: ['user', 'ai'] },
  content: String,
  timestamp: { type: Date, default: Date.now },
  mediaType: String,
  mediaUrl: String,
});

const ChatSchema = new Schema<IChat>({
  userId: { type: String, required: true, index: true },
  messages: [MessageSchema],
  lastUpdated: { type: Date, default: Date.now },
  title: { type: String, default: 'New Chat' },
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
