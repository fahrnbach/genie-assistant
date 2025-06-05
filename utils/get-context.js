import { cosineSimilarity } from './search.js';
import vectorStore from '../embeddings/data.json' assert { type: 'json' };
import { embedText } from './embedder.js';

export async function getTopMatches(query, topK = 5) {
  const queryEmbedding = await embedText(query);

  const scored = vectorStore.map((entry) => ({
    ...entry,
    score: cosineSimilarity(queryEmbedding, entry.embedding),
  }));

  const top = scored.sort((a, b) => b.score - a.score).slice(0, topK);

  const context = top.map(entry =>
    `→ [source: ${entry.source}]\n${entry.content}`
  ).join('\n\n');

  return context;
}