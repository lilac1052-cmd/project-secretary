create table public.stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  status text not null default '계획중',
  due_date date,
  order_index int not null default 0
);

alter table public.stages enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다
