
-- Create jobs table
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid not null,
  pickup text not null,
  dropoff text not null,
  time timestamptz not null,
  payout numeric not null,
  vehicle_type text,
  notes text,
  status text not null default 'available',
  claimed_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable Row Level Security (RLS)
alter table public.jobs enable row level security;

-- Policy: Anyone authenticated can see available jobs
create policy "Authenticated users can view jobs"
  on public.jobs
  for select
  using (true);

-- Policy: Only authenticated users can insert jobs for themselves as poster
create policy "Job posters can insert their own jobs"
  on public.jobs
  for insert
  with check (auth.uid() = poster_id);

-- Policy: Poster or claimer can update their jobs
create policy "Poster or claimer can update jobs"
  on public.jobs
  for update
  using (
    auth.uid() = poster_id
    or (claimed_by is not null and auth.uid() = claimed_by)
  );

-- Policy: Only poster can delete jobs
create policy "Only poster can delete jobs"
  on public.jobs
  for delete
  using (auth.uid() = poster_id);

-- Add foreign keys for data integrity
alter table public.jobs
  add constraint fk_poster foreign key (poster_id) references profiles(id) on delete cascade;

alter table public.jobs
  add constraint fk_claimer foreign key (claimed_by) references profiles(id);

