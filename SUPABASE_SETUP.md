# Supabase Setup — Complete Instructions

## 1. Create the `bookings` table

In Supabase SQL Editor, run:

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

## 2. Create the `availability` table (NEW)

This table stores which days are available for booking (0-6, where 0=Sunday, 6=Saturday).

In Supabase SQL Editor, run:

```sql
create table availability (
  id int primary key default 1,
  available_days int4array default array[0, 1, 2, 3, 4, 5, 6]::int4[],
  updated_at timestamptz default now()
);

alter table availability enable row level security;

-- Allow anyone to read availability
create policy "allow_public_read" on availability
  for select to anon with check (true);

-- Only service role can update (used by admin API)
create policy "allow_service_update" on availability
  for update to service_role with check (true);

-- Insert default row
insert into availability (id, available_days) values (1, array[0, 1, 2, 3, 4, 5, 6]::int4[]);
```

## 3. Configure RLS for Both Tables

For the `bookings` table:
- ✅ Public INSERT (clients can book)
- ✅ Public SELECT forbidden (only admin can read via service role)

For the `availability` table:
- ✅ Public READ (public booking page fetches this)
- ✅ Service role UPDATE (admin API updates this)

## 4. Verify Setup

**In Supabase:**
1. Go to **Table Editor**
2. You should see both tables:
   - `bookings` with fields: id, name, email, phone, whatsapp_number, notes, date, time, service, status, created_at
   - `availability` with fields: id, available_days, updated_at
3. Click `availability` → you should see 1 row with default all days available: `[0,1,2,3,4,5,6]`

## 5. Test the Admin Feature

1. Deploy to Vercel or run locally
2. Visit `/admin` → enter password
3. Go to **Settings** tab
4. Select/deselect days → Click "Save Availability"
5. Go to `/` (booking page) → calendar should update to reflect selected days

---

## Troubleshooting

**Q: Availability table doesn't exist**  
A: Paste the SQL above and run it. Make sure you see no errors.

**Q: Admin can't update availability**  
A: Check that your `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` is correct.

**Q: Calendar not updating after admin changes**  
A: The calendar fetches availability on page load. Refresh the booking page after making changes in admin.

**Q: Getting "permission denied" error**  
A: Check RLS policies are correctly set up. `allow_public_read` and `allow_service_update` should exist on the availability table.
