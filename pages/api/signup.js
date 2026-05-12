import clientPromise from '../../lib/mongodb'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, consentGiven, source } = req.body

  if (!name?.trim() || !email?.trim()) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  if (!consentGiven) {
    return res.status(400).json({ error: 'You must agree to the Privacy Policy to join.' })
  }

  try {
    const client = await clientPromise
    const db = client.db()
    const signups = db.collection('waitlist')

    const existing = await signups.findOne({ email: email.toLowerCase().trim() })
    if (existing) {
      return res.status(409).json({ error: 'This email is already on the waitlist.' })
    }

    await signups.insertOne({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || '',
      source: source?.trim() || 'website',
      consentGiven: true,
      registeredAt: new Date(),
    })

    return res.status(201).json({ success: true, message: "You've been added to the waitlist!" })
  } catch (err) {
    console.error('Signup error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
