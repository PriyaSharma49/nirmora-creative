-- Nirmora Creative — Contact Enquiries + Call Bookings
-- Run this once in the Supabase SQL editor (or `supabase db push` if you use
-- the CLI) against the project referenced by SUPABASE_URL in .env.
--
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).

create extension if not exists pgcrypto;

-- ============================================================================
-- CONTACT ENQUIRIES — "Send Message" submissions from ContactPanel.jsx.
-- Never turns into a booking; that's a separate table below.
-- ============================================================================
create table if not exists contact_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text,
  project_details text,
  status text not null default 'New',
  source text not null default 'Website',
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_enquiries_created_at on contact_enquiries (created_at desc);

-- ============================================================================
-- CALL BOOKINGS — "Book a Call" submissions from BookingModal.jsx.
-- booking_date/booking_time are stored as plain wall-clock values in the
-- booking's own timezone (IST) — not converted to UTC — so the displayed
-- time never drifts from what the customer actually picked.
-- ============================================================================
create table if not exists call_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text,
  project_details text,
  booking_date date not null,
  booking_time text not null, -- 'HH:MM' 24-hour, wall-clock in `timezone` below
  timezone text not null default 'Asia/Kolkata',
  status text not null default 'New', -- New | Cancelled
  reminder_24h_sent boolean not null default false,
  reminder_30m_sent boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_call_bookings_created_at on call_bookings (created_at desc);
create index if not exists idx_call_bookings_date on call_bookings (booking_date);

-- The double-booking guard. A *partial* unique index — only rows with
-- status <> 'Cancelled' participate — so a cancelled booking never blocks
-- someone else from taking that slot. This is enforced by Postgres itself,
-- so two simultaneous booking requests for the same slot cannot both
-- succeed: the second insert fails with a 23505 unique_violation, which the
-- API turns into a clean 409 "slot no longer available" response.
create unique index if not exists uniq_active_booking_slot
  on call_bookings (booking_date, booking_time)
  where status <> 'Cancelled';

-- Fast lookup for the reminder cron: "bookings in the next ~25 hours that
-- still need a reminder."
create index if not exists idx_call_bookings_reminder_lookup
  on call_bookings (booking_date, booking_time)
  where status <> 'Cancelled';
