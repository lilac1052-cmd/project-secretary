create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_id uuid references public.stages(id) on delete set null,
  title text not null,
  done boolean not null default false,
  due_date date
);

alter table public.tasks enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다
