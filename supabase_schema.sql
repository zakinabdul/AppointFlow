
-- aEnable UUID extension
crete extension if not exists "uuid-ossp";

-- Profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  organization_name text,
  website text,
  avatar_url text
);

-- Events table
create table events (
  id uuid default uuid_generate_v4() primary key,
  organizer_id uuid references profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  description text,
  event_type text check (event_type in ('online', 'in-person')) not null,
  location text, -- URL for online, Address for in-person
  start_date date not null,
  start_time time not null,
  end_date date,
  end_time time,
  registration_deadline timestamp with time zone,
  capacity integer,
  current_registrations integer default 0
);

-- Registrations table
create table registrations (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references events(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  full_name text not null,
  email text not null,
  phone text,
  status text not null, -- attended, registered, cancelled
  professional_status text
);

-- Row Level Security (RLS)

-- Profiles: 
-- Public read access (for showing organizer name on public event pages) -> actually maybe restricted?
-- For now, let's allow public read of basic profile info if needed, but strict update.
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Events:
-- Public read access for all events (or at least those with a link).
-- Organizer create/update/delete their own events.
alter table events enable row level security;

create policy "Events are viewable by everyone."
  on events for select
  using ( true );

create policy "Organizers can insert their own events."
  on events for insert
  with check ( auth.uid() = organizer_id );

create policy "Organizers can update their own events."
  on events for update
  using ( auth.uid() = organizer_id );

create policy "Organizers can delete their own events."
  on events for delete
  using ( auth.uid() = organizer_id );

-- Registrations:
-- Public insert (for registering).
-- Organizers can view registrations for their events.
alter table registrations enable row level security;

create policy "Anyone can register."
  on registrations for insert
  with check ( true );

create policy "Organizers can view registrations for their own events."
  on registrations for select
  using ( exists (
    select 1 from events
    where events.id = registrations.event_id
    and events.organizer_id = auth.uid()
  ));
