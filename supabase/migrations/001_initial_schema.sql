-- Portfolio website initial schema
-- Run in Supabase SQL Editor or via Supabase CLI

create extension if not exists "pgcrypto";

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  tech_stack text[] not null default '{}',
  live_link text,
  github_link text,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  date_range text not null,
  description text not null default '',
  skills text[] not null default '{}',
  icon text not null default 'briefcase',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.site_content (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  level integer not null default 0 check (level >= 0 and level <= 100),
  category text not null check (category in ('technical', 'tool')),
  sort_order integer not null default 0
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  date text not null,
  sort_order integer not null default 0
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  degree text not null,
  institution text not null,
  date_range text not null,
  icon text not null default 'graduation-cap',
  sort_order integer not null default 0
);

create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create index projects_created_at_idx on public.projects (created_at desc);
create index experiences_sort_order_idx on public.experiences (sort_order asc);
create index skills_sort_order_idx on public.skills (sort_order asc);
create index certifications_sort_order_idx on public.certifications (sort_order asc);
create index education_sort_order_idx on public.education (sort_order asc);
create index contact_messages_created_at_idx on public.contact_messages (created_at desc);
create index contact_messages_read_idx on public.contact_messages (read);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

create trigger site_content_set_updated_at
  before update on public.site_content
  for each row
  execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.site_content enable row level security;
alter table public.skills enable row level security;
alter table public.certifications enable row level security;
alter table public.education enable row level security;
alter table public.contact_messages enable row level security;

create policy "projects_public_read" on public.projects for select to anon, authenticated using (true);
create policy "experiences_public_read" on public.experiences for select to anon, authenticated using (true);
create policy "site_content_public_read" on public.site_content for select to anon, authenticated using (true);
create policy "skills_public_read" on public.skills for select to anon, authenticated using (true);
create policy "certifications_public_read" on public.certifications for select to anon, authenticated using (true);
create policy "education_public_read" on public.education for select to anon, authenticated using (true);

create policy "contact_messages_public_insert" on public.contact_messages for insert to anon, authenticated with check (true);

create policy "projects_admin_insert" on public.projects for insert to authenticated with check (auth.uid() is not null);
create policy "projects_admin_update" on public.projects for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "projects_admin_delete" on public.projects for delete to authenticated using (auth.uid() is not null);

create policy "experiences_admin_insert" on public.experiences for insert to authenticated with check (auth.uid() is not null);
create policy "experiences_admin_update" on public.experiences for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "experiences_admin_delete" on public.experiences for delete to authenticated using (auth.uid() is not null);

create policy "site_content_admin_insert" on public.site_content for insert to authenticated with check (auth.uid() is not null);
create policy "site_content_admin_update" on public.site_content for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "site_content_admin_delete" on public.site_content for delete to authenticated using (auth.uid() is not null);

create policy "skills_admin_insert" on public.skills for insert to authenticated with check (auth.uid() is not null);
create policy "skills_admin_update" on public.skills for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "skills_admin_delete" on public.skills for delete to authenticated using (auth.uid() is not null);

create policy "certifications_admin_insert" on public.certifications for insert to authenticated with check (auth.uid() is not null);
create policy "certifications_admin_update" on public.certifications for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "certifications_admin_delete" on public.certifications for delete to authenticated using (auth.uid() is not null);

create policy "education_admin_insert" on public.education for insert to authenticated with check (auth.uid() is not null);
create policy "education_admin_update" on public.education for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "education_admin_delete" on public.education for delete to authenticated using (auth.uid() is not null);

create policy "contact_messages_admin_select" on public.contact_messages for select to authenticated using (auth.uid() is not null);
create policy "contact_messages_admin_update" on public.contact_messages for update to authenticated using (auth.uid() is not null) with check (auth.uid() is not null);
create policy "contact_messages_admin_delete" on public.contact_messages for delete to authenticated using (auth.uid() is not null);
