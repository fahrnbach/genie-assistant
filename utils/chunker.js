/**
 * Splits a large block of text into smaller overlapping chunks.
 * This helps with embedding and retrieval in a vector store.
 */

export function splitIntoChunks(text, maxLength = 500, overlap = 50) {
  const words = text.split(/\s+/);
  const chunks = [];

  for (let i = 0; i < words.length; i += maxLength - overlap) {
    const chunk = words.slice(i, i + maxLength).join(' ');
    chunks.push(chunk);
    if (i + maxLength >= words.length) break;
  }

  return chunks;
}