-- ============================================================
-- Alpha Science Lab — Timeline Database Tables Schema
-- ============================================================

-- 1. TIMELINE POSTS TABLE
create table if not exists public.timeline_posts (
    id uuid primary key default gen_random_uuid(),
    author_name text not null,
    author_email text,
    author_role text default 'Member',
    author_avatar text,
    content text not null,
    image_url text,
    tags jsonb default '[]'::jsonb,
    category text default 'General',
    likes_count integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. TIMELINE REACTIONS TABLE
create table if not exists public.timeline_reactions (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.timeline_posts(id) on delete cascade,
    user_email text not null,
    reaction text not null, -- 'Like', 'Love', 'Care', 'Haha', 'Wow', 'Sad', 'Angry'
    created_at timestamptz default now(),
    unique(post_id, user_email)
);

-- 3. TIMELINE COMMENTS TABLE
create table if not exists public.timeline_comments (
    id uuid primary key default gen_random_uuid(),
    post_id uuid references public.timeline_posts(id) on delete cascade,
    parent_id uuid references public.timeline_comments(id) on delete cascade,
    author_name text not null,
    author_email text,
    author_avatar text,
    content text not null,
    created_at timestamptz default now()
);

-- RLS Security
alter table public.timeline_posts enable row level security;
alter table public.timeline_reactions enable row level security;
alter table public.timeline_comments enable row level security;

create policy "Allow public read timeline_posts" on public.timeline_posts for select using (true);
create policy "Allow public insert timeline_posts" on public.timeline_posts for insert with check (true);
create policy "Allow public update timeline_posts" on public.timeline_posts for update using (true);
create policy "Allow public delete timeline_posts" on public.timeline_posts for delete using (true);

create policy "Allow public read timeline_reactions" on public.timeline_reactions for select using (true);
create policy "Allow public write timeline_reactions" on public.timeline_reactions for all using (true);

create policy "Allow public read timeline_comments" on public.timeline_comments for select using (true);
create policy "Allow public write timeline_comments" on public.timeline_comments for all using (true);
