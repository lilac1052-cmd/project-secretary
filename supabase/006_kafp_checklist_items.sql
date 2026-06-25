create table public.kafp_checklist_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.kafp_projects(id) on delete cascade,
  text text not null,
  done boolean not null default false,
  order_index int not null default 0
);

alter table public.kafp_checklist_items enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다
