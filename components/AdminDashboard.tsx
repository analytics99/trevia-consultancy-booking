'use client'
import { useEffect, useState } from 'react'
import AvailabilitySettings from './AvailabilitySettings'

interface Booking {
  id: string
  name: string
  email: string
  phone: string
  whatsapp_number: string
  date: string
  time: string
  service: string
  status: 'pending' | 'approved' | 'rejected'
  notes: string
  created_at: string
}

function buildWhatsAppLink(booking: Booking): string {
  const whatsapp = (booking.whatsapp_number || booking.phone).replace(/\D/g, '')
  const number = whatsapp.startsWith('91') ? whatsapp : `91${whatsapp}`

  const formattedDate = new Date(booking.date + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const message = `Dear ${booking.name},\n\nYour Financial Planning consultation with Trevia Consultancy has been approved for ${formattedDate} at ${booking.time}.\n\nWe look forward to meeting you!\n\nBest regards,\nTrevia Consultancy\n+91 9270109539`

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [view, setView] = useState<'bookings' | 'settings'>('bookings')

  async function fetchBookings() {
    const res = await fetch('/api/bookings')
    if (res.ok) setBookings(await res.json())
    setLoading(false)
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  async function updateStatus(id: string, status: 'approved' | 'rejected') {
    setUpdatingId(id)
    await fetch(`/api/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
    setUpdatingId(null)
    fetchBookings()
  }

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const statusBadge = (status: string) => {
    const map = {
      pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
      approved: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      rejected: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[status as keyof typeof map]}`}>{status}</span>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Admin Dashboard</h1>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setView('bookings')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${view === 'bookings'
                ? 'bg-slate-800 dark:bg-amber-500 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >Bookings</button>
          <button
            onClick={() => setView('settings')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${view === 'settings'
                ? 'bg-slate-800 dark:bg-amber-500 text-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >Settings</button>
        </div>
      </div>

      {view === 'settings' && (
        <AvailabilitySettings />
      )}

      {view === 'bookings' && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Manage Bookings</h2>
            <div className="flex gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                <button key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors
                    ${filter === f
                      ? 'bg-slate-800 dark:bg-amber-500 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >{f}</button>
              ))}
            </div>
          </div>

      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading bookings...</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 text-left">
              <tr>
                {['Client', 'Contact', 'Service', 'Date & Time', 'Notes', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(b => (
                <tr key={b.id} className="bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-800 dark:text-slate-100">{b.name}</div>
                    <div className="text-xs text-slate-400">{new Date(b.created_at).toLocaleDateString('en-IN')}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-600 dark:text-slate-300 text-sm">{b.email}</div>
                    <div className="text-slate-500 dark:text-slate-400 text-xs">{b.phone}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{b.service}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-700 dark:text-slate-200">{b.date}</div>
                    <div className="text-xs text-slate-400">{b.time}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs max-w-[150px] truncate">{b.notes || '—'}</td>
                  <td className="px-4 py-3">{statusBadge(b.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(b.id, 'approved')}
                            disabled={updatingId === b.id}
                            className="px-2.5 py-1 rounded-lg bg-green-600 hover:bg-green-500 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                          >Approve</button>
                          <button
                            onClick={() => updateStatus(b.id, 'rejected')}
                            disabled={updatingId === b.id}
                            className="px-2.5 py-1 rounded-lg bg-red-500 hover:bg-red-400 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                          >Reject</button>
                        </>
                      )}
                      {b.status === 'approved' && (
                        <a
                          href={buildWhatsAppLink(b)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-semibold transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Send WhatsApp
                        </a>
                      )}
                      {b.status === 'rejected' && (
                        <span className="text-xs text-slate-400 dark:text-slate-600">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-400 dark:text-slate-600">No bookings found</div>
          )}
        </div>
      )}
        </>
      )}
    </div>
  )
}
