import jwt from 'jsonwebtoken'
import { parse } from 'cookie'

const SECRET = process.env.JWT_SECRET

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '8h' })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET)
  } catch {
    return null
  }
}

export function getTokenFromRequest(req) {
  const cookieHeader = req.headers.cookie || ''
  const cookies = parse(cookieHeader)
  return cookies.admin_token || null
}

export function requireAdmin(req) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  return verifyToken(token)
}
