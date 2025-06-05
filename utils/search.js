// utils/search.js
export function cosineSimilarity(A, B) {
    const dot = A.reduce((sum, val, i) => sum + val * B[i], 0);
    const normA = Math.sqrt(A.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(B.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
  }
  
  export function findTopMatches(queryEmbedding, db, k = 3) {
    return db
      .map(entry => ({
        ...entry,
        score: cosineSimilarity(queryEmbedding, entry.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }