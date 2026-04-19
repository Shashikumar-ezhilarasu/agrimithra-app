import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Chat from '@/models/Chat';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = await connectToDatabase();
  
  if (!db) {
    if (req.method === 'GET') {
      // In development, return an empty array if DB is down rather than 500
      return res.status(200).json([]);
    }
    return res.status(503).json({ error: 'Database connection failed. Please check if your IP is whitelisted in MongoDB Atlas.' });
  }

  if (req.method === 'GET') {
    try {
      const chats = await Chat.find({ userId }).sort({ lastUpdated: -1 }).limit(10);
      return res.status(200).json(chats);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch chats' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { messages, chatId, title } = req.body;

      if (chatId) {
        // Update existing chat
        const updatedChat = await Chat.findOneAndUpdate(
          { _id: chatId, userId },
          { messages, lastUpdated: new Date() },
          { new: true }
        );
        return res.status(200).json(updatedChat);
      } else {
        // Create new chat
        const newChat = await Chat.create({
          userId,
          messages,
          title: title || messages[0]?.content?.substring(0, 30) || 'New Chat',
          lastUpdated: new Date(),
        });
        return res.status(201).json(newChat);
      }
    } catch (error) {
      console.error('Error saving chat:', error);
      return res.status(500).json({ error: 'Failed to save chat' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
