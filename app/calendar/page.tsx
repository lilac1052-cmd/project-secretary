"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectWithItems, allDeadlineItems, DeadlineItem } from "@/lib/deadlines";
import { KAFP_AREAS } from "@/lib/kafp";

const STATUS_COLOR: Record<string, string> = {
  계획중: "#70768E",
  진행중: "#3F5BAA",
  완료: "#006C52",
};

type GanttRow = {
  key: string;
  projectId: string;
  projectName: string;
  stageName: string;
  status: string;
  typeColor: string | undefined;
  startDay: number;
  endDay: number;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function CalendarPage() {
  const [projects, setProjects] = useState<ProjectWithItems[] | null>(null);
  const [error, setError] = useState("");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(todayStr());

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

  const itemsByDate = useMemo(() => {
    if (!projects) return new Map<string, DeadlineItem[]>();
    const map = new Map<string, DeadlineItem[]>();
    for (const item of allDeadlineItems(projects)) {
      const list = map.get(item.date) || [];
      list.push(item);
      map.set(item.date, list);
    }
    return map;
  }, [projects]);

  const monthItemCount = useMemo(() => {
    let count = 0;
    for (const [date, items] of itemsByDate) {
      if (date.startsWith(`${year}-${pad(month + 1)}`)) count += items.length;
    }
    return count;
  }, [itemsByDate, year, month]);

  const daysInMonthForGantt = new Date(year, month + 1, 0).getDate();

  const ganttRows = useMemo(() => {
    if (!projects) return [] as GanttRow[];
    const monthStart = toDateStr(year, month, 1);
    const monthEnd = toDateStr(year, month, daysInMonthForGantt);
    const rows: GanttRow[] = [];

    for (const project of projects) {
      for (const stage of project.stages) {
        const start = stage.start_date || stage.due_date;
        const end = stage.due_date || stage.start_date;
        if (!start || !end) continue;
        if (end < monthStart || start > monthEnd) continue;

        const clampedStart = start < monthStart ? monthStart : start;
        const clampedEnd = end > monthEnd ? monthEnd : end;

        rows.push({
          key: stage.id,
          projectId: project.id,
          projectName: project.name,
          stageName: stage.name,
          status: stage.status,
          typeColor: KAFP_AREAS.find((a) => a.name === project.type)?.color,
          startDay: Number(clampedStart.slice(8, 10)),
          endDay: Number(clampedEnd.slice(8, 10)),
        });
      }
    }

    return rows.sort((a, b) => a.startDay - b.startDay);
  }, [projects, year, month, daysInMonthForGantt]);

  function goToMonth(delta: number) {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setMonth(newMonth);
    setYear(newYear);
  }

  function goToToday() {
    setYear(now.getFullYear());
    setMonth(now.getMonth());
    setSelectedDate(todayStr());
  }

  if (error) {
    return <main className="p-8 text-destructive">{error}</main>;
  }

  if (projects === null) {
    return <main className="p-8 text-muted-foreground">불러오는 중...</main>;
  }

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: { day: number; dateStr: string; inMonth: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, dateStr: "", inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, dateStr: toDateStr(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length, dateStr: "", inMonth: false });
  }

  const selectedItems = itemsByDate.get(selectedDate) || [];

  return (
    <main className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 pb-4 flex items-center gap-4 shrink-0">
          <h1 className="text-2xl font-bold">
            {year}년 {month + 1}월
          </h1>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => goToMonth(-1)}>
              <ChevronLeft className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => goToMonth(1)}>
              <ChevronRight className="size-5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={goToToday}>
            오늘
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {monthItemCount === 0 && (
            <p className="text-sm text-muted-foreground mb-3">이 달엔 마감이 없습니다.</p>
          )}
          <div className="grid grid-cols-7 border-t border-l border-border rounded-xl overflow-hidden">
            {WEEKDAYS.map((wd, i) => (
              <div
                key={wd}
                className={cn(
                  "py-2 text-center text-xs font-medium bg-muted/40 border-b border-r border-border",
                  i === 0 && "text-destructive",
                  i === 6 && "text-primary"
                )}
              >
                {wd}
              </div>
            ))}
            {cells.map((cell, i) => {
              const items = cell.dateStr ? itemsByDate.get(cell.dateStr) || [] : [];
              const isSelected = cell.dateStr === selectedDate;
              const weekday = i % 7;
              return (
                <div
                  key={i}
                  onClick={() => cell.inMonth && setSelectedDate(cell.dateStr)}
                  className={cn(
                    "p-2 border-b border-r border-border h-[110px] transition-colors overflow-hidden",
                    cell.inMonth ? "cursor-pointer hover:bg-muted/40" : "bg-muted/20 opacity-40",
                    isSelected && cell.inMonth && "bg-primary/10 ring-2 ring-primary"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs",
                      weekday === 0 && "text-destructive",
                      weekday === 6 && "text-primary"
                    )}
                  >
                    {cell.day}
                  </span>
                  <div className="mt-1 space-y-1">
                    {items.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "text-[10px] px-1 py-0.5 rounded truncate",
                          item.overdue
                            ? "bg-destructive/15 text-destructive"
                            : "bg-primary/15 text-primary"
                        )}
                      >
                        {item.projectName} · {item.label}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">진행 일정 흐름</h2>
            {ganttRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                이 달엔 진행 중인 단계 일정이 없습니다.
              </p>
            ) : (
              <Card className="overflow-x-auto p-4">
                <div
                  className="grid gap-y-2 min-w-fit"
                  style={{
                    gridTemplateColumns: `220px repeat(${daysInMonthForGantt}, minmax(22px, 1fr))`,
                  }}
                >
                  <div />
                  {Array.from({ length: daysInMonthForGantt }, (_, i) => i + 1).map((d) => (
                    <div
                      key={d}
                      className={cn(
                        "text-center text-[10px] pb-1 border-b border-border",
                        toDateStr(year, month, d) === todayStr()
                          ? "text-primary font-bold"
                          : "text-muted-foreground"
                      )}
                    >
                      {d}
                    </div>
                  ))}

                  {ganttRows.map((row, i) => (
                    <div key={row.key} className="contents">
                      <div
                        className="text-xs flex items-center gap-1.5 pr-2 truncate"
                        style={{ gridRow: i + 2, gridColumn: 1 }}
                      >
                        {row.typeColor && (
                          <span
                            className="size-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: row.typeColor }}
                          />
                        )}
                        <Link
                          href={`/projects/${row.projectId}`}
                          className="truncate hover:underline"
                          title={`${row.projectName} · ${row.stageName}`}
                        >
                          {row.projectName} · {row.stageName}
                        </Link>
                      </div>
                      <div
                        className="h-5 rounded-full flex items-center px-2 text-[10px] text-white truncate"
                        style={{
                          gridRow: i + 2,
                          gridColumn: `${row.startDay + 1} / ${row.endDay + 2}`,
                          backgroundColor: STATUS_COLOR[row.status] || STATUS_COLOR["계획중"],
                        }}
                      >
                        {row.status}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <aside className="w-[340px] bg-muted/20 border-l border-border flex flex-col shrink-0">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold">선택한 날짜 일정</h2>
          <p className="text-sm text-muted-foreground mt-1">{selectedDate}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {selectedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">이 날짜엔 마감이 없습니다.</p>
          ) : (
            selectedItems.map((item, i) => (
              <Link key={i} href={`/projects/${item.projectId}`}>
                <Card
                  className={cn(
                    "p-4 hover:shadow-md transition-shadow",
                    item.overdue && "border-destructive/40"
                  )}
                >
                  <p className="text-sm text-primary font-semibold">{item.projectName}</p>
                  <p className="font-medium">{item.label}</p>
                </Card>
              </Link>
            ))
          )}
        </div>
      </aside>
    </main>
  );
}
