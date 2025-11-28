-- Create links table
create table public.links (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  original_url text not null,
  slug text not null unique,
  clicks integer default 0,
  user_id uuid references auth.users default auth.uid()
);

-- Enable RLS
alter table public.links enable row level security;

-- Create policies
create policy "Users can view their own links"
  on public.links for select
  using (auth.uid() = user_id);

create policy "Users can create links"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on public.links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on public.links for delete
  using (auth.uid() = user_id);

-- Allow public read access for redirection
create policy "Public can read links"
  on public.links for select
  to public
  using (true);

-- Create analytics table (optional for now)
create table public.analytics (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  link_id uuid references public.links on delete cascade not null,
  country text,
  device text,
  referrer text
);

alter table public.analytics enable row level security;

create policy "Users can view analytics for their links"
  on public.analytics for select
  using (
    exists (
      select 1 from public.links
      where public.links.id = public.analytics.link_id
      and public.links.user_id = auth.uid()
    )
  );
