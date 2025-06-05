// server/rag.js
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { embedText } from '../utils/embedder.js';
import { findTopMatches } from '../utils/search.js';
import { getTopMatches } from '../utils/get-context.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const EMBEDDINGS_FILE = process.env.EMBEDDINGS_FILE || path.resolve(__dirname, '../utils/embeddings/data.json');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const defaultPrompt = `You are a helpful assistant genie tasked with answering questions.\n
You may grant the asker three 'Wishes' or questions.\n
After three questions, direct the user to the conjurer's contact info.\n
Keep responses concise, friendly, and emoji-rich. Suggest 1–2 follow-up questions.`;

export async function askRAG(question, options = {}) {
  const {
    personaPrompt = defaultPrompt,
    resumeLink = 'https://resume.fahrnbach.one',
    calendlyLink = 'https://calendly.link'
  } = options;

  const queryEmbedding = await embedText(question);
  const dbRaw = await fs.readFile(EMBEDDINGS_FILE, 'utf-8');
  const db = JSON.parse(dbRaw);
  const matches = findTopMatches(queryEmbedding, db);

  const context = await getTopMatches(question);

  const messages = [
    {
      role: 'system',
      content: `${personaPrompt}\n\nResume: ${resumeLink}\nCalendly: ${calendlyLink}`
    },
    {
      role: 'user',
      content: `${question}\n\nContext:\n${context}`
    }
  ];

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    temperature: 0.5
  });

  return completion.choices[0].message.content;
}
