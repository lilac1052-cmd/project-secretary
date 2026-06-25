create table public.kafp_areas (
  id text primary key,
  name text not null,
  color text not null,
  order_index int not null default 0
);

alter table public.kafp_areas enable row level security;
-- 정책을 두지 않으면 anon은 전부 차단, service_role은 RLS를 우회한다

insert into public.kafp_areas (id, name, color, order_index) values
  ('mgmt', '경영·사업관리', '#8B5A2B', 0),
  ('training', '인력양성', '#2B6CB0', 1),
  ('consulting', '컨설팅·자문', '#2F855A', 2),
  ('lecture', '모금 교육', '#B7791F', 3),
  ('research', '연구·논문', '#553C9A', 4),
  ('writing', '칼럼·집필', '#9B2C2C', 5);
