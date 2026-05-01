import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, message } = req.body

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const client = await clientPromise
    const db = client.db('workshop')
    const signups = db.collection('signups')

    const existing = await signups.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ error: 'This email is already registered' })
    }

    await signups.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      message: message?.trim() || '',
      registeredAt: new Date(),
    })

    return res.status(201).json({ success: true, message: 'Successfully registered!' })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
