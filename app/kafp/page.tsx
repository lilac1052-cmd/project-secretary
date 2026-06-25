"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import {
  KafpArea,
  KafpProject,
  deadlineBadge,
  isUpcomingDeadline,
  kafpProgress,
} from "@/lib/kafp";

type AreaSummary = KafpArea & {
  project_count: number;
  avg_progress: number | null;
};

export default function KafpHomePage() {
  const [areas, setAreas] = useState<AreaSummary[] | null>(null);
  const [projects, setProjects] = useState<KafpProject[] | null>(null);
  const [areaFilter, setAreaFilter] = useState<string>("all");
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([fetch("/api/kafp/areas"), fetch("/api/kafp/projects")])
      .then(async ([areasRes, projectsRes]) => {
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
        setAreas(areasData.areas);
        setProjects(projectsData.projects);
      })
      .catch(() => setError("불러오는 중 오류가 발생했습니다."));
  }, []);

  const areaById = useMemo(() => {
    const map = new Map<string, AreaSummary>();
    (areas || []).forEach((a) => map.set(a.id, a));
    return map;
  }, [areas]);

  const upcoming = useMemo(() => {
    if (!projects) return [];
    return projects
      .filter((p) => p.status !== "완료" && isUpcomingDeadline(p.deadline))
      .sort((a, b) => (a.deadline || "").localeCompare(b.deadline || ""));
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    const list =
      areaFilter === "all" ? projects : projects.filter((p) => p.area_id === areaFilter);
    return [...list].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return a.deadline.localeCompare(b.deadline);
    });
  }, [projects, areaFilter]);

  if (error) {
    return <main className="p-8 text-destructive">{error}</main>;
  }

  if (areas === null || projects === null) {
    return <main className="p-8 text-muted-foreground">불러오는 중...</main>;
  }

  return (
    <main className="p-8 max-w-[1200px] mx-auto space-y-8">
      <h1 className="text-2xl font-bold">KAFP 업무 영역</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map((area) => (
          <Link key={area.id} href={`/kafp/${area.id}`}>
            <Card className="hover:border-primary/50 transition-colors h-full relative overflow-hidden">
              <div
                className="absolute top-0 left-0 w-1.5 h-full"
                style={{ backgroundColor: area.color }}
              />
              <CardContent className="space-y-3 pl-6">
                <h2 className="font-bold text-lg">{area.name}</h2>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>진행 중 프로젝트 {area.project_count}건</span>
                  <span>
                    평균 진척률 {area.avg_progress === null ? "—" : `${area.avg_progress}%`}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {upcoming.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-destructive">
            <AlertTriangle className="size-5" />
            마감 임박 (7일 이내)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcoming.map((project) => {
              const area = areaById.get(project.area_id);
              return (
                <Link key={project.id} href={`/kafp/projects/${project.id}`}>
                  <Card className="relative overflow-hidden border-destructive/40 hover:shadow-md transition-shadow h-full">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive" />
                    <CardContent className="space-y-2 pl-6">
                      <Badge variant="destructive">{deadlineBadge(project.deadline!)}</Badge>
                      <h3 className="font-bold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {area?.name} · {project.deadline}
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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">전체 프로젝트</h2>
          <Select value={areaFilter} onValueChange={setAreaFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 영역</SelectItem>
              {areas.map((area) => (
                <SelectItem key={area.id} value={area.id}>
                  {area.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              등록된 프로젝트가 없습니다.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>영역</TableHead>
                    <TableHead>프로젝트</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>진척률</TableHead>
                    <TableHead>마감일</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => {
                    const area = areaById.get(project.area_id);
                    const progress = kafpProgress(project.checklist);
                    return (
                      <TableRow key={project.id}>
                        <TableCell>
                          <span className="inline-flex items-center gap-2">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: area?.color }}
                            />
                            {area?.name}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/kafp/projects/${project.id}`}
                            className="font-medium hover:underline"
                          >
                            {project.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{project.status}</Badge>
                        </TableCell>
                        <TableCell>{progress === null ? "—" : `${progress}%`}</TableCell>
                        <TableCell>{project.deadline || "—"}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </section>
    </main>
  );
}
