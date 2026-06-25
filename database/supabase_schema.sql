-- Etiqa Trade Job Application System - Supabase PostgreSQL Schema

-- Enable uuid-ossp extension for UUID generation
create extension if not exists "uuid-ossp";

-- 1. Create tables using 'create table if not exists'

-- Branches Table
create table if not exists public.branches (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  location text not null,
  address text not null,
  contact_no text not null,
  created_at timestamp with time zone default now()
);

-- Profiles Table (Linked to Supabase Auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('Applicant', 'HR/Admin', 'Manager')),
  branch_id uuid references public.branches(id) on delete set null,
  department text,
  phone_no text,
  address text,
  resume_url text,
  created_at timestamp with time zone default now()
);

-- 2. Create helper functions for RLS checks (defined after profiles table exists to avoid dependency errors)
create or replace function public.get_user_role(user_id uuid)
returns text as $$
  select role from public.profiles where id = user_id;
$$ language sql security definer;

create or replace function public.get_user_branch(user_id uuid)
returns uuid as $$
  select branch_id from public.profiles where id = user_id;
$$ language sql security definer;

-- Job Postings Table
create table if not exists public.job_postings (
  id uuid primary key default uuid_generate_v4(),
  branch_id uuid not null references public.branches(id) on delete cascade,
  admin_id uuid references public.profiles(id) on delete set null,
  job_title text not null,
  job_description text not null,
  job_type text not null,
  location text not null,
  salary_range text,
  requirements text, -- Semicolon separated list of requirements
  posted_date date default current_date,
  closing_date date not null,
  status text not null check (status in ('Open', 'Closed')) default 'Open',
  created_at timestamp with time zone default now()
);

-- Job Applications Table
create table if not exists public.job_applications (
  id uuid primary key default uuid_generate_v4(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.job_postings(id) on delete cascade,
  application_date date default current_date,
  cover_letter text not null,
  resume_url text not null,
  status text not null check (status in ('Draft', 'Submitted', 'Under Review', 'Shortlisted', 'Rejected', 'Hired', 'Not Hired')) default 'Submitted',
  last_updated date default current_date,
  manager_comment text,
  created_at timestamp with time zone default now(),
  constraint unique_applicant_job unique (applicant_id, job_id)
);

-- Notifications Table
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid not null references public.job_applications(id) on delete cascade,
  message text not null,
  notification_type text not null,
  is_read boolean default false,
  created_at timestamp with time zone default now()
);


-- 3. Enable Row Level Security (RLS) on all public tables
alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.job_postings enable row level security;
alter table public.job_applications enable row level security;
alter table public.notifications enable row level security;


-- 4. RLS Policies

-- Branches Policies
create policy "Authenticated users can view branches"
  on public.branches for select
  to authenticated
  using (true);

create policy "HR/Admin can manage branches"
  on public.branches for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'HR/Admin');

-- Profiles Policies
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

create policy "HR/Admin can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.get_user_role(auth.uid()) = 'HR/Admin');

create policy "Managers can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.get_user_role(auth.uid()) = 'Manager');

create policy "System can insert profiles during registration"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- Job Postings Policies
create policy "Authenticated users can view job postings"
  on public.job_postings for select
  to authenticated
  using (true);

create policy "HR/Admin can manage job postings"
  on public.job_postings for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'HR/Admin');

-- Job Applications Policies
create policy "Applicants can view own applications"
  on public.job_applications for select
  to authenticated
  using (auth.uid() = applicant_id);

create policy "Applicants can insert own applications"
  on public.job_applications for insert
  to authenticated
  with check (auth.uid() = applicant_id);

create policy "HR/Admin can view and update all applications"
  on public.job_applications for all
  to authenticated
  using (public.get_user_role(auth.uid()) = 'HR/Admin');

create policy "Managers can view and update applications for assigned branch"
  on public.job_applications for all
  to authenticated
  using (
    public.get_user_role(auth.uid()) = 'Manager' 
    and exists (
      select 1 from public.job_postings j
      where j.id = job_id 
      and j.branch_id = public.get_user_branch(auth.uid())
    )
  );

-- Notifications Policies
create policy "Applicants can view own notifications"
  on public.notifications for select
  to authenticated
  using (auth.uid() = applicant_id);

create policy "Applicants can update own notifications"
  on public.notifications for update
  to authenticated
  using (auth.uid() = applicant_id);

create policy "Users can create notifications"
  on public.notifications for insert
  to authenticated
  with check (
    auth.uid() = applicant_id 
    or public.get_user_role(auth.uid()) in ('HR/Admin', 'Manager')
  );
