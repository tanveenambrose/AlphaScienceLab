-- ============================================================
-- Alpha Science Lab — Supabase Enhanced Migration & Customization
-- ============================================================

-- 1. PROJECTS TABLE
create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    subtitle text,
    description text,
    category text not null,
    image_url text,
    color text default '#EC0D6E',
    link text,
    tags jsonb default '[]'::jsonb,
    status text default 'published',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Add missing columns if table already existed
alter table public.projects add column if not exists subtitle text;
alter table public.projects add column if not exists color text default '#EC0D6E';
alter table public.projects add column if not exists link text;

-- 2. MEMBERS TABLE
create table if not exists public.members (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text,
    role text,
    department text,
    batch text,
    class_roll text,
    registration text,
    mobile text,
    temp_password text,
    image_url text,
    image text,
    bio text,
    social_links jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. JOIN REQUESTS TABLE
create table if not exists public.join_requests (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    email text not null,
    department text not null,
    batch text not null,
    class_roll text not null,
    registration text not null,
    mobile text not null,
    photo_url text,
    status text default 'pending',
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. GALLERY TABLE
create table if not exists public.gallery (
    id uuid primary key default gen_random_uuid(),
    image_url text not null,
    caption text,
    title text,
    category text,
    created_at timestamptz default now()
);

alter table public.gallery add column if not exists title text;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.projects enable row level security;
alter table public.members enable row level security;
alter table public.join_requests enable row level security;
alter table public.gallery enable row level security;

-- Drop old policies if existing to avoid conflicts
drop policy if exists "Allow public read projects" on public.projects;
drop policy if exists "Allow public read members" on public.members;
drop policy if exists "Allow public read gallery" on public.gallery;
drop policy if exists "Allow public insert join_requests" on public.join_requests;
drop policy if exists "Allow full access service_role projects" on public.projects;
drop policy if exists "Allow full access service_role members" on public.members;
drop policy if exists "Allow full access service_role join_requests" on public.join_requests;
drop policy if exists "Allow full access service_role gallery" on public.gallery;

-- Create policies
create policy "Allow public read projects" on public.projects for select using (true);
create policy "Allow public read members" on public.members for select using (true);
create policy "Allow public read gallery" on public.gallery for select using (true);
create policy "Allow public insert join_requests" on public.join_requests for insert with check (true);

create policy "Allow full access service_role projects" on public.projects for all using (true);
create policy "Allow full access service_role members" on public.members for all using (true);
create policy "Allow full access service_role join_requests" on public.join_requests for all using (true);
create policy "Allow full access service_role gallery" on public.gallery for all using (true);

-- ============================================================
-- STORAGE BUCKET FOR UPLOADS
-- ============================================================
insert into storage.buckets (id, name, public) 
values ('uploads', 'uploads', true) 
on conflict (id) do nothing;

drop policy if exists "Allow public read uploads" on storage.objects;
drop policy if exists "Allow service role write uploads" on storage.objects;

create policy "Allow public read uploads" on storage.objects 
for select using (bucket_id = 'uploads');

create policy "Allow service role write uploads" on storage.objects 
for all using (bucket_id = 'uploads');

-- ============================================================
-- INITIAL SEED DATA
-- ============================================================

-- Clear previous sample data if needed (optional)
-- delete from public.projects;

insert into public.projects (title, subtitle, description, category, image_url, color, link, tags, status)
values 
(
  'Alpha Humanoid V2',
  'Autonomous Bipedal Robotics Platform',
  'Next-generation autonomous humanoid featuring neural locomotion policies, real-time spatial awareness, and dynamic balance recovery.',
  'Robotics',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop',
  '#EC0D6E',
  '/projects/robotics',
  '["Robotics", "AI", "Locomotion", "ROS2"]'::jsonb,
  'published'
),
(
  'Quantum Neural Engine',
  'Sub-Millisecond Quantum Simulation Platform',
  'Advanced simulation suite enabling real-time quantum state estimation and fault-tolerant circuit compilation.',
  'Quantum Computing',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop',
  '#7C3AED',
  '/projects/quantum',
  '["Quantum", "Neural Networks", "Simulation"]'::jsonb,
  'published'
),
(
  'BioSynth AI Core',
  'De-Novo Protein Design & Folding Predictor',
  'Generative AI system for synthetic enzyme discovery and molecular binding affinity prediction.',
  'Biotechnology',
  'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=1200&auto=format&fit=crop',
  '#10B981',
  '/projects/biotech',
  '["Biotech", "Generative AI", "Proteomics"]'::jsonb,
  'published'
),
(
  'AeroSwarm Control Matrix',
  'Distributed Autonomous UAV Fleet Coordinator',
  'Swarm intelligence architecture powering mesh-networked autonomous aerial vehicles for environmental monitoring.',
  'Autonomous Systems',
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop',
  '#F59E0B',
  '/projects/aeroswarm',
  '["Swarm Robotics", "UAV", "Edge AI"]'::jsonb,
  'published'
)
on conflict do nothing;

-- Sample Members
insert into public.members (name, role, department, batch, image_url, bio, social_links)
values 
(
  'Dr. Tanveen Ambrose',
  'Director & Principal Investigator',
  'Robotics & Artificial Intelligence',
  'Faculty Lead',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
  'Pioneering research in autonomous robotics systems and neural control architectures.',
  '{"github": "https://github.com", "linkedin": "https://linkedin.com"}'::jsonb
),
(
  'Sarah Chen',
  'Lead Quantum Researcher',
  'Quantum Computing Lab',
  '2024',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop',
  'Specializing in quantum algorithm optimization and error mitigation techniques.',
  '{"github": "https://github.com"}'::jsonb
)
on conflict do nothing;

-- Sample Gallery Photos
insert into public.gallery (image_url, caption, title, category)
values 
(
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
  'Lab researchers analyzing robotic sensor calibration.',
  'Robotics Lab Testing',
  'Lab Life'
),
(
  'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop',
  'Prototyping PCB design for high-speed motor controllers.',
  'Hardware Hackathon',
  'Hardware'
),
(
  'https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=800&auto=format&fit=crop',
  'Annual Alpha Science Lab Research Symposium.',
  'Symposium 2026',
  'Events'
),
(
  'https://images.unsplash.com/photo-1507668077129-56e32842fceb?q=80&w=800&auto=format&fit=crop',
  'Deep neural network training session on GPU cluster.',
  'AI Deep Dive',
  'Research'
)
on conflict do nothing;
