// supabase/004_kafp_areas.sql의 시드 데이터와 동일하게 유지한다.
export const KAFP_AREAS: { id: string; name: string; color: string }[] = [
  { id: "mgmt", name: "경영·사업관리", color: "#8B5A2B" },
  { id: "training", name: "인력양성", color: "#2B6CB0" },
  { id: "consulting", name: "컨설팅·자문", color: "#2F855A" },
  { id: "lecture", name: "모금 교육", color: "#B7791F" },
  { id: "research", name: "연구·논문", color: "#553C9A" },
  { id: "writing", name: "칼럼·집필", color: "#9B2C2C" },
];
