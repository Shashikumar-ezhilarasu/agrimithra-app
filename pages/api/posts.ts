import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import connectToDatabase from '@/lib/mongodb';
import Post from '@/models/Post';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }).limit(20);
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  // Handle POST - Allow both anonymous and authenticated posts
  if (req.method === 'POST') {
    try {
      const { content, imageUrl, userName, userImage } = req.body;

      if (!content) {
        return res.status(400).json({ error: 'Content is required' });
      }

      // Try to get userId if available, but don't block if missing
      let userId = "anonymous";
      try {
        const authResult = getAuth(req);
        if (authResult?.userId) {
          userId = authResult.userId;
        }
      } catch (e) {
        // Clerk might fail if not configured, but we want the API to be public
        console.log("Post created anonymously (no clerk auth)");
      }

      const newPost = await Post.create({
        userId,
        userName: userName || "Independent Farmer",
        userImage: userImage || "",
        content,
        imageUrl,
        createdAt: new Date(),
      });

      return res.status(201).json(newPost);
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
