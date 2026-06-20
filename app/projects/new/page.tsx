"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

type StageDraft = {
  name: string;
  due_date: string;
};

const PROJECT_TYPES = ["UI/UX 디자인", "브랜딩", "마케팅 캠페인", "콘텐츠 기획", "기타"];

export default function NewProjectPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [partner, setPartner] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyRequirements, setKeyRequirements] = useState("");
  const [docLink, setDocLink] = useState("");
  const [stages, setStages] = useState<StageDraft[]>([{ name: "", due_date: "" }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function addStage() {
    setStages((prev) => [...prev, { name: "", due_date: "" }]);
  }

  function removeStage(index: number) {
    setStages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateStage(index: number, field: keyof StageDraft, value: string) {
    setStages((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("프로젝트 이름을 입력해주세요.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          partner,
          start_date: startDate,
          end_date: endDate,
          key_requirements: keyRequirements,
          doc_link: docLink,
          stages,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "등록에 실패했습니다.");
        setSubmitting(false);
        return;
      }

      router.push(`/projects/${data.project.id}`);
    } catch {
      setError("등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      setSubmitting(false);
    }
  }

  return (
    <main className="p-8 max-w-[1000px] mx-auto space-y-6">
      <h1 className="text-2xl font-bold">새 프로젝트 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">프로젝트 명</Label>
              <Input
                id="name"
                placeholder="예: 2024 상반기 브랜드 리뉴얼"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>프로젝트 유형</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner">협력 파트너</Label>
              <Input
                id="partner"
                placeholder="파트너사 또는 담당자 입력"
                value={partner}
                onChange={(e) => setPartner(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">시작일</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">종료일</Label>
              <Input
                id="end_date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="key_requirements">주요 요구사항 및 목표</Label>
              <Textarea
                id="key_requirements"
                placeholder="프로젝트의 주요 목표와 핵심 요구사항을 입력하세요."
                rows={4}
                value={keyRequirements}
                onChange={(e) => setKeyRequirements(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>관련 문서</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="doc_link">문서 링크</Label>
              <Input
                id="doc_link"
                placeholder="참조 링크 (URL)"
                value={docLink}
                onChange={(e) => setDocLink(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>진행 단계 설정</CardTitle>
            <Button type="button" variant="secondary" size="sm" onClick={addStage}>
              <Plus className="size-4" />
              단계 추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl"
              >
                <div className="size-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <Input
                  placeholder="단계 이름"
                  value={stage.name}
                  onChange={(e) => updateStage(index, "name", e.target.value)}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={stage.due_date}
                  onChange={(e) => updateStage(index, "due_date", e.target.value)}
                  className="w-44"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStage(index)}
                  className="text-destructive shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {stages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                아직 등록된 단계가 없습니다. &quot;단계 추가&quot;를 눌러 추가하세요.
              </p>
            )}
          </CardContent>
        </Card>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? "등록 중..." : "프로젝트 등록하기"}
          </Button>
        </div>
      </form>
    </main>
  );
}
