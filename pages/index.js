import { useState } from 'react'
import Head from 'next/head'
import {
  ArrowRight, CheckCircle2, Zap, Users, Gift,
  MapPin, BarChart3, MessageCircle, Ticket, Bell, Shield, Loader2,
} from 'lucide-react'

export default function Home() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [consentGiven, setConsentGiven] = useState(false)
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!consentGiven) {
      setErrorMsg('Please agree to our Privacy Policy to continue.')
      return
    }
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, consentGiven: true, source: 'website' }),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Network error — please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>Plan — The Hangout Planning App</title>
        <meta name="description" content="Stop saying 'we should hang out.' Start doing it. Plan transforms group chat chaos into confirmed hangouts." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-white text-gray-900">

        {/* ── Nav ─────────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm tracking-tight">P</span>
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">Plan</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">How It Works</a>
              <a href="#features" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">Features</a>
              <a href="#benefits" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">Why Plan</a>
            </div>
            <a href="#waitlist" className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
              Join Waitlist
            </a>
          </div>
        </nav>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="relative py-24 md:py-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/60" />
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white rounded-full border border-purple-100 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-purple-700 text-sm font-medium">Now accepting early access signups</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight tracking-tight">
              Stop Saying &ldquo;We Should<br />Hang Out.&rdquo; <span className="text-purple-600">Start Doing It.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
              Plan transforms group chat chaos into confirmed hangouts. Suggest places, vote together, lock it in. Three steps. Zero friction.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              <a href="#waitlist" className="inline-flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl text-base shadow-md hover:shadow-lg transition-all">
                Join the Waitlist <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#how-it-works" className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold px-8 py-4 rounded-xl text-base transition-all">
                See How It Works
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-gray-500">
              {['Native iOS App', 'Real-Time Sync', 'Free to Use', 'WebSocket Powered'].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── The Problem ─────────────────────────────────────────────── */}
        <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-4">The Problem</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">Great Intentions. Zero Follow-Through.</h2>
              <p className="text-lg text-gray-500 mb-6 leading-relaxed">Your friend group chats constantly. But when someone says "we should hang out," the plan dies in a thread of indecision. Someone suggests a place, half the group doesn't respond, and by the time you've gone back and forth everyone's moved on.</p>
              <p className="text-lg text-gray-500 leading-relaxed">The result? Plans fall through. Friendships drift. And everyone's left wondering why it's so hard to just get together.</p>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200 space-y-5">
              {['Endless back-and-forth with no resolution', 'No clear way to reach consensus', 'Plans forgotten or quietly cancelled', 'No accountability for who\'s actually coming', 'Spontaneous moments lost to logistics'].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                  <p className="text-gray-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How It Works ────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-4">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Three Steps. One Confirmed Plan.</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Plan replaces the chaos with a structured flow that actually works.</p>
            </div>
            <div className="space-y-6">
              {[
                { step: 'Step 1', icon: <MapPin className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-100', color: 'text-purple-600', title: 'Spot Drop', desc: 'Someone starts a hangout. Everyone drops their favourite spots—restaurants, bars, parks, events. Real-time suggestions powered by Google Places keep the energy flowing.', tags: ['Place Discovery', 'Google Places', 'Venue Details', 'Ratings & Reviews'] },
                { step: 'Step 2', icon: <BarChart3 className="w-6 h-6 text-indigo-600" />, bg: 'bg-indigo-100', color: 'text-indigo-600', title: 'Pulse Vote', desc: 'Once suggestions are in, everyone votes. Voting happens in real-time with live results streaming to all members. The group decides, together.', tags: ['Live Results', 'Instant Notifications', 'Tie-Breaking', 'Consensus Tracking'] },
                { step: 'Step 3', icon: <CheckCircle2 className="w-6 h-6 text-green-600" />, bg: 'bg-green-100', color: 'text-green-600', title: 'Locked In', desc: 'The winner is chosen. Now everyone RSVPs—yes, no, or maybe. The plan is locked in with time, location, and everyone who\'s committed.', tags: ['RSVP Tracking', 'Reminders', 'Location Sharing', 'Itinerary Details'] },
              ].map(({ step, icon, bg, color, title, desc, tags }) => (
                <div key={step} className="bg-white rounded-2xl p-8 md:p-10 border border-gray-200 hover:border-purple-200 transition-colors">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div className="flex items-center gap-4 md:flex-col md:items-center md:w-20 flex-shrink-0">
                      <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center`}>{icon}</div>
                      <span className={`text-xs font-bold ${color} uppercase tracking-wider`}>{step}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
                      <p className="text-gray-500 text-lg leading-relaxed mb-4">{desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((t) => (
                          <span key={t} className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Grid ───────────────────────────────────────────── */}
        <section id="features" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-4">Features</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Everything Your Group Needs</h2>
              <p className="text-xl text-gray-500 max-w-2xl mx-auto">Built for real friend groups. Designed for real-time collaboration.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: <MessageCircle className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-100', border: 'border-blue-100', title: 'Real-Time Group Chat', desc: 'Create hangout plans directly in your friend group chats. Everyone stays in the loop with real-time updates synced over WebSocket.' },
                { icon: <MapPin className="w-5 h-5 text-green-600" />, bg: 'bg-green-100', border: 'border-green-100', title: 'Smart Place Discovery', desc: 'Discover nearby venues with ratings, reviews, and details. Integrated with Google Places and Yelp for comprehensive coverage.' },
                { icon: <BarChart3 className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-100', border: 'border-purple-100', title: 'Live Voting', desc: 'Real-time voting with instant results. See the consensus emerge as your group votes on venues and times.' },
                { icon: <Gift className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-100', border: 'border-orange-100', title: 'Aura Points', desc: 'Earn Aura points for participation, reliability, and engagement. Build your reputation in the group.' },
                { icon: <Bell className="w-5 h-5 text-pink-600" />, bg: 'bg-pink-100', border: 'border-pink-100', title: 'Push Notifications', desc: 'Never miss an update. Get notified when someone suggests a place, voting starts, or a plan is locked in.' },
                { icon: <Shield className="w-5 h-5 text-indigo-600" />, bg: 'bg-indigo-100', border: 'border-indigo-100', title: 'RSVP Accountability', desc: 'Confirm your attendance and track who\'s in. Build trust with your group through consistent follow-through.' },
              ].map(({ icon, bg, border, title, desc }) => (
                <div key={title} className={`bg-gray-50/50 rounded-xl p-7 border ${border} hover:border-purple-200 transition-colors`}>
                  <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4`}>{icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Plan ────────────────────────────────────────────────── */}
        <section id="benefits" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-wider mb-4">Why Plan</p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Built Different. Built for Friends.</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
              {[
                { title: 'Plans Actually Happen', desc: 'By removing friction from the decision-making process, Plan dramatically increases the likelihood that plans actually materialise. No more cancelled hangouts.' },
                { title: 'Accountability Matters', desc: 'RSVP tracking creates accountability. When everyone knows who\'s committed, flaking becomes less acceptable. Trust builds naturally.' },
                { title: 'Built for Real Groups', desc: 'Plan understands how friend groups actually work. Messy, opinionated, full of different preferences. We embrace that chaos and turn it into clarity.' },
                { title: 'Designed for Mobile', desc: 'Native iOS app with real-time sync. Fast, responsive, and built for how your group actually communicates—on the go, in the moment.' },
                { title: 'Gamified Engagement', desc: 'Aura points reward participation and reliability. Your group\'s culture becomes visible. The most engaged members get recognised.' },
                { title: 'Completely Free', desc: 'No subscriptions. No hidden fees. Plan is completely free for all users. We\'re here to help you hang out, not charge you for it.' },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
                  <p className="text-gray-500 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Waitlist ────────────────────────────────────────────────── */}
        <section id="waitlist" className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-700">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Be First In Line.</h2>
            <p className="text-xl text-purple-100 mb-10 leading-relaxed">
              Plan is launching soon. Join the waitlist to get early access and be the first to turn your group chats into confirmed plans.
            </p>

            {status === 'success' ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list!</h3>
                <p className="text-purple-100">We&apos;ll notify you as soon as Plan is ready for you.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 space-y-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone number (optional)"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all"
                />

                {/* GDPR consent */}
                <label className="flex items-start gap-3 cursor-pointer text-left">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded accent-white cursor-pointer flex-shrink-0"
                  />
                  <span className="text-purple-200 text-xs leading-relaxed">
                    I agree to the{' '}
                    <a href="/privacy" className="underline text-white hover:text-purple-100 transition-colors">
                      Privacy Policy
                    </a>{' '}
                    and consent to Plan storing my information to notify me about early access.
                  </span>
                </label>

                {(status === 'error' || errorMsg) && (
                  <p className="text-red-300 text-sm">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full mt-2 bg-white hover:bg-gray-100 text-purple-700 font-semibold py-4 px-8 rounded-xl text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? (
                    <><Loader2 className="w-5 h-5 animate-spin" />Joining...</>
                  ) : (
                    <>Join the Waitlist <ArrowRight className="w-5 h-5" /></>
                  )}
                </button>
                <p className="text-purple-200 text-xs">No spam. We&apos;ll only email you when Plan is ready.</p>
              </form>
            )}
          </div>
        </section>

        {/* ── Footer ──────────────────────────────────────────────────── */}
        <footer className="bg-gray-950 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              <div className="md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="font-bold text-lg text-white tracking-tight">Plan</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">Turn casual plans into confirmed hangouts. Built for friend groups who actually want to hang out.</p>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-4">Product</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                  <li><a href="#waitlist" className="hover:text-white transition-colors">Join Waitlist</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-4">Company</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm mb-4">Legal</h4>
                <ul className="space-y-2.5 text-sm">
                  <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-600">
              <p>© {new Date().getFullYear()} Plan. All rights reserved.</p>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
