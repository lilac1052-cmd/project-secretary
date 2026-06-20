import { NextRequest, NextResponse } from "next/server";

const PROMPT = `당신은 프로젝트 기획 문서를 분석해 아래 JSON 스키마에 맞는 정보를 추출하는 도우미입니다.
문서 내용을 보고 알 수 있는 값만 채우고, 알 수 없는 항목은 빈 문자열이나 빈 배열로 둡니다.
날짜는 반드시 YYYY-MM-DD 형식으로 씁니다. 다른 설명 없이 JSON만 출력합니다.

스키마:
{
  "name": "프로젝트 이름",
  "type": "프로젝트 유형(예: UI/UX 디자인, 브랜딩, 마케팅 캠페인, 콘텐츠 기획, 기타)",
  "partner": "협력 파트너 또는 담당자",
  "start_date": "YYYY-MM-DD",
  "end_date": "YYYY-MM-DD",
  "key_requirements": "주요 요구사항 및 목표 요약",
  "stages": [{ "name": "단계 이름", "due_date": "YYYY-MM-DD" }]
}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "LLM API 키가 설정되지 않았습니다." }, { status: 500 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "파일을 선택해주세요." }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const mimeType = file.type || "application/octet-stream";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: PROMPT },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json" },
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error?.message || "문서 분석에 실패했습니다." },
        { status: 500 }
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "문서에서 정보를 추출하지 못했습니다." }, { status: 500 });
    }

    const extracted = JSON.parse(text);
    return NextResponse.json({ extracted });
  } catch {
    return NextResponse.json({ error: "문서 분석 중 오류가 발생했습니다." }, { status: 500 });
  }
}
