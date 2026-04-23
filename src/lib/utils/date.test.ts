import { describe, it, expect } from 'vitest'
import { format, formatDateTime } from './date'

describe('format', () => {
  it('formats a date string to DD Mon YYYY', () => {
    const result = format('2026-04-23')
    expect(result).toContain('23')
    expect(result).toContain('2026')
  })
})

describe('formatDateTime', () => {
  it('returns a non-empty string for an ISO timestamp', () => {
    const result = formatDateTime('2026-04-23T10:30:00Z')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })
})
