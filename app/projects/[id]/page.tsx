"use client";

import { useEffect, useState, use } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = {
  id: string;
  name: string;
  type: string | null;
  partner: string | null;
  start_date: string | null;
  end_date: string | null;
  key_requirements: string | null;
  doc_link: string | null;
};

type Stage = {
  id: string;
  name: string;
  status: string;
  due_date: string | null;
  order_index: number;
};

type Task = {
  id: string;
  title: string;
  done: boolean;
  due_date: string | null;
};

const STATUS_ORDER = ["계획중", "진행중", "완료"];

function nextStatus(status: string) {
  const idx = STATUS_ORDER.indexOf(status);
  return STATUS_ORDER[(idx + 1) % STATUS_ORDER.length];
}

function statusDotClass(status: string) {
  if (status === "완료") return "bg-[oklch(0.472_0.095_168.9)]";
  if (status === "진행중") return "bg-primary";
  return "bg-muted-foreground/40";
}

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState("");
  const [addingTask, setAddingTask] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/projects/${id}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "불러오지 못했습니다.");
        setLoading(false);
        return;
      }
      setProject(data.project);
      setStages(data.stages);
      setTasks(data.tasks);
    } catch {
      setError("불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function cycleStage(stage: Stage) {
    const status = nextStatus(stage.status);
    setStages((prev) => prev.map((s) => (s.id === stage.id ? { ...s, status } : s)));
    await fetch(`/api/stages/${stage.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function toggleTask(task: Task) {
    const done = !task.done;
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, done } : t)));
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
  }

  async function addTask() {
    if (!newTask.trim()) return;
    setAddingTask(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project_id: id, title: newTask }),
    });
    const data = await res.json();
    if (res.ok) {
      setTasks((prev) => [...prev, data.task]);
      setNewTask("");
    }
    setAddingTask(false);
  }

  if (loading) {
    return <main className="p-8 text-muted-foreground">불러오는 중...</main>;
  }

  if (error || !project) {
    return <main className="p-8 text-destructive">{error || "프로젝트를 찾을 수 없습니다."}</main>;
  }

  return (
    <main className="p-8 max-w-[1400px] space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">{project.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">프로젝트 유형</p>
                <p className="font-semibold">{project.type || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">파트너사</p>
                <p className="font-semibold">{project.partner || "-"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">진행 기간</p>
                <p className="font-semibold">
                  {project.start_date || "-"} ~ {project.end_date || "-"}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground mb-1">주요 요구사항</p>
                <p className="whitespace-pre-wrap">{project.key_requirements || "-"}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>문서 링크</CardTitle>
            </CardHeader>
            <CardContent>
              {project.doc_link ? (
                <a
                  href={project.doc_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-muted/40 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <LinkIcon className="size-5" />
                    </div>
                    <p className="font-medium truncate max-w-[400px]">{project.doc_link}</p>
                  </div>
                </a>
              ) : (
                <p className="text-sm text-muted-foreground">등록된 문서 링크가 없습니다.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>진행 단계</CardTitle>
            </CardHeader>
            <CardContent>
              {stages.length === 0 ? (
                <p className="text-sm text-muted-foreground">아직 등록된 단계가 없습니다.</p>
              ) : (
                <div className="space-y-4">
                  {stages.map((stage) => (
                    <button
                      key={stage.id}
                      onClick={() => cycleStage(stage)}
                      className="flex gap-4 items-start w-full text-left group"
                    >
                      <div
                        className={cn(
                          "size-6 rounded-full flex items-center justify-center text-white shrink-0 mt-0.5 transition-colors",
                          statusDotClass(stage.status)
                        )}
                      >
                        {stage.status === "완료" && <Check className="size-4" />}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {stage.due_date || "마감일 없음"}
                        </p>
                        <p className="font-bold group-hover:underline">{stage.name}</p>
                        <Badge variant="secondary" className="mt-1">
                          {stage.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>할 일</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">아직 등록된 할 일이 없습니다.</p>
              ) : (
                tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3">
                    <Checkbox checked={task.done} onCheckedChange={() => toggleTask(task)} />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        task.done && "line-through text-muted-foreground"
                      )}
                    >
                      {task.title}
                    </span>
                  </div>
                ))
              )}
              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="새로운 할 일 추가..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTask()}
                />
                <Button size="icon" onClick={addTask} disabled={addingTask}>
                  <Plus className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
