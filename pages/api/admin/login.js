import bcrypt from 'bcryptjs'
import { serialize } from 'cookie'
import clientPromise from '../../../lib/mongodb'
import { signToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  try {
    const client = await clientPromise
    const db = client.db('workshop')
    const admins = db.collection('admins')

    let admin = await admins.findOne({ email: email.toLowerCase().trim() })

    // Seed the first admin from env vars if none exist
    if (!admin) {
      const adminCount = await admins.countDocuments()
      if (
        adminCount === 0 &&
        email.toLowerCase().trim() === process.env.ADMIN_EMAIL?.toLowerCase() &&
        password === process.env.ADMIN_PASSWORD
      ) {
        const hashed = await bcrypt.hash(password, 12)
        await admins.insertOne({
          email: email.toLowerCase().trim(),
          password: hashed,
          createdAt: new Date(),
        })
        admin = await admins.findOne({ email: email.toLowerCase().trim() })
      }
    }

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = signToken({ adminId: admin._id.toString(), email: admin.email })

    res.setHeader(
      'Set-Cookie',
      serialize('admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 8,
        path: '/',
      })
    )

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Login error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
