-- Create urls table (new name to avoid conflicts)
create table if not exists public.urls (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  original_url text not null,
  slug text not null unique,
  clicks integer default 0,
  user_id uuid default auth.uid()
);

-- Enable RLS
alter table public.urls enable row level security;

-- Create policies (ALL PUBLIC to avoid permission errors)

-- 1. Allow public insert
create policy "Public can create urls"
  on public.urls for insert
  to public
  with check (true);

-- 2. Allow public read
create policy "Public can read urls"
  on public.urls for select
  to public
  using (true);

-- 3. Allow public update (for clicks)
create policy "Public can update urls"
  on public.urls for update
  to public
  using (true);
