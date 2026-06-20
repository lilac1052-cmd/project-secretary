create table public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text,
  partner text,
  start_date date,
  end_date date,
  key_requirements text,
  doc_link text,
  created_at timestamptz not null default now()
);

alter table public.projects enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다
