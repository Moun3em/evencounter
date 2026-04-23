-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── organizations ────────────────────────────────────────────────────
create table if not exists organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  owner_id   uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table organizations enable row level security;

create policy "org_owner_select" on organizations
  for select using (auth.uid() = owner_id);

create policy "org_owner_insert" on organizations
  for insert with check (auth.uid() = owner_id);

create policy "org_owner_update" on organizations
  for update using (auth.uid() = owner_id);

-- Auto-create org on first sign-up
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into organizations (name, owner_id)
  values (
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.id
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ── events ───────────────────────────────────────────────────────────
create type event_status as enum ('draft', 'active', 'closed');

create table if not exists events (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references organizations(id) on delete cascade,
  name       text not null,
  date       date not null,
  venue      text,
  capacity   integer,
  status     event_status not null default 'draft',
  scan_pin   text not null,
  created_at timestamptz not null default now()
);

alter table events enable row level security;

create policy "event_org_select" on events
  for select using (
    org_id in (select id from organizations where owner_id = auth.uid())
  );

create policy "event_org_insert" on events
  for insert with check (
    org_id in (select id from organizations where owner_id = auth.uid())
  );

create policy "event_org_update" on events
  for update using (
    org_id in (select id from organizations where owner_id = auth.uid())
  );

-- ── attendees ────────────────────────────────────────────────────────
create table if not exists attendees (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null references events(id) on delete cascade,
  name        text not null,
  phone       text,
  email       text,
  card_token  text not null unique,
  created_at  timestamptz not null default now(),
  constraint attendee_contact check (phone is not null or email is not null)
);

alter table attendees enable row level security;

-- Attendees are readable by anyone with the card_token (via API route, not direct)
-- Dashboard reads are restricted to org owner
create policy "attendee_org_select" on attendees
  for select using (
    event_id in (
      select e.id from events e
      join organizations o on o.id = e.org_id
      where o.owner_id = auth.uid()
    )
  );

create policy "attendee_org_insert" on attendees
  for insert with check (
    event_id in (
      select e.id from events e
      join organizations o on o.id = e.org_id
      where o.owner_id = auth.uid()
    )
  );

create policy "attendee_org_update" on attendees
  for update using (
    event_id in (
      select e.id from events e
      join organizations o on o.id = e.org_id
      where o.owner_id = auth.uid()
    )
  );

-- ── check_ins ────────────────────────────────────────────────────────
create table if not exists check_ins (
  id              uuid primary key default gen_random_uuid(),
  attendee_id     uuid not null references attendees(id) on delete cascade,
  event_id        uuid not null references events(id) on delete cascade,
  checked_in_at   timestamptz not null default now(),
  scanner_session text,
  unique(attendee_id)  -- prevents duplicate check-ins at DB level
);

alter table check_ins enable row level security;

-- Allow anonymous inserts (scan page uses anon key + service-role API route)
-- Reads restricted to org owner
create policy "checkin_org_select" on check_ins
  for select using (
    event_id in (
      select e.id from events e
      join organizations o on o.id = e.org_id
      where o.owner_id = auth.uid()
    )
  );

-- Insert via service_role API route only (no direct client insert policy needed)

-- ── Indexes ──────────────────────────────────────────────────────────
create index events_org_id_idx on events(org_id);
create index attendees_event_id_idx on attendees(event_id);
create index attendees_card_token_idx on attendees(card_token);
create index check_ins_event_id_idx on check_ins(event_id);
