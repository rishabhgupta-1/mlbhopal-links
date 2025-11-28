-- Create links table
create table if not exists public.links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  original_url text not null,
  slug text not null unique,
  clicks integer default 0,
  user_id uuid default auth.uid()
);

-- Enable RLS
alter table public.links enable row level security;

-- DROP EXISTING POLICIES TO AVOID CONFLICTS
drop policy if exists "Users can view their own links" on public.links;
drop policy if exists "Users can create links" on public.links;
drop policy if exists "Users can update their own links" on public.links;
drop policy if exists "Users can delete their own links" on public.links;
drop policy if exists "Public can read links" on public.links;

-- Create policies

-- 1. Allow public read access (for redirection)
create policy "Public can read links"
  on public.links for select
  to public
  using (true);

-- 2. Allow public insert access (since we haven't implemented Auth UI yet)
create policy "Public can create links"
  on public.links for insert
  to public
  with check (true);

-- 3. Allow public update (for click counting)
create policy "Public can update clicks"
  on public.links for update
  to public
  using (true);
