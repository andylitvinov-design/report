create table if not exists public.cabinet_users (
  id uuid primary key default gen_random_uuid(),
  provider text not null default 'google',
  provider_user_id text,
  email text not null unique,
  name text,
  avatar_url text,
  role text not null default 'client',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.cabinet_users(id),
  display_name text,
  birth_date date,
  focus_area text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.cabinet_users(id),
  profile_id uuid references public.client_profiles(id),
  type text not null,
  status text not null default 'draft',
  title text not null,
  summary text,
  dao_level numeric,
  primary_element text,
  bottleneck text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_answers (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references public.analysis_runs(id),
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references public.analysis_runs(id),
  user_id uuid not null references public.cabinet_users(id),
  title text not null,
  report_json jsonb not null default '{}'::jsonb,
  report_markdown text,
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id),
  user_id uuid not null references public.cabinet_users(id),
  items_json jsonb not null default '[]'::jsonb,
  repeat_check_after date,
  created_at timestamptz not null default now()
);

create index if not exists idx_analysis_runs_user_id_created_at on public.analysis_runs(user_id, created_at desc);
create index if not exists idx_reports_user_id_created_at on public.reports(user_id, created_at desc);
