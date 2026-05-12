import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {
  Users, Download, Search, Loader2, LogOut,
  ChevronLeft, ChevronRight, RefreshCw,
} from 'lucide-react'

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
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

  // Auth check on mount
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
      // auth redirect handled by /me check
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

  function handleExportCSV() {
    if (!signups.length) return
    const headers = ['Name', 'Email', 'Phone', 'Source', 'Signed Up']
    const rows = signups.map((s) => [
      s.name, s.email, s.phone || '', s.source || 'direct',
      new Date(s.registeredAt).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `plan-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filtered = signups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.includes(search))
  )

  // Loading spinner before auth
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard — Plan</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gray-50">

        {/* ── Navbar ────────────────────────────────────────────────── */}
        <nav className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <a href="/" className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xs">P</span>
                </div>
                <span className="font-bold text-gray-900 tracking-tight">Plan</span>
              </a>
              <span className="text-gray-300 ml-1 hidden sm:block">/ Admin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 hidden sm:block">{adminEmail}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* ── Header ──────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Waitlist</h1>
              <p className="text-gray-500 text-sm mt-1">
                {total} {total === 1 ? 'person' : 'people'} on the waitlist · page {page} of {totalPages}
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              disabled={!signups.length}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* ── Stat cards ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Total</p>
              <p className="text-4xl font-bold text-purple-600">{total}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">This page</p>
              <p className="text-4xl font-bold text-purple-600">{signups.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5 col-span-2 sm:col-span-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Pages</p>
              <p className="text-4xl font-bold text-purple-600">{totalPages}</p>
            </div>
          </div>

          {/* ── Table card ──────────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">

            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-semibold text-gray-900">All Sign-ups</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email or phone..."
                    className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-300 w-52 transition-all"
                  />
                </div>
                <button
                  onClick={() => fetchSignups(page)}
                  className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="font-medium text-gray-600">
                  {search ? 'No results found' : 'No waitlist entries yet'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {search ? 'Try adjusting your search query.' : 'Signups will appear here as people join.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Source</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Signed Up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{s.name}</td>
                        <td className="px-6 py-4 text-gray-600">
                          <a href={`mailto:${s.email}`} className="hover:text-purple-600 transition-colors">{s.email}</a>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{s.phone || '—'}</td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">
                            {s.source || 'direct'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{formatDate(s.registeredAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && !search && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * 50 + 1}–{Math.min(page * 50, total)} of {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchSignups(page - 1)}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={() => fetchSignups(page + 1)}
                    disabled={page >= totalPages}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight className="w-4 h-4" />
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
