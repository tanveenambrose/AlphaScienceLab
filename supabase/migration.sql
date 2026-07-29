-- ============================================================
-- Alpha Science Lab — Supabase Migration
-- Run this in your Supabase SQL Editor after creating the project
-- ============================================================

-- 1. PROJECTS
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    category text not null,
    image_url text,
    tags jsonb default '[]'::jsonb,
    status text default 'draft',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. MEMBERS
create table if not exists public.members (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    role text,
    department text,
    batch text,
    image_url text,
    bio text,
    social_links jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. JOIN REQUESTS
create table if not exists public.join_requests (
    id uuid primary key default gen_random_uuid(),
    first_name text not null,
    last_name text not null,
    department text not null,
    batch text not null,
    semester text not null,
    email text not null,
    interest text not null,
    skills text,
    hours text not null,
    reason text not null,
    status text default 'pending',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. GALLERY
create table if not exists public.gallery (
    id uuid primary key default gen_random_uuid(),
    image_url text not null,
    caption text,
    category text,
    created_at timestamptz default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.projects enable row level security;
alter table public.members enable row level security;
alter table public.join_requests enable row level security;
alter table public.gallery enable row level security;

-- Allow public read access
create policy "Allow public read" on public.projects for select using (true);
create policy "Allow public read" on public.members for select using (true);
create policy "Allow public read" on public.gallery for select using (true);

-- Join requests: anyone can insert (public form)
create policy "Allow public insert" on public.join_requests for insert with check (true);

-- Admin-only write access (authenticated users from Supabase Auth)
create policy "Allow authenticated insert" on public.projects for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.projects for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on public.projects for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert" on public.members for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.members for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on public.members for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated select" on public.join_requests for select using (auth.role() = 'authenticated');
create policy "Allow authenticated update" on public.join_requests for update using (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on public.join_requests for delete using (auth.role() = 'authenticated');

create policy "Allow authenticated insert" on public.gallery for insert with check (auth.role() = 'authenticated');
create policy "Allow authenticated delete" on public.gallery for delete using (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET for uploads
-- ============================================================
-- After running the SQL, create a bucket named 'uploads' in the Supabase Dashboard:
-- Storage → New bucket → name: 'uploads' → Public bucket ✓
--
-- Then add this policy in Storage → Policies:
-- CREATE POLICY "Allow public read" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
-- CREATE POLICY "Allow authenticated upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads' AND auth.role() = 'authenticated');
