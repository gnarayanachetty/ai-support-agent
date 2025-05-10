import { Request, Response } from 'express';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const getCompletion = async (req: Request, res: Response) => {
  const { messages, model = 'gpt-3.5-turbo' } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
    });
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'AI completion failed', error: err });
  }
};

export const getEmbedding = async (req: Request, res: Response) => {
  const { input, model = 'text-embedding-ada-002' } = req.body;
  try {
    const response = await openai.embeddings.create({
      model,
      input,
    });
    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Embedding failed', error: err });
  }
};
