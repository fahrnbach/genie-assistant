import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import OpenAI from 'openai/index.js';
import { splitIntoChunks } from './chunker';

// Setup environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Paths
const CHUNKS_DIR = path.resolve(__dirname, '../chunks');
const EMBEDDINGS_FILE = path.resolve(__dirname, '../embeddings/data.json');

// Ensure API key is present
if (!process.env.OPENAI_API_KEY) {
  throw new Error('❌ Missing OPENAI_API_KEY in .env');
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedText(text) {
  const res = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });
  return res.data[0].embedding;
}

export async function buildEmbeddingDB() {
  const files = await fs.readdir(CHUNKS_DIR);
  const db = [];

  for (const file of files) {
    const filePath = path.join(CHUNKS_DIR, file);
    const content = await fs.readFile(filePath, 'utf-8');
    const chunks = splitIntoChunks(content, 500, 50);

    console.log(`📄 Processing ${file}... (${chunks.length} chunks)`);

    for (const chunk of chunks) {
      const embedding = await embedText(chunk);
      db.push({
        source: file,
        content: chunk,
        embedding,
      });
    }
  }

  await fs.writeFile(EMBEDDINGS_FILE, JSON.stringify(db, null, 2));
console.log(`✅ Embedding DB built with ${db.length} entries from ${files.length} files.`);
}

// CLI ONLY
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildEmbeddingDB();
}

// LOGS

const now = new Date().toISOString();
const logPath = join(__dirname, 'embeddings', 'last-embed.log');

writeFileSync(logPath, `Last embedded at: ${now}\n`);

const readable = now.toLocaleString();
const outputPath = join(__dirname, 'embeddings', 'data.json');

console.log(`
  ╭────────────────────────────────────────╮
  │ 🧞‍♂️  Genie Embed Complete!                │
  ├────────────────────────────────────────┤
  │ 📅 Last Run: ${readable}
  │ 📂 Output: ${outputPath.replace(__dirname + '/', '')}
  ╰────────────────────────────────────────╯
  `);