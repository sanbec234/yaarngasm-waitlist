import { requireAdmin } from '../../../lib/auth'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const admin = requireAdmin(req)
  if (!admin) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  return res.status(200).json({ email: admin.email })
}
