// Next.js API route to proxy RAG backend
// File: /pages/api/rag-chatbot.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { query, language } = req.body
  try {
    // TODO: Update URL if deploying RAG backend
    const ragRes = await fetch('http://localhost:8000/rag-chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language }),
    })
    const data = await ragRes.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'RAG backend unavailable' })
  }
}
