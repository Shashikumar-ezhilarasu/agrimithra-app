// pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const { prompt } = req.body
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not found' })
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    let resultText = ''
    let errorText = ''
    if (response.ok) {
      const data = await response.json()
      resultText = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''
      res.status(200).json({ result: resultText })
    } else {
      errorText = await response.text()
      res.status(response.status).json({ error: `HTTP ${response.status}: ${errorText}` })
    }
  } catch (err) {
    let errorMsg = 'Failed to fetch Gemini response';
    if (err instanceof Error) {
      errorMsg = err.message;
    } else if (typeof err === 'string') {
      errorMsg = err;
    }
    res.status(500).json({ error: errorMsg })
  }
}
