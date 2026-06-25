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
  currentStageLabel,
  isUrgent,
  isProjectEnded,
  deadlineBadge,
} from "@/lib/deadlines";
import { KAFP_AREAS } from "@/lib/kafp";

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

  const groups = [
    ...KAFP_AREAS.map((area) => ({
      key: area.id,
      label: area.name,
      color: area.color,
      items: projects.filter((p) => p.type === area.name),
    })),
    {
      key: "uncategorized",
      label: "미분류",
      color: undefined,
      items: projects.filter((p) => !KAFP_AREAS.some((a) => a.name === p.type)),
    },
  ].filter((g) => g.items.length > 0);

  return (
    <main className="p-8 max-w-[1200px] mx-auto space-y-8">
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

          <section className="space-y-8">
            <h2 className="text-lg font-semibold">전체 프로젝트</h2>
            {groups.map((group) => (
              <div key={group.key} className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  {group.color && (
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: group.color }}
                    />
                  )}
                  {group.label}
                  <span className="text-muted-foreground/60">({group.items.length})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map((project) => {
                    const deadline = nextDeadline(project);
                    const ended = isProjectEnded(project);
                    return (
                      <Link key={project.id} href={`/projects/${project.id}`}>
                        <Card
                          className={cn(
                            "hover:border-primary/50 transition-colors h-full",
                            ended && "opacity-50 bg-muted/30"
                          )}
                        >
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <h3 className={cn("font-bold", ended && "text-muted-foreground")}>
                                {project.name}
                              </h3>
                              <Badge variant="secondary">
                                {ended ? "마감됨" : currentStageLabel(project)}
                              </Badge>
                            </div>
                            <p
                              className={cn(
                                "text-sm",
                                deadline ? "text-muted-foreground" : "text-muted-foreground/60"
                              )}
                            >
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
                  })}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
}
