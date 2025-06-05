import { describe, it, expect } from 'vitest'
import { splitIntoChunks } from '../utils/chunker.js'

describe('splitIntoChunks', () => {
  it('splits text into multiple chunks', () => {
    const text = 'This is a long test string '.repeat(100)
    const chunks = splitIntoChunks(text, 100, 20)
    expect(chunks.length).toBeGreaterThan(1)
  })
})