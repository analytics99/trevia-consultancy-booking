# Trevia Consultancy Booking Calendar — Setup Guide

## Overview
This is a production-ready Next.js 15 booking calendar application for Trevia Consultancy's financial consulting services. It features:
- Public booking page with interactive calendar and form
- Supabase backend for persistent storage
- Admin dashboard for approving/rejecting bookings
- WhatsApp pre-filled message links for approved bookings
- Light/Dark theme toggle (Silver & White / Navy & Gold)

**GitHub**: https://github.com/analytics99/trevia-consultancy-booking

---

## Phase 1: Supabase Setup

### 1. Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. **Name**: `trevia-consultancy`
4. **Region**: `ap-southeast-1` (Singapore — closest to India)
5. Create project
6. Wait for setup (1-2 minutes)

### 2. Get Your Keys

In Supabase dashboard:
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (format: `https://xxxxxxx.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)
   - **Service role secret** (starts with `eyJ...` — be careful with this)

### 3. Create Bookings Table

1. In Supabase, go to **SQL Editor**
2. Click **New Query**
3. Paste and run:

```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  whatsapp_number text,
  notes text,
  date text not null,
  time text not null,
  service text default 'Financial Planning',
  status text default 'pending',
  created_at timestamptz default now()
);

alter table bookings enable row level security;

create policy "allow_public_insert" on bookings
  for insert to anon with check (true);
```

Done! Your Supabase project is ready.

---

## Phase 2: Local Environment Setup

### 1. Update `.env.local`

Edit `trevia-consultancy-booking/.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
ADMIN_PASSWORD=trevia_admin_2026
```

**Save this file securely.** Never commit it to Git (it's in `.gitignore`).

### 2. Install Dependencies (if not already done)

```bash
cd trevia-consultancy-booking
npm install
```

### 3. Test Locally

```bash
npm run dev
```

Open **http://localhost:3000** in your browser.

**Test the flow:**
1. Select a weekday date (weekends/past dates disabled)
2. Pick a time slot
3. Fill the form → "Request Appointment"
4. You should see a success message
5. Go to http://localhost:3000/admin
6. Enter password: `trevia_admin_2026`
7. Your booking should appear as "Pending"
8. Click "Approve"
9. Click "Send WhatsApp" → opens WhatsApp with pre-filled message

---

## Phase 3: Vercel Deployment

### 1. Push to GitHub

Code is already pushed to: https://github.com/analytics99/trevia-consultancy-booking

### 2. Deploy to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Search for `trevia-consultancy-booking`
4. Select it
5. Framework: **Next.js** (auto-detected)
6. **Environment Variables**: Add the same 4 from `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
7. Click **Deploy**

**Live site** will be at: `trevia-consultancy-booking.vercel.app`

---

## Configuration Reference

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL (public) | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for bookings | `eyJ0eXAi...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key (secret) | `eyJ0eXAi...` |
| `ADMIN_PASSWORD` | Password to access `/admin` | `trevia_admin_2026` |

---

## File Structure

```
trevia-consultancy-booking/
├── app/
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Public booking page
│   ├── globals.css             # Tailwind styles
│   ├── admin/
│   │   └── page.tsx            # Admin dashboard
│   └── api/
│       ├── bookings/
│       │   ├── route.ts        # GET/POST bookings
│       │   └── [id]/
│       │       └── route.ts    # PATCH booking status
│       └── admin-login/
│           └── route.ts        # Password verification
├── components/
│   ├── Calendar.tsx            # Calendar widget
│   ├── BookingForm.tsx         # Booking form
│   ├── ThemeToggle.tsx         # Light/dark toggle
│   ├── AdminLogin.tsx          # Admin password form
│   └── AdminDashboard.tsx      # Bookings table
├── lib/
│   └── supabase.ts             # Supabase clients
├── public/
│   └── logos/
│       ├── logo-gold.png
│       ├── logo-name-gold.png
│       ├── logo-silver.png
│       └── logo-name-silver.png
└── .env.local                  # Credentials (gitignored)
```

---

## Key Features

### 1. Public Booking Page (`/`)
- Interactive calendar (disabled: weekends, past dates)
- Time slot selection (6 slots/day)
- Booking form with name, email, phone, WhatsApp number, notes
- Real-time slot availability check (booked slots grayed out)
- Success confirmation on submission

### 2. Admin Dashboard (`/admin`)
- Password-protected (httpOnly cookie auth)
- View all bookings, filter by status (Pending/Approved/Rejected)
- Approve → status changes, WhatsApp button appears
- Reject → booking marked as rejected
- WhatsApp button opens `wa.me/{number}?text={message}` with pre-filled approval message

### 3. Theme Toggle
- Light mode: Silver & White
- Dark mode: Navy & Gold
- Logo switches automatically (Silver ↔ Gold)
- No flicker, persisted in `next-themes`

### 4. Database (Supabase)
- `bookings` table with fields: id, name, email, phone, whatsapp_number, notes, date, time, service, status, created_at
- RLS enabled: public users can INSERT only; admin reads via service role key
- Rejected bookings free up time slots

---

## Customization

### Change Admin Password
Edit `.env.local`:
```
ADMIN_PASSWORD=your_secure_password_here
```

### Change Time Slots
In `components/Calendar.tsx`, edit:
```typescript
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
```

### Change Service Type
In `app/api/bookings/route.ts` and `components/BookingForm.tsx`, change:
```typescript
service: 'Financial Planning'
```

### Change Admin WhatsApp Message
In `components/AdminDashboard.tsx`, edit the `message` template in `buildWhatsAppLink()`.

### Change Colors
Colors use Tailwind's slate palette with dark mode variants. Edit `app/layout.tsx` and component classes to change the silver/gold scheme.

---

## Troubleshooting

### "Missing required fields" error
Ensure all required form fields are filled: name, email, phone, date, time.

### "This time slot is already booked"
Refresh the page. Someone else booked the same slot. Select a different time.

### Admin password not working
Check `.env.local` → `ADMIN_PASSWORD` matches what you typed.

### Bookings not showing up
1. Check Supabase dashboard → `bookings` table (should have rows)
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is correct in `.env.local`
3. Run `npm run dev` again to pick up env changes

### Theme not persisting
`next-themes` stores theme in `localStorage`. Clear browser cache or try incognito mode.

### WhatsApp link not opening
Ensure the client's phone number includes country code (e.g., +91 for India). The app auto-prepends 91 if missing.

---

## Maintenance

### Monitoring Bookings
- Visit `/admin` regularly to approve pending bookings
- Rejected bookings automatically free up the time slot
- All data is in Supabase — back it up via Supabase dashboard if needed

### Updating the App
```bash
git pull origin master
npm install
npm run dev
```

### Deploying Updates
Push to GitHub → Vercel auto-deploys within seconds.

---

## Support

For issues, check:
1. `.env.local` — all 4 keys set correctly?
2. Supabase table exists and RLS is enabled?
3. GitHub repo is public for Vercel deployment?
4. Vercel env vars match `.env.local`?

---

## Next Steps

1. ✅ Scaffold Next.js app
2. ✅ Create Supabase project and table
3. ✅ Configure local environment
4. ✅ Push to GitHub
5. **TODO**: Update Supabase credentials in `.env.local`
6. **TODO**: Test locally (`npm run dev`)
7. **TODO**: Deploy to Vercel and add env vars
8. **TODO**: Share live URL with clients
