create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_user_id text not null,
  email text not null,
  name text,
  avatar_url text,
  role text not null default 'client' check (role in ('client', 'specialist', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_user_id)
);

create table if not exists public.client_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  display_name text not null,
  birth_date date,
  focus_area text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  profile_id uuid not null references public.client_profiles(id) on delete cascade,
  type text not null check (type in ('self_analysis', 'expert_analysis', 'bach', 'dao_usin', 'follow_up')),
  status text not null check (status in ('draft', 'submitted', 'analyzed', 'archived')),
  title text not null,
  summary text not null,
  dao_level integer not null default 0,
  primary_element text not null default '',
  bottleneck text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_answers (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references public.analysis_runs(id) on delete cascade,
  payload_json jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references public.analysis_runs(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  report_json jsonb not null default '{}'::jsonb,
  report_markdown text not null default '',
  pdf_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recommendations (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  items_json jsonb not null default '[]'::jsonb,
  repeat_check_after date,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
alter table public.client_profiles enable row level security;
alter table public.analysis_runs enable row level security;
alter table public.analysis_answers enable row level security;
alter table public.reports enable row level security;
alter table public.recommendations enable row level security;

create index if not exists client_profiles_user_id_idx on public.client_profiles(user_id);
create index if not exists analysis_runs_user_id_created_at_idx on public.analysis_runs(user_id, created_at desc);
create index if not exists reports_user_id_created_at_idx on public.reports(user_id, created_at desc);
create index if not exists recommendations_user_id_idx on public.recommendations(user_id);
