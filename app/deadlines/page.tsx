"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { ProjectWithItems, allDeadlineItems, deadlineBadge } from "@/lib/deadlines";

export default function DeadlinesPage() {
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

  const items = allDeadlineItems(projects);
  const overdue = items.filter((i) => i.overdue);
  const upcoming = items.filter((i) => !i.overdue);

  return (
    <main className="p-8 max-w-[1400px] mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">마감 모아보기</h1>
        <p className="text-muted-foreground mt-1">
          모든 프로젝트의 마감 일정을 가까운 순서로 모아 보여줍니다.
        </p>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            예정된 마감이 없습니다.
          </CardContent>
        </Card>
      ) : (
        <>
          {overdue.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-destructive">
                <AlertTriangle className="size-5" />
                지연된 항목
                <Badge variant="destructive">{overdue.length}</Badge>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {overdue.map((item, i) => (
                  <Link key={i} href={`/projects/${item.projectId}`}>
                    <Card className="relative overflow-hidden border-destructive/40 hover:shadow-md transition-shadow h-full">
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-destructive" />
                      <CardContent className="space-y-2 pl-6">
                        <Badge variant="destructive">{deadlineBadge(item)}</Badge>
                        <p className="text-sm text-primary font-semibold">{item.projectName}</p>
                        <h3 className="font-bold">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">원래 마감: {item.date}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-semibold mb-4">전체 일정</h2>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>프로젝트명</TableHead>
                    <TableHead>항목</TableHead>
                    <TableHead>마감 일자</TableHead>
                    <TableHead>상태</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...overdue, ...upcoming].map((item, i) => (
                    <TableRow
                      key={i}
                      className="cursor-pointer"
                      onClick={() => {
                        window.location.href = `/projects/${item.projectId}`;
                      }}
                    >
                      <TableCell className="font-semibold text-primary">
                        {item.projectName}
                      </TableCell>
                      <TableCell>{item.label}</TableCell>
                      <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.overdue ? "destructive" : "secondary"}>
                          {deadlineBadge(item)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </>
      )}
    </main>
  );
}
