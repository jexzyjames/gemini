// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

import {
    GoogleGenAI,
  } from '@google/genai';
  
  async function main(query) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    if (!apiKey) {
      throw new Error("Missing VITE_GEMINI_API_KEY. Add it to .env and restart Vite.");
    }

    const ai = new GoogleGenAI({
      apiKey,
    });
    const config = {
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-3.6-flash';
    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: query ,
          },
        ],
      },
    ];
  
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    for await (const chunk of response) {
      console.log(chunk.text);
      return chunk.text;
    }
  }
  
  // main();
  
  export default main;