"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Calendar, FolderOpen, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { KafpProject, KAFP_STATUSES, KAFP_LINK_TYPES, kafpProgress } from "@/lib/kafp";

function linkIcon(type: string) {
  if (type === "캘린더") return Calendar;
  if (type === "드라이브") return FolderOpen;
  return LinkIcon;
}

export default function KafpProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<KafpProject | null>(null);
  const [error, setError] = useState("");
  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState<string>(KAFP_LINK_TYPES[2]);
  const [addingLink, setAddingLink] = useState(false);

  async function load() {
    const res = await fetch(`/api/kafp/projects/${id}`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "불러오지 못했습니다.");
      return;
    }
    setProject(data.project);
  }

  useEffect(() => {
    load().catch(() => setError("불러오는 중 오류가 발생했습니다."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function updateStatus(status: string) {
    setProject((prev) => (prev ? { ...prev, status } : prev));
    await fetch(`/api/kafp/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function updateDeadline(deadline: string) {
    setProject((prev) => (prev ? { ...prev, deadline } : prev));
    await fetch(`/api/kafp/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deadline }),
    });
  }

  async function toggleItem(itemId: string, done: boolean) {
    setProject((prev) =>
      prev
        ? {
            ...prev,
            checklist: prev.checklist.map((c) =>
              c.id === itemId ? { ...c, done } : c
            ),
          }
        : prev
    );
    await fetch(`/api/kafp/checklist/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done }),
    });
  }

  async function deleteItem(itemId: string) {
    setProject((prev) =>
      prev
        ? { ...prev, checklist: prev.checklist.filter((c) => c.id !== itemId) }
        : prev
    );
    await fetch(`/api/kafp/checklist/${itemId}`, { method: "DELETE" });
  }

  async function addItem() {
    if (!newItem.trim()) return;
    setAdding(true);
    const res = await fetch(`/api/kafp/projects/${id}/checklist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newItem }),
    });
    const data = await res.json();
    if (res.ok) {
      setProject((prev) =>
        prev ? { ...prev, checklist: [...prev.checklist, data.item] } : prev
      );
      setNewItem("");
    }
    setAdding(false);
  }

  async function deleteLink(linkId: string) {
    setProject((prev) =>
      prev ? { ...prev, links: prev.links.filter((l) => l.id !== linkId) } : prev
    );
    await fetch(`/api/kafp/links/${linkId}`, { method: "DELETE" });
  }

  async function addLink() {
    if (!newLinkLabel.trim() || !newLinkUrl.trim()) return;
    setAddingLink(true);
    const res = await fetch(`/api/kafp/projects/${id}/links`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: newLinkLabel, url: newLinkUrl, type: newLinkType }),
    });
    const data = await res.json();
    if (res.ok) {
      setProject((prev) =>
        prev ? { ...prev, links: [...prev.links, data.link] } : prev
      );
      setNewLinkLabel("");
      setNewLinkUrl("");
    }
    setAddingLink(false);
  }

  if (error) {
    return <main className="p-8 text-destructive">{error}</main>;
  }

  if (!project) {
    return <main className="p-8 text-muted-foreground">불러오는 중...</main>;
  }

  const progress = kafpProgress(project.checklist);

  return (
    <main className="p-8 max-w-[800px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <Link
          href={`/kafp/${project.area_id}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          ← 영역으로
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-y-4 gap-x-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">마감일</p>
            <Input
              type="date"
              value={project.deadline || ""}
              onChange={(e) => updateDeadline(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">상태</p>
            <Select value={project.status} onValueChange={updateStatus}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KAFP_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">진척률</span>
              <span className="font-semibold">
                {progress === null ? "—" : `${progress}%`}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${progress ?? 0}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>체크리스트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.checklist.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 등록된 체크리스트 항목이 없습니다.
            </p>
          ) : (
            project.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-3 group">
                <Checkbox
                  checked={item.done}
                  onCheckedChange={(v) => toggleItem(item.id, v === true)}
                />
                <span
                  className={cn(
                    "flex-1 text-sm",
                    item.done && "line-through text-muted-foreground"
                  )}
                >
                  {item.text}
                </span>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))
          )}
          <div className="flex gap-2 pt-2">
            <Input
              placeholder="새 체크리스트 항목 추가..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addItem()}
            />
            <Button size="icon" onClick={addItem} disabled={adding}>
              <Plus className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>관련 링크</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {project.links.length === 0 ? (
            <p className="text-sm text-muted-foreground">등록된 링크가 없습니다.</p>
          ) : (
            project.links.map((link) => {
              const Icon = linkIcon(link.type);
              return (
                <div key={link.id} className="flex items-center gap-3 group">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-3 p-3 bg-muted/40 rounded-xl hover:bg-muted transition-colors min-w-0"
                  >
                    <div className="size-9 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium truncate">{link.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{link.url}</p>
                    </div>
                  </a>
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <Input
              placeholder="링크 이름..."
              value={newLinkLabel}
              onChange={(e) => setNewLinkLabel(e.target.value)}
              className="flex-1 min-w-[140px]"
            />
            <Input
              placeholder="https://..."
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addLink()}
              className="flex-1 min-w-[180px]"
            />
            <Select value={newLinkType} onValueChange={setNewLinkType}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {KAFP_LINK_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="icon" onClick={addLink} disabled={addingLink}>
              <Plus className="size-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
