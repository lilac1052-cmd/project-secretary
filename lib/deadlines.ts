export type Stage = {
  id: string;
  project_id: string;
  name: string;
  status: string;
  due_date: string | null;
  order_index: number;
};

export type Task = {
  id: string;
  project_id: string;
  title: string;
  done: boolean;
  due_date: string | null;
};

export type ProjectWithItems = {
  id: string;
  name: string;
  end_date?: string | null;
  stages: Stage[];
  tasks: Task[];
};

export type DeadlineItem = {
  projectId: string;
  projectName: string;
  kind: "stage" | "task";
  label: string;
  date: string;
  overdue: boolean;
};

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function projectDeadlineItems(project: ProjectWithItems): DeadlineItem[] {
  const today = todayStr();
  const items: DeadlineItem[] = [];

  for (const stage of project.stages) {
    if (stage.status === "완료" || !stage.due_date) continue;
    items.push({
      projectId: project.id,
      projectName: project.name,
      kind: "stage",
      label: stage.name,
      date: stage.due_date,
      overdue: stage.due_date < today,
    });
  }

  for (const task of project.tasks) {
    if (task.done || !task.due_date) continue;
    items.push({
      projectId: project.id,
      projectName: project.name,
      kind: "task",
      label: task.title,
      date: task.due_date,
      overdue: task.due_date < today,
    });
  }

  return items.sort((a, b) => a.date.localeCompare(b.date));
}

export function allDeadlineItems(projects: ProjectWithItems[]): DeadlineItem[] {
  return projects.flatMap(projectDeadlineItems).sort((a, b) => a.date.localeCompare(b.date));
}

export function nextDeadline(project: ProjectWithItems): DeadlineItem | null {
  const items = projectDeadlineItems(project);
  return items[0] ?? null;
}

export function currentStageLabel(project: ProjectWithItems): string {
  if (project.stages.length === 0) return "단계 없음";
  const inProgress = project.stages.find((s) => s.status === "진행중");
  if (inProgress) return inProgress.name;
  const notStarted = project.stages.find((s) => s.status !== "완료");
  if (notStarted) return notStarted.name;
  return "완료";
}

export function isProjectEnded(project: ProjectWithItems): boolean {
  return !!project.end_date && project.end_date < todayStr();
}

export function isUrgent(item: DeadlineItem): boolean {
  const today = todayStr();
  const diffDays = Math.ceil(
    (new Date(item.date).getTime() - new Date(today).getTime()) / 86400000
  );
  return item.overdue || diffDays <= 1;
}

export function deadlineBadge(item: DeadlineItem): string {
  const today = todayStr();
  if (item.overdue) return "지연";
  const diffDays = Math.ceil(
    (new Date(item.date).getTime() - new Date(today).getTime()) / 86400000
  );
  if (diffDays === 0) return "오늘 마감";
  if (diffDays === 1) return "내일 마감";
  return `D-${diffDays}`;
}
