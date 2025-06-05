// utils/embedder.js
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { OpenAIEmbeddings } from '@langchain/openai';
import { splitIntoChunks } from './chunker.js';

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error('❌ Missing OPENAI_API_KEY in .env \n This Package requires that you use an OpenAi API key in your .env \n');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CHUNKS_DIR = path.join(__dirname, '..', 'data', 'chunks');
const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'embeddings', 'data.json');
const LOG_FILE = path.join(__dirname, '..', 'data', 'embeddings', 'last-embed.log');

function logBanner(message) {
  console.log(`\n${chalk.magentaBright.bold('✨ ' + message + ' ✨')}\n`);
}

async function runEmbedder({ silent = false } = {}) {
  const start = Date.now();
  const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.html'));

  const allChunks = [];
  for (const file of chunkFiles) {
    const filePath = path.join(CHUNKS_DIR, file);
    const text = fs.readFileSync(filePath, 'utf-8');
    const chunks = splitIntoChunks(text);
    chunks.forEach(chunk => allChunks.push({ content: chunk, source: file }));
  }

  const embedder = new OpenAIEmbeddings();
  const embeddings = await Promise.all(
    allChunks.map(async ({ content, source }) => ({
      content,
      source,
      embedding: await embedder.embedQuery(content)
    }))
  );

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(embeddings, null, 2));
  const timestamp = new Date().toISOString();
  fs.writeFileSync(LOG_FILE, `Last embedded at: ${timestamp}\n`);

  if (!silent) {
    logBanner('Embeddings Updated');
    console.log(chalk.cyan(`Chunks processed:`), chunkFiles.length);
    console.log(chalk.cyan(`Output:`), OUTPUT_FILE);
    console.log(chalk.cyan(`Time:`), `${((Date.now() - start) / 1000).toFixed(2)}s`);
  }

  return {
    fileCount: chunkFiles.length,
    outputFile: OUTPUT_FILE,
    time: ((Date.now() - start) / 1000).toFixed(2)
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runEmbedder();
}

export default runEmbedder;
