// pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// Key rotation management - store current key index in memory
let currentKeyIndex = 0;
const MAX_RETRIES = 3;

// Get all available API keys
const getApiKeys = (): string[] => {
  const apiKeys: string[] = [];
  let i = 1;
  
  // Collect all available API keys from environment variables
  while (true) {
    const key = process.env[`GEMINI_API_KEY_${i}`];
    if (!key) break;
    apiKeys.push(key);
    i++;
  }

  // Fallback to the original key format if no numbered keys found
  if (apiKeys.length === 0 && process.env.GEMINI_API_KEY) {
    apiKeys.push(process.env.GEMINI_API_KEY);
  }

  return apiKeys;
};

// Function to call Gemini API with a specific key
const callGeminiAPI = async (prompt: string, apiKey: string) => {
  // Extract language from prompt for generation parameters
  let generationConfig = {};
  
  // Check if prompt contains language specification
  const languageMatches = prompt.match(/YOUR RESPONSE MUST BE ENTIRELY IN (\w+) ONLY/);
  if (languageMatches && languageMatches[1]) {
    const langName = languageMatches[1].toLowerCase();
    
    // Map language names to ISO codes for Gemini
    const langMap: {[key: string]: string} = {
      'english': 'en',
      'hindi': 'hi',
      'tamil': 'ta',
      'malayalam': 'ml',
      'kannada': 'kn',
      'telugu': 'te'
    };
    
    if (langMap[langName]) {
      generationConfig = {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      };
    }
  }
  
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig
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

  const { prompt } = req.body;
  const apiKeys = getApiKeys();

  if (apiKeys.length === 0) {
    return res.status(500).json({ error: 'No Gemini API keys found' });
  }

  // Try with multiple keys if needed
  for (let attempt = 0; attempt < Math.min(apiKeys.length, MAX_RETRIES); attempt++) {
    // Get the next API key in rotation
    const apiKey = apiKeys[currentKeyIndex];
    
    try {
      console.log(`Attempting with API key ${currentKeyIndex + 1}`);
      const result = await callGeminiAPI(prompt, apiKey);
      
      if (result.ok) {
        const resultText = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        return res.status(200).json({ result: resultText });
      } else {
        console.log(`API key ${currentKeyIndex + 1} failed with status ${result.status}`);
        
        // If it's a quota exceeded error (429), try the next key
        if (result.status === 429) {
          // Rotate to next key for future requests
          currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
          continue;
        }
        
        // For other errors, return the error
        return res.status(result.status).json({ 
          error: `HTTP ${result.status}: ${result.error}`,
          keyUsed: currentKeyIndex + 1
        });
      }
    } catch (err) {
      let errorMsg = 'Failed to fetch Gemini response';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (typeof err === 'string') {
        errorMsg = err;
      }
      
      // Move to the next key for the next attempt
      currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
      
      // If this was the last attempt, return the error
      if (attempt === Math.min(apiKeys.length, MAX_RETRIES) - 1) {
        return res.status(500).json({ error: errorMsg, allKeysFailed: true });
      }
    }
  }
  
  // If we've tried all keys and all failed
  return res.status(500).json({ 
    error: 'All API keys exceeded quota or failed',
    suggestion: 'Please try again later when API quotas reset'
  });
}
