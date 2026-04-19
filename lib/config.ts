// Configuration for booking calendar
// Days of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

export const BOOKING_CONFIG = {
  // Which days of the week are available for bookings
  // Current: Monday-Friday (business days)
  // To include weekends: [0, 1, 2, 3, 4, 5, 6]
  availableDays: [1, 2, 3, 4, 5],

  // Time slots available for booking
  timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],

  // Service type
  serviceType: 'Financial Planning',

  // Admin WhatsApp number for reference in messages
  adminWhatsApp: '+91 9270109539',
}

// Helper function to get day name
export function getDayName(dayOfWeek: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return days[dayOfWeek]
}

// Helper function to check if day is available
export function isDayAvailable(dayOfWeek: number): boolean {
  return BOOKING_CONFIG.availableDays.includes(dayOfWeek)
}
