-- Adds a short, human-facing submission ID to contact_enquiries
-- (NRM-001, NRM-002, ...) without disturbing the existing UUID primary
-- key — the UUID stays as `id` for internal/relational use, `submission_id`
-- is the one shown to users, staff and the Google Sheet.
--
-- A Postgres SEQUENCE (not "count rows + 1") is what makes this safe under
-- concurrent submissions — nextval() is atomic at the database level, so
-- two simultaneous inserts can never receive the same number. It's also
-- naturally gap-tolerant in the direction that matters: it never reuses a
-- number, so a deleted row never causes a later collision, but it also
-- never "fills in" a gap — the next value is always higher than any value
-- it has already handed out.
--
-- NRM- for Contact and CALL- for Booking (20260814_booking_reference_id.sql)
-- are two deliberately independent sequences/prefixes per explicit
-- request — a Contact submission never consumes a CALL number and vice
-- versa. This file was never applied (confirmed live: contact_enquiries
-- has no submission_id column yet), so there is no live data to migrate.
--
-- Safe to re-run: idempotent, and backfills only rows that don't already
-- have a submission_id.

create sequence if not exists contact_submission_seq;

alter table contact_enquiries
  add column if not exists submission_id text;

alter table contact_enquiries
  alter column submission_id set default ('NRM-' || lpad(nextval('contact_submission_seq')::text, 3, '0'));

-- Backfill any existing rows (in creation order) that predate this column.
do $$
declare
  r record;
begin
  for r in
    select id from contact_enquiries where submission_id is null order by created_at asc
  loop
    update contact_enquiries
      set submission_id = 'NRM-' || lpad(nextval('contact_submission_seq')::text, 3, '0')
      where id = r.id;
  end loop;
end $$;

alter table contact_enquiries
  alter column submission_id set not null;

create unique index if not exists uniq_contact_submission_id on contact_enquiries (submission_id);
