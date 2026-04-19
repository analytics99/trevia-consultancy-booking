'use client'
import { useEffect, useState } from 'react'

const DAYS = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
]

export default function AvailabilitySettings() {
  const [availableDays, setAvailableDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  async function fetchAvailability() {
    const res = await fetch('/api/availability')
    if (res.ok) {
      const data = await res.json()
      setAvailableDays(data.available_days)
    }
    setLoading(false)
  }

  async function saveAvailability() {
    setSaving(true)
    const res = await fetch('/api/availability', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available_days: availableDays })
    })
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  function toggleDay(day: number) {
    setAvailableDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400">Loading...</p>

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
        Availability Settings
      </h2>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        Select which days clients can book consultations
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {DAYS.map(day => (
          <label key={day.value} className="flex items-center gap-2 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            <input
              type="checkbox"
              checked={availableDays.includes(day.value)}
              onChange={() => toggleDay(day.value)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {day.label}
            </span>
          </label>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={saveAvailability}
          disabled={saving}
          className="flex-1 py-2.5 rounded-lg bg-slate-800 dark:bg-amber-500 text-white dark:text-slate-900
                     font-semibold text-sm hover:bg-slate-700 dark:hover:bg-amber-400 transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Availability'}
        </button>
      </div>

      {saved && (
        <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-700 dark:text-green-400 font-medium">
            ✓ Availability updated successfully
          </p>
        </div>
      )}
    </div>
  )
}
