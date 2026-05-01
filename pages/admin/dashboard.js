import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function Dashboard() {
  const router = useRouter()
  const [adminEmail, setAdminEmail] = useState('')
  const [signups, setSignups] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    fetch('/api/admin/me')
      .then((r) => {
        if (!r.ok) throw new Error('Unauthorized')
        return r.json()
      })
      .then((data) => {
        setAdminEmail(data.email)
        setAuthChecked(true)
      })
      .catch(() => router.replace('/admin/login'))
  }, [router])

  const fetchSignups = useCallback(async (p = 1) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/signups?page=${p}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSignups(data.signups)
      setTotal(data.total)
      setPage(data.page)
      setTotalPages(data.totalPages)
    } catch {
      // auth redirect handled by /me
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authChecked) fetchSignups(1)
  }, [authChecked, fetchSignups])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const filtered = signups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase())
  )

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(160deg, #FFF0F4 0%, #FADADD 100%)' }}>
        <div className="animate-spin h-8 w-8 border-4 border-pink-400 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard — yaarngasm</title>
      </Head>

      <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #FFF0F4 0%, #FFE4EC 60%, #FADADD 100%)' }}>

        {/* Navbar */}
        <nav className="w-full px-6 py-3 flex items-center justify-between sticky top-0 z-10" style={{ background: '#E8476F' }}>
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
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/70 hidden sm:block">{adminEmail}</span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-white/80 hover:text-white transition flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign out
            </button>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-pink-900">Registrations</h1>
            <p className="text-pink-500 text-sm mt-0.5">Everyone who signed up for your workshop</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-wide">Total</p>
              <p className="text-4xl font-bold text-pink-700 mt-1">{total}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-wide">This page</p>
              <p className="text-4xl font-bold text-pink-700 mt-1">{signups.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 p-5 shadow-sm col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-pink-400 uppercase tracking-wide">Pages</p>
              <p className="text-4xl font-bold text-pink-700 mt-1">{totalPages}</p>
            </div>
          </div>

          {/* Table card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-semibold text-pink-900">All Sign-ups</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email..."
                    className="pl-9 pr-4 py-2 text-sm bg-pink-50 border border-pink-200 rounded-xl text-pink-900 placeholder-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-400 w-52 transition"
                  />
                </div>
                <button
                  onClick={() => fetchSignups(page)}
                  className="text-sm text-pink-500 hover:text-pink-700 font-medium flex items-center gap-1 transition"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin h-6 w-6 border-4 border-pink-400 border-t-transparent rounded-full" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 text-pink-300">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="font-medium text-pink-400">No registrations yet</p>
                <p className="text-sm mt-1 text-pink-300">Signups will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-pink-50/60">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-pink-400 uppercase tracking-wide">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-pink-400 uppercase tracking-wide">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-pink-400 uppercase tracking-wide hidden md:table-cell">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-pink-400 uppercase tracking-wide hidden lg:table-cell">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-pink-400 uppercase tracking-wide">Registered</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pink-100">
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-pink-50/40 transition">
                        <td className="px-6 py-4 font-medium text-pink-900 whitespace-nowrap">{s.name}</td>
                        <td className="px-6 py-4 text-pink-600">
                          <a href={`mailto:${s.email}`} className="hover:text-pink-800 transition">{s.email}</a>
                        </td>
                        <td className="px-6 py-4 text-pink-400 hidden md:table-cell">{s.phone || '—'}</td>
                        <td className="px-6 py-4 text-pink-400 hidden lg:table-cell max-w-xs truncate">{s.message || '—'}</td>
                        <td className="px-6 py-4 text-pink-400 whitespace-nowrap">{formatDate(s.registeredAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-pink-100 flex items-center justify-between">
                <p className="text-sm text-pink-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchSignups(page - 1)}
                    disabled={page <= 1}
                    className="px-4 py-1.5 text-sm border border-pink-200 rounded-xl text-pink-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchSignups(page + 1)}
                    disabled={page >= totalPages}
                    className="px-4 py-1.5 text-sm border border-pink-200 rounded-xl text-pink-600 hover:bg-pink-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}
