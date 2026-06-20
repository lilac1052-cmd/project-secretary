# 프로젝트 비서

여러 프로젝트의 세부구성·핵심 요건·진행과정·마감을 한눈에 보여주는 개인 비서형 대시보드입니다.
혼자 여러 프로젝트를 동시에 관리하다 중요한 타이밍을 놓치는 걸 막기 위해 만들었습니다 — 대시보드,
마감 모아보기, 캘린더 보기로 모든 프로젝트의 일정을 한곳에서 보고, 프로젝트 등록 시 문서 파일을
올리면 Gemini가 내용을 읽어 입력란을 자동으로 채워줍니다.

라이브: https://project-secretary-three.vercel.app

자세한 기획·데이터 모델은 [PLAN.md](./PLAN.md), 만들어진 과정은 [MEMORY.md](./MEMORY.md)를 참고하세요.

## 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 기술 스택

Next.js (App Router, TypeScript) · Tailwind CSS · shadcn/ui · Supabase · Vercel · Gemini API
