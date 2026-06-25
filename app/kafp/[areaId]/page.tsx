"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Calendar, FolderOpen, Link as LinkIcon } from "lucide-react";
import { KafpProject, kafpProgress } from "@/lib/kafp";

function linkIcon(type: string) {
  if (type === "캘린더") return Calendar;
  if (type === "드라이브") return FolderOpen;
  return LinkIcon;
}

type Area = {
  id: string;
  name: string;
  color: string;
};

export default function KafpAreaPage({
  params,
}: {
  params: Promise<{ areaId: string }>;
}) {
  const { areaId } = use(params);
  const [area, setArea] = useState<Area | null>(null);
  const [projects, setProjects] = useState<KafpProject[] | null>(null);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);

  async function load() {
    const [areasRes, projectsRes] = await Promise.all([
      fetch("/api/kafp/areas"),
      fetch(`/api/kafp/projects?area_id=${areaId}`),
    ]);
    const areasData = await areasRes.json();
    const projectsData = await projectsRes.json();

    if (!areasRes.ok) {
      setError(areasData.error || "불러오지 못했습니다.");
      return;
    }
    if (!projectsRes.ok) {
      setError(projectsData.error || "불러오지 못했습니다.");
      return;
    }

    const found = areasData.areas.find((a: Area) => a.id === areaId) || null;
    setArea(found);
    setProjects(projectsData.projects);
  }

  useEffect(() => {
    load().catch(() => setError("불러오는 중 오류가 발생했습니다."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaId]);

  async function addProject() {
    if (!newName.trim()) return;
    setAdding(true);
    const res = await fetch("/api/kafp/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ area_id: areaId, name: newName }),
    });
    const data = await res.json();
    if (res.ok) {
      setProjects((prev) => [data.project, ...(prev || [])]);
      setNewName("");
    }
    setAdding(false);
  }

  if (error) {
    return <main className="p-8 text-destructive">{error}</main>;
  }

  if (projects === null) {
    return <main className="p-8 text-muted-foreground">불러오는 중...</main>;
  }

  return (
    <main className="p-8 max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {area && (
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: area.color }}
            />
          )}
          <h1 className="text-2xl font-bold">{area?.name || areaId}</h1>
        </div>
        <Link href="/kafp" className="text-sm text-muted-foreground hover:underline">
          ← 전체 영역
        </Link>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="새 프로젝트 이름..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addProject()}
        />
        <Button onClick={addProject} disabled={adding}>
          <Plus className="size-4" />새 프로젝트
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            이 영역에 등록된 프로젝트가 없습니다.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const progress = kafpProgress(project.checklist);
            return (
              <Link key={project.id} href={`/kafp/projects/${project.id}`}>
                <Card className="hover:border-primary/50 transition-colors h-full">
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{project.name}</h3>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        마감일: {project.deadline || "—"}
                      </p>
                      {project.links.length > 0 && (
                        <div className="flex items-center gap-1.5">
                          {project.links.map((link) => {
                            const Icon = linkIcon(link.type);
                            return (
                              <button
                                key={link.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  window.open(link.url, "_blank", "noopener,noreferrer");
                                }}
                                className="text-muted-foreground hover:text-primary"
                                title={link.label}
                              >
                                <Icon className="size-4" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${progress ?? 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        진척률: {progress === null ? "—" : `${progress}%`}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
