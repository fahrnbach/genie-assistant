// server/session.js
import Redis from 'ioredis';

let redis = null;
const useRedis = process.env.REDIS_URL !== undefined;

if (useRedis) {
  redis = new Redis(process.env.REDIS_URL);
  console.log('✅ Redis connected');
} else {
  console.warn('⚠️ Redis not configured. Falling back to in-memory session tracking.');
}

const memoryStore = new Map();
const TTL_SECONDS = 3600;
const MAX_WISHES = 3;

export async function getWishCount(sessionId) {
  if (useRedis) {
    const count = await redis.get(`genie:${sessionId}`);
    return parseInt(count || '0', 10);
  } else {
    return memoryStore.get(sessionId) || 0;
  }
}

export async function incrementWishCount(sessionId) {
  if (useRedis) {
    const key = `genie:${sessionId}`;
    const current = await redis.incr(key);
    if (current === 1) await redis.expire(key, TTL_SECONDS);
    return current;
  } else {
    const count = (memoryStore.get(sessionId) || 0) + 1;
    memoryStore.set(sessionId, count);
    return count;
  }
}

export function hasRemainingWishes(count) {
  return count < MAX_WISHES;
}
