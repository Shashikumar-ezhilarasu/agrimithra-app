// pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from 'next'

let currentKeyIndex = 0;
const MAX_RETRIES = 3;

const getApiKeys = (): string[] => {
  const apiKeys: string[] = [];
  let i = 1;
  while (true) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (!key) break;
    apiKeys.push(key);
    i++;
  }
  if (apiKeys.length === 0 && process.env.GEMINI_API_KEY) {
    apiKeys.push(process.env.GEMINI_API_KEY);
  }
  return apiKeys;
};

const callGeminiAPI = async (prompt: string, apiKey: string, imageData?: string) => {
  const contents: any[] = [];
  const parts: any[] = [{ text: `System: You are an agricultural disease expert. 
  1. Identify the crop and any diseases/pests from images provided. 
  2. Provide detailed mitigation steps. 
  3. ALWAYS include a "Recommended Project" (e.g., a specific organic fertilizer recipe or a irrigation setup) that helps the farmer in depth.
  
  User Query: ${prompt}` }];

  if (imageData) {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageData.split(',')[1] || imageData;
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Data
      }
    });
  }

  contents.push({ parts });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents,
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.8,
          maxOutputTokens: 8192,
        }
      }),
    }
  );
  
  const result = {
    status: response.status,
    ok: response.ok,
    data: null as any,
    error: null as string | null
  };
  
  if (response.ok) {
    result.data = await response.json();
  } else {
    result.error = await response.text();
  }
  
  return result;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, imageData } = req.body;
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return res.status(500).json({ error: 'No Gemini API keys found' });
  }

  for (let attempt = 0; attempt < Math.min(apiKeys.length, MAX_RETRIES); attempt++) {
    const apiKey = apiKeys[currentKeyIndex];
    try {
      const result = await callGeminiAPI(prompt, apiKey, imageData);
      if (result.ok) {
        const resultText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({ result: resultText });
      } else {
        if (result.status === 429) {
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
          continue;
        }
        return res.status(result.status).json({ error: result.error });
      }
    } catch (err) {
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      if (attempt === Math.min(apiKeys.length, MAX_RETRIES) - 1) {
        return res.status(500).json({ error: String(err), allKeysFailed: true });
      }
    }
  }
}
