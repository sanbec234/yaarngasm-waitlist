import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'

export default function AdminLogin() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
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
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error || 'Invalid credentials')
        setStatus('error')
      } else {
        router.push('/admin/dashboard')
      }
    } catch {
      setErrorMsg('Network error — please try again')
      setStatus('error')
    }
  }

  return (
    <>
      <Head>
        <title>Admin Login — yaarngasm</title>
      </Head>

      <div
        className="min-h-screen flex flex-col"
        style={{ background: 'linear-gradient(160deg, #FFF0F4 0%, #FFE4EC 50%, #FADADD 100%)' }}
      >
        {/* Navbar */}
        <nav className="w-full px-6 py-3 flex items-center" style={{ background: '#E8476F' }}>
          <a href="/">
            <Image
              src="/yaarngasm-logo.png"
              alt="yaarngasm"
              width={140}
              height={50}
              className="object-contain logo-blend"
              priority
            />
          </a>
        </nav>

        {/* Login card */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <span className="inline-block bg-pink-100 text-pink-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
                Host Portal
              </span>
              <h1 className="text-3xl font-bold text-pink-900">Welcome back</h1>
              <p className="mt-1 text-pink-500 text-sm">Sign in to manage your workshop</p>
            </div>

            <div
              className="rounded-3xl p-8 shadow-xl border border-pink-200"
              style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)' }}
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-pink-800 mb-1.5">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    placeholder="admin@example.com"
                    className="w-full px-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl placeholder-pink-300 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-pink-800 mb-1.5">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-pink-50 border border-pink-200 rounded-xl placeholder-pink-300 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition"
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
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>
            </div>

            <p className="text-center text-pink-400 text-sm mt-6">
              <a href="/" className="hover:text-pink-600 transition">← Back to workshop page</a>
            </p>
          </div>
        </main>
      </div>
    </>
  )
}
