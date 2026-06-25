export type KafpArea = {
  id: string;
  name: string;
  color: string;
  order_index: number;
};

export type KafpChecklistItem = {
  id: string;
  project_id: string;
  text: string;
  done: boolean;
  order_index: number;
};

export type KafpLink = {
  id: string;
  project_id: string;
  label: string;
  url: string;
  type: string;
  order_index: number;
};

export type KafpProject = {
  id: string;
  area_id: string;
  name: string;
  deadline: string | null;
  status: string;
  created_at: string;
  checklist: KafpChecklistItem[];
  links: KafpLink[];
};

export const KAFP_STATUSES = ["기획중", "진행중", "검토중", "완료"] as const;
export const KAFP_LINK_TYPES = ["캘린더", "드라이브", "기타"] as const;

export function kafpProgress(checklist: KafpChecklistItem[]): number | null {
  if (checklist.length === 0) return null;
  return Math.round(
    (checklist.filter((c) => c.done).length / checklist.length) * 100
  );
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function isUpcomingDeadline(deadline: string | null): boolean {
  if (!deadline) return false;
  const today = todayStr();
  const diffDays = Math.ceil(
    (new Date(deadline).getTime() - new Date(today).getTime()) / 86400000
  );
  return diffDays <= 7;
}

export function deadlineBadge(deadline: string): string {
  const today = todayStr();
  const diffDays = Math.ceil(
    (new Date(deadline).getTime() - new Date(today).getTime()) / 86400000
  );
  if (diffDays < 0) return "지연";
  if (diffDays === 0) return "오늘 마감";
  if (diffDays === 1) return "내일 마감";
  return `D-${diffDays}`;
}
