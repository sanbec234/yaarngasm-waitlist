import clientPromise from '../../../lib/mongodb'
import { requireAdmin } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const admin = requireAdmin(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const signups = db.collection('waitlist')

    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = 50
    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      signups.find({}).sort({ registeredAt: -1 }).skip(skip).limit(limit).toArray(),
      signups.countDocuments(),
    ])

    return res.status(200).json({
      signups: data.map((s) => ({
        id: s._id.toString(),
        name: s.name,
        email: s.email,
        phone: s.phone,
        message: s.message,
        registeredAt: s.registeredAt,
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    console.error('Signups fetch error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
