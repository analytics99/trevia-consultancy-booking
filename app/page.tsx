'use client'
import { useState, useCallback } from 'react'
import Calendar from '@/components/Calendar'
import BookingForm from '@/components/BookingForm'

export default function BookingPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])

  async function handleDateSelect(iso: string) {
    setSelectedDate(iso)
    setSelectedTime(null)
    const res = await fetch(`/api/bookings?date=${iso}`)
    if (res.ok) {
      const data = await res.json()
      setBookedSlots(data.bookedTimes ?? [])
    }
  }

  function handleSuccess() {
    if (selectedDate) handleDateSelect(selectedDate)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          Book a Consultation
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Schedule your Financial Planning session with Trevia Consultancy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Calendar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          bookedSlots={bookedSlots}
          onDateSelect={handleDateSelect}
          onTimeSelect={setSelectedTime}
        />
        <BookingForm
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  )
}
