create table public.kafp_projects (
  id uuid primary key default gen_random_uuid(),
  area_id text not null references public.kafp_areas(id) on delete cascade,
  name text not null,
  deadline date,
  status text not null default '기획중',
  created_at timestamptz not null default now()
);

alter table public.kafp_projects enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다
