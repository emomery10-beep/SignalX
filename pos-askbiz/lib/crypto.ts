import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'

function getKey(): Buffer {
  const hex = process.env.TOKEN_ENCRYPTION_KEY
  if (!hex || hex.length !== 64) {
    throw new Error('TOKEN_ENCRYPTION_KEY must be a 64-char hex string. Generate with: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"')
  }
  return Buffer.from(hex, 'hex')
}

export function encryptToken(plaintext: string): string {
  const key = getKey()
  const iv = randomBytes(12)
  const cipher = createCipheriv(ALGORITHM, key, iv)
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return `v1:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export function decryptToken(ciphertext: string): string {
  const key = getKey()
  const parts = ciphertext.split(':')
  if (parts.length !== 4 || parts[0] !== 'v1') throw new Error('Invalid encrypted token format')
  const [, ivHex, authTagHex, encryptedHex] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encrypted = Buffer.from(encryptedHex, 'hex')
  const decipher = createDecipheriv(ALGORITHM, key, iv)
  decipher.setAuthTag(authTag)
  return decipher.update(encrypted).toString('utf8') + decipher.final('utf8')
}

// Encrypt a credentials object for storage in the DB.
// Returns { _enc: "v1:..." } — a wrapper that signals the payload is encrypted.
export function encryptCredentials(creds: Record<string, unknown>): Record<string, string> {
  return { _enc: encryptToken(JSON.stringify(creds)) }
}

// Decrypt credentials from DB. Handles both encrypted ({ _enc: "v1:..." })
// and legacy plain-text rows transparently so old rows stay readable.
export function decryptCredentials(creds: Record<string, unknown>): Record<string, unknown> {
  if (typeof creds._enc === 'string') {
    return JSON.parse(decryptToken(creds._enc)) as Record<string, unknown>
  }
  return creds
}
