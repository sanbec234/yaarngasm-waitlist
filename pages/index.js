import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong')
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', phone: '', message: '' })
      }
    } catch {
      setErrorMsg('Network error — please try again')
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>yaarngasm — Workshop Registration</title>
        <meta name="description" content="Sign up for our upcoming yaarngasm workshop" />
      </Head>

      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(160deg, #FFF0F4 0%, #FFE4EC 50%, #FADADD 100%)' }}>

        {/* Navbar */}
        <nav className="w-full px-6 py-3 flex items-center justify-between sticky top-0 z-10" style={{ background: '#E8476F' }}>
          <div className="flex items-center">
            <Image
              src="/yaarngasm-logo.png"
              alt="yaarngasm"
              width={160}
              height={56}
              className="object-contain logo-blend"
              priority
            />
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center pt-12 pb-6 px-4">
          <span className="inline-block bg-pink-100 text-pink-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-4">
            Limited Spots Available
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-pink-900 leading-tight">
            Join the Workshop
          </h1>
          <p className="mt-3 text-pink-600 text-lg max-w-md mx-auto">
            Secure your spot and be part of something unforgettable.
          </p>
        </div>

        {/* Card */}
        <main className="flex-1 flex items-start justify-center px-4 pb-16">
          <div className="w-full max-w-md">
            <div
              className="rounded-3xl p-8 shadow-xl border border-pink-200"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
            >
              {status === 'success' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
                    <svg className="w-8 h-8 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-pink-900 mb-2">You're in!</h2>
                  <p className="text-pink-600 mb-6">We'll reach out soon with all the details.</p>
                  <button
                    onClick={() => setStatus(null)}
                    className="text-pink-500 font-medium hover:text-pink-700 transition"
                  >
                    Register another person
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-pink-800 mb-1.5">
                      Full Name <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Jane Doe"
                      className="w-full px-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl placeholder-pink-300 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-800 mb-1.5">
                      Email Address <span className="text-pink-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="jane@example.com"
                      className="w-full px-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl placeholder-pink-300 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-800 mb-1.5">
                      Phone Number{' '}
                      <span className="text-pink-300 text-xs font-normal">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl placeholder-pink-300 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-pink-800 mb-1.5">
                      Message{' '}
                      <span className="text-pink-300 text-xs font-normal">(optional)</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Any questions or things we should know..."
                      className="w-full px-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl placeholder-pink-300 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition resize-none"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-pink-700 bg-pink-50 border border-pink-300 rounded-xl px-4 py-3 text-sm">
                      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full font-semibold py-3 rounded-xl text-white transition focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background: status === 'loading'
                        ? '#F4A0B5'
                        : 'linear-gradient(135deg, #FF91A4 0%, #E8476F 100%)',
                    }}
                  >
                    {status === 'loading' ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Registering...
                      </span>
                    ) : (
                      'Reserve My Spot ✨'
                    )}
                  </button>
                </form>
              )}
            </div>

            <p className="text-center text-pink-400 text-xs mt-6">
              Your information is safe and will never be shared.
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
