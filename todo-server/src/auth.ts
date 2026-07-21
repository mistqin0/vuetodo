import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function generateToken(userId: number, username: string): string {
  return jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '7d' })
}

export interface AuthRequest {
  userId: number
  username: string
}

export function verifyToken(token: string): AuthRequest | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as AuthRequest
    return payload
  } catch {
    return null
  }
}

