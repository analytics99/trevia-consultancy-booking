# Customization Guide — Trevia Consultancy Booking Calendar

## Quick Customizations

### 1. Available Days of the Week

By default, bookings are available **Monday through Friday** (business days).

**To enable weekends**, edit `lib/config.ts`:

```typescript
export const BOOKING_CONFIG = {
  // Change this line:
  availableDays: [1, 2, 3, 4, 5],  // Current: Mon-Fri only
  
  // To include weekends:
  availableDays: [0, 1, 2, 3, 4, 5, 6],  // All days (Sun-Sat)
  
  // Or custom selection:
  availableDays: [1, 2, 3, 4, 5, 6],     // Mon-Sat (no Sunday)
  availableDays: [0, 1, 2, 3, 4],        // Sun-Thu only
}
```

**Day numbers:**
- 0 = Sunday
- 1 = Monday
- 2 = Tuesday
- 3 = Wednesday
- 4 = Thursday
- 5 = Friday
- 6 = Saturday

Save the file → deploy to Vercel → changes go live instantly.

---

### 2. Time Slots

Edit `lib/config.ts`:

```typescript
timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
```

Change to any times you prefer:
```typescript
timeSlots: ['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM']
```

---

### 3. Service Type Name

Edit `lib/config.ts`:

```typescript
serviceType: 'Financial Planning'
```

Change to:
```typescript
serviceType: 'Tax Advisory'  // or any other service
```

---

### 4. Admin WhatsApp Number

Edit `lib/config.ts`:

```typescript
adminWhatsApp: '+91 9270109539'
```

---

### 5. Logo Images

To use different logos:

1. Replace files in `public/logos/`:
   - `logo-silver.png` (light mode icon)
   - `logo-name-silver.png` (light mode text)
   - `logo-gold.png` (dark mode icon)
   - `logo-name-gold.png` (dark mode text)

2. Or update paths in `app/layout.tsx`:

```typescript
<img
  src="/logos/your-custom-logo.png"
  alt="Trevia Consultancy"
  className="h-10 dark:hidden"
/>
```

---

### 6. Admin Password

Edit `.env.local`:

```
ADMIN_PASSWORD=trevia_admin_2026
```

Change to a secure password (then update in Vercel env vars too).

---

### 7. Color Theme

The app uses Tailwind's slate palette with gold accents. Colors are in component classes:

**Light mode button:**
```html
bg-slate-800  <!-- Dark slate button -->
```

**Dark mode button:**
```html
dark:bg-amber-500  <!-- Gold button -->
```

To change to blue accents, replace all `amber-500` with `blue-500` (or any Tailwind color).

---

## Advanced Customizations

### Disable Past Date Blocking

In `components/Calendar.tsx`, change:

```typescript
return d < todayNorm || !AVAILABLE_DAYS.includes(dow)
```

to:

```typescript
return !AVAILABLE_DAYS.includes(dow)
```

Now past dates are bookable (not recommended).

---

### Change Booking Form Fields

Edit `components/BookingForm.tsx` to add/remove fields:

```typescript
// Add a new field
<div class="form-group">
  <label>Company Name</label>
  <input type="text" value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} />
</div>

// Remove a field by deleting its div
```

Update the API to handle the new field:

In `app/api/bookings/route.ts`:
```typescript
const { name, email, phone, company, date, time } = body
```

---

### Change WhatsApp Message Template

Edit `components/AdminDashboard.tsx`, in `buildWhatsAppLink()`:

```typescript
const message = `Dear ${booking.name},\n\nYour appointment is approved for ${formattedDate} at ${booking.time}.\n\nLooking forward to meeting you!\n\nBest,\nTrevia Consultancy`
```

---

### Change Booking Summary Box

Edit `components/BookingForm.tsx`:

```typescript
<div className="flex justify-between text-sm mb-2">
  <span>Service</span>
  <span>Financial Planning</span>
</div>
```

Add more fields like location, duration, etc.

---

## Testing Changes Locally

After editing config:

```bash
cd trevia-consultancy-booking
npm run dev
```

Visit `http://localhost:3000` → changes visible immediately.

---

## Deploying Changes

1. **Commit changes:**
   ```bash
   git add .
   git commit -m "customize: enable weekends and adjust times"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin master
   ```

3. **Vercel deploys automatically** → your live site updates in seconds.

---

## Common Changes Checklist

- [ ] Set available days (Mon-Fri, weekends, custom)
- [ ] Configure time slots
- [ ] Update service type name
- [ ] Set admin password
- [ ] Add your logos to `public/logos/`
- [ ] Test locally (`npm run dev`)
- [ ] Push to GitHub → Vercel auto-deploys

---

## Configuration Priority

When changes are made, **config.ts is the source of truth**. Update it once, and it propagates to:
- Calendar component
- Booking form
- Demo page
- All API routes

No need to edit multiple files.
