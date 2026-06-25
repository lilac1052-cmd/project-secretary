"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProjectWithItems,
  nextDeadline,
  isUrgent,
  isProjectEnded,
  deadlineBadge,
  projectStatus,
  ProjectStatus,
} from "@/lib/deadlines";
import { KAFP_AREAS } from "@/lib/kafp";

const STATUS_COLUMNS: { status: ProjectStatus; color: string }[] = [
  { status: "기획중", color: "#70768E" },
  { status: "진행중", color: "#3F5BAA" },
  { status: "완료", color: "#006C52" },
];

function areaOf(type: string | null | undefined) {
  return KAFP_AREAS.find((a) => a.name === type);
}

export default function Home() {
  const [projects, setProjects] = useState<ProjectWithItems[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/projects")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "불러오지 못했습니다.");
          return;
        }
        setProjects(data.projects);
      })
      .catch(() => setError("불러오는 중 오류가 발생했습니다."));
  }, []);

  if (error) {
    return <main className="p-8 text-destructive">{error}</main>;
  }

  if (projects === null) {
    return <main className="p-8 text-muted-foreground">불러오는 중...</main>;
  }

  const urgent = projects.filter((p) => {
    if (isProjectEnded(p)) return false;
    const d = nextDeadline(p);
    return d && isUrgent(d);
  });

  const columns = STATUS_COLUMNS.map((col) => ({
    ...col,
    items: projects.filter((p) => projectStatus(p) === col.status),
  }));

  return (
    <main className="pt-16 px-4 pb-8 md:p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="size-4" />새 프로젝트
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            첫 프로젝트를 등록해보세요.
          </CardContent>
        </Card>
      ) : (
        <>
          {urgent.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                마감 임박·지연 프로젝트
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {urgent.map((project) => {
                  const deadline = nextDeadline(project)!;
                  return (
                    <Link key={project.id} href={`/projects/${project.id}`}>
                      <Card className="relative overflow-hidden border-destructive/40 hover:shadow-md transition-shadow h-full">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive" />
                        <CardContent className="space-y-2 pl-6">
                          <Badge variant="destructive">{deadlineBadge(deadline)}</Badge>
                          <h3 className="font-bold">{project.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {deadline.label} · {deadline.date}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">영역별 현황</h2>
            <div className="flex flex-wrap gap-3">
              {KAFP_AREAS.map((area) => {
                const count = projects.filter((p) => p.type === area.name).length;
                return (
                  <div
                    key={area.id}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card text-sm"
                  >
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: area.color }}
                    />
                    <span className="font-medium">{area.name}</span>
                    <span className="text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-semibold">전체 프로젝트</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {columns.map((col) => (
                <div key={col.status} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: col.color }}
                    />
                    <h3 className="font-semibold text-sm">{col.status}</h3>
                    <span className="text-muted-foreground/60 text-sm">
                      ({col.items.length})
                    </span>
                  </div>
                  <div className="space-y-3 bg-muted/30 rounded-xl p-3 min-h-32">
                    {col.items.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        없음
                      </p>
                    ) : (
                      col.items.map((project) => {
                        const deadline = nextDeadline(project);
                        const ended = isProjectEnded(project);
                        const area = areaOf(project.type);
                        return (
                          <Link key={project.id} href={`/projects/${project.id}`}>
                            <Card
                              className={cn(
                                "hover:border-primary/50 transition-colors",
                                ended && "opacity-60 bg-muted/30"
                              )}
                            >
                              <CardContent className="space-y-2 p-4">
                                {project.type && (
                                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                                    {area && (
                                      <span
                                        className="size-1.5 rounded-full shrink-0"
                                        style={{ backgroundColor: area.color }}
                                      />
                                    )}
                                    {project.type}
                                  </span>
                                )}
                                <h4 className="font-bold text-sm">{project.name}</h4>
                                <p className="text-xs text-muted-foreground">
                                  {ended
                                    ? `종료일: ${project.end_date}`
                                    : deadline
                                      ? `다음 마감: ${deadline.label} · ${deadline.date}`
                                      : "다가올 마감 없음"}
                                </p>
                              </CardContent>
                            </Card>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
