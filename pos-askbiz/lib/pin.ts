import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto'

// Strengthened staff-PIN hashing using Node's built-in crypto.scrypt.
// No external dependencies — keeps build/deploy risk low.
//
// Stored format for new PINs: `scrypt$<saltHex>$<hashHex>`
// Legacy PINs are unsalted single-round SHA-256 of (pin + staffId) and are
// still verifiable for backward compatibility, then transparently upgraded.

const SCRYPT_KEYLEN = 64
const SALT_BYTES = 16

/**
 * Hash a PIN with a random salt using scrypt.
 * Returns a self-describing string: `scrypt$<saltHex>$<hashHex>`.
 */
export function hashPin(pin: string): string {
  const salt = randomBytes(SALT_BYTES)
  const hash = scryptSync(pin, salt, SCRYPT_KEYLEN)
  return `scrypt$${salt.toString('hex')}$${hash.toString('hex')}`
}

/** Legacy hash: unsalted single-round SHA-256 of (pin + staffId). */
function legacyHash(pin: string, staffId: string): string {
  return createHash('sha256').update(pin + staffId).digest('hex')
}

/**
 * Verify a PIN against a stored value.
 * - If `stored` is a scrypt string, verify with scrypt + timingSafeEqual.
 * - Otherwise treat `stored` as a legacy SHA-256 hash (pin + staffId).
 */
export function verifyPin(pin: string, stored: string, staffId: string): boolean {
  if (!stored) return false

  if (stored.startsWith('scrypt$')) {
    const parts = stored.split('$')
    if (parts.length !== 3) return false
    const [, saltHex, hashHex] = parts
    try {
      const salt = Buffer.from(saltHex, 'hex')
      const expected = Buffer.from(hashHex, 'hex')
      const actual = scryptSync(pin, salt, expected.length)
      return expected.length === actual.length && timingSafeEqual(expected, actual)
    } catch {
      return false
    }
  }

  // Legacy SHA-256 path
  const expected = Buffer.from(stored, 'hex')
  const actual = Buffer.from(legacyHash(pin, staffId), 'hex')
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

/** True if the stored hash is legacy (not scrypt) and should be upgraded. */
export function needsRehash(stored: string): boolean {
  return !stored?.startsWith('scrypt$')
}
