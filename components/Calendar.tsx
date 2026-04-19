'use client'
import { useState, useEffect } from 'react'
import { BOOKING_CONFIG } from '@/lib/config'

const TIME_SLOTS = BOOKING_CONFIG.timeSlots

interface CalendarProps {
  selectedDate: string | null
  selectedTime: string | null
  bookedSlots: string[]
  onDateSelect: (iso: string) => void
  onTimeSelect: (time: string) => void
}

export default function Calendar({ selectedDate, selectedTime, bookedSlots, onDateSelect, onTimeSelect }: CalendarProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [availableDays, setAvailableDays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])

  useEffect(() => {
    const fetchAvailability = async () => {
      const res = await fetch('/api/availability')
      if (res.ok) {
        const data = await res.json()
        setAvailableDays(data.available_days)
      }
    }
    fetchAvailability()
  }, [])

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const startOffset = firstDayOfMonth.getDay()

  const monthLabel = firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function isDisabled(day: number): boolean {
    const d = new Date(viewYear, viewMonth, day)
    const dow = d.getDay()
    const todayNorm = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return d < todayNorm || !AVAILABLE_DAYS.includes(dow)
  }

  function isoDate(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => {
            const d = new Date(viewYear, viewMonth - 1)
            setViewYear(d.getFullYear())
            setViewMonth(d.getMonth())
          }}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >← Prev</button>
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">{monthLabel}</h2>
        <button
          onClick={() => {
            const d = new Date(viewYear, viewMonth + 1)
            setViewYear(d.getFullYear())
            setViewMonth(d.getMonth())
          }}
          className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-sm
                     hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >Next →</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-slate-500 dark:text-slate-400 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const iso = isoDate(day)
          const disabled = isDisabled(day)
          const selected = selectedDate === iso
          return (
            <button
              key={i}
              disabled={disabled}
              onClick={() => onDateSelect(iso)}
              className={`
                aspect-square rounded-lg text-sm font-medium transition-all
                ${disabled ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' : 'cursor-pointer'}
                ${selected
                  ? 'bg-slate-700 dark:bg-amber-500 text-white dark:text-slate-900 font-semibold'
                  : disabled ? '' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                }
              `}
            >{day}</button>
          )
        })}
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">Available times</h3>
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map(slot => {
              const booked = bookedSlots.includes(slot)
              const sel = selectedTime === slot
              return (
                <button
                  key={slot}
                  disabled={booked}
                  onClick={() => onTimeSelect(slot)}
                  className={`
                    py-2.5 rounded-lg text-sm border transition-all
                    ${booked
                      ? 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed bg-slate-50 dark:bg-slate-900'
                      : sel
                        ? 'border-slate-700 dark:border-amber-500 bg-slate-700 dark:bg-amber-500 text-white dark:text-slate-900 font-semibold'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-slate-200'
                    }
                  `}
                >{slot}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
