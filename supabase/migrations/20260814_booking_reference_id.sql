-- Adds a short, human-facing booking ID to call_bookings (CALL-001, ...),
-- mirroring the contact_enquiries submission_id migration exactly — same
-- atomic-sequence approach, same UUID-stays-internal principle. NRM- for
-- Contact and CALL- for Booking are two deliberately independent
-- sequences/prefixes — a Contact submission never consumes a CALL number
-- and vice versa.
--
-- Replaces this file's earlier version (never applied, so no live column
-- to migrate away from) which used 2-digit padding (CALL-01); confirmed
-- live that call_bookings has zero rows, so no data to migrate.
--
-- Safe to re-run: idempotent, backfills any pre-existing rows.

create sequence if not exists call_booking_seq;

alter table call_bookings
  add column if not exists booking_id text;

alter table call_bookings
  alter column booking_id set default ('CALL-' || lpad(nextval('call_booking_seq')::text, 3, '0'));

do $$
declare
  r record;
begin
  for r in
    select id from call_bookings where booking_id is null order by created_at asc
  loop
    update call_bookings
      set booking_id = 'CALL-' || lpad(nextval('call_booking_seq')::text, 3, '0')
      where id = r.id;
  end loop;
end $$;

alter table call_bookings
  alter column booking_id set not null;

create unique index if not exists uniq_call_booking_id on call_bookings (booking_id);
