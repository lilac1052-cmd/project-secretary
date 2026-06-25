create table public.kafp_links (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.kafp_projects(id) on delete cascade,
  label text not null,
  url text not null,
  type text not null default '기타',
  order_index int not null default 0
);

alter table public.kafp_links enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다
