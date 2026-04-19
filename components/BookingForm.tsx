'use client'
import { useState } from 'react'

interface BookingFormProps {
  selectedDate: string | null
  selectedTime: string | null
  onSuccess: () => void
}

export default function BookingForm({ selectedDate, selectedTime, onSuccess }: BookingFormProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', whatsapp_number: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const ready = selectedDate && selectedTime && form.name && form.email && form.phone

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          date: selectedDate,
          time: selectedTime,
          service: 'Financial Planning'
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Booking failed')
      }
      setSubmitted(true)
      onSuccess()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Booking Requested!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm max-w-xs">
          Your Financial Planning consultation request has been received. We will review and confirm your appointment shortly.
        </p>
      </div>
    )
  }

  const inputClass = `w-full px-3 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700
    bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100
    placeholder-slate-400 dark:placeholder-slate-500 text-sm
    focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-amber-500 focus:border-transparent
    transition-all`

  const labelClass = `block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1.5`

  function formatDate(iso: string) {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5">Your Booking</h2>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-5 border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500 dark:text-slate-400">Service</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">Financial Planning</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-500 dark:text-slate-400">Date</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">
            {selectedDate ? formatDate(selectedDate) : 'Select a date'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 dark:text-slate-400">Time</span>
          <span className="font-medium text-slate-700 dark:text-slate-200">{selectedTime || 'Select a time'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name *</label>
          <input className={inputClass} type="text" placeholder="John Smith" required
            value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
        </div>
        <div>
          <label className={labelClass}>Email Address *</label>
          <input className={inputClass} type="email" placeholder="john@example.com" required
            value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
        </div>
        <div>
          <label className={labelClass}>Phone Number *</label>
          <input className={inputClass} type="tel" placeholder="+91 98765 43210" required
            value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} />
        </div>
        <div>
          <label className={labelClass}>WhatsApp Number <span className="normal-case font-normal">(if different)</span></label>
          <input className={inputClass} type="tel" placeholder="Leave blank if same as phone"
            value={form.whatsapp_number} onChange={e => setForm(f => ({...f, whatsapp_number: e.target.value}))} />
        </div>
        <div>
          <label className={labelClass}>Additional Notes</label>
          <textarea className={`${inputClass} resize-none`} rows={3}
            placeholder="Tell us about your financial goals or any specific concerns..."
            value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} />
        </div>

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!ready || loading}
          className={`
            w-full py-3 rounded-xl font-semibold text-sm transition-all
            ${ready && !loading
              ? 'bg-slate-800 dark:bg-amber-500 text-white dark:text-slate-900 hover:bg-slate-700 dark:hover:bg-amber-400 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
            }
          `}
        >
          {loading ? 'Submitting...' : 'Request Appointment'}
        </button>
      </form>
    </div>
  )
}
