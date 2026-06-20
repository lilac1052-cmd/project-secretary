# 🍊 만들기 기록 — 프로젝트 비서

> 이 앱을 어떤 과정으로 만들었는지 남기는 기록입니다.
> 나중에 복기하거나, 다른 사람에게 사례로 보여줄 때 씁니다.

## 한눈에 보기
- 무엇을: 여러 프로젝트의 세부구성·핵심 요건·진행과정·마감을 한눈에 보여주는 개인 비서형 대시보드
- 누구를 위해: 본인(혼자 여러 프로젝트를 동시에 관리하는 사람)
- 핵심 흐름: 프로젝트를 등록 → 단계·할일로 진도를 본다 → 흩어진 마감을 한눈에 모아 놓쳐도 안 헤맨다
- 스택: Next.js · Tailwind · shadcn/ui · Supabase · Vercel
- 시작: 2026-06-20   · 라이브: 배포 전

---

## 기록

### 2026-06-20 기획
- **정한 것**: 화면 4개(대시보드 홈 · 마감 모아보기 · 프로젝트 상세 · 새 프로젝트 등록), 로그인
  없음, LLM API 불필요, 데이터는 Supabase 3개 테이블(projects · stages · tasks)로 구성.
- **왜**: 지금은 캘린더·카카오톡(메신저)·구글문서·노션에 정보가 흩어져 있어 종합적으로 볼 수
  없고, 적어두고도 마감을 놓치는 게 가장 큰 불편이었다. 그래서 핵심 가치를 "흩어진 정보를
  한곳에 모아서 보여주는 것"과 "마감을 놓치지 않게 하는 것" 두 가지로 잡았다. 혼자만 쓰는
  도구라 로그인은 굳이 필요 없다고 판단했고, 정해진 데이터를 입력·집계하는 게 핵심이라 LLM
  API도 필요 없다고 판단했다.
- **고민하다 버린 선택지**: 처음엔 화면 3개(대시보드·상세·등록)로만 잡았는데, 사용자가 "다음
  마감을 다 모아볼 전용 화면"이 따로 필요하다고 해서 '마감 모아보기' 화면을 추가했다 — 단순히
  프로젝트별로 흩어진 마감을 보는 것만으론 "지금 가장 급한 게 뭔지" 한눈에 안 보이기 때문.
  프로젝트 안에 단계만 둘지, 할일까지 둘지도 물었는데 "단계 + 할일 모두 필요"로 결정 — 단계만
  있으면 큰 흐름은 보이지만 실제로 뭘 해야 하는지가 안 보여서 둘 다 두기로 했다.
- **막힌 점 / 바꾼 점**: 데이터 항목을 물을 때 사용자가 객관식 대신 직접 입력으로
  "프로젝트 유형·파트너·시작일-마감일·핵심요건·관련 문서파일 연결"을 줬는데, 단계·할일
  추적에 필요한 항목(단계 상태, 할일 완료 여부)이 빠져 있어서 별도로 한 번 더 확인했다 —
  결과적으로 단계(stages)·할일(tasks) 테이블을 projects와 분리해 추가하게 됐다. "관련 문서파일
  연결"은 업로드가 아니라 외부 링크(구글문서 등) 텍스트로만 받기로 단순화했다 — 파일 업로드는
  MVP에 비해 과하다고 판단.

### 2026-06-20 기획 보완
- **정한 것 / 한 것**: 화면을 4개에서 5개로 늘려 '캘린더 보기'(`/calendar`)를 추가했다. 모든
  프로젝트의 단계·할일 마감을 월간 캘린더에 한 번에 표시한다.
- **왜**: '마감 모아보기'가 목록형으로 임박한 순서를 보여주긴 하지만, 사용자가 원한 건 "모든
  프로젝트를 한번에 캘린더에 담아내는" 것 — 즉 날짜 축 위에서 전체 분포를 한눈에 보는 시각이라,
  목록과는 다른 화면이 필요했다.
- **막힌 점 / 바꾼 점**: 없음. 기존 데이터(stages, tasks의 due_date)를 그대로 재사용하면 되어
  테이블 구조는 바꾸지 않았다.

### 2026-06-20 연결
- **한 것**: Node.js·GitHub CLI·Vercel CLI를 winget/npm으로 설치 → Next.js 스캐폴드(create-next-app
  + shadcn/ui) → GitHub 레포(`project-secretary`) 생성 → Vercel 프로젝트 연결 → Vercel
  GitHub App 설치 → Supabase를 Vercel 마켓플레이스로 프로비저닝 → Supabase CLI link까지
  연결을 끝냈다. `design/`에 Stitch zip을 풀어 화면 5개를 정리하고 PLAN.md 디자인 토큰을
  Stitch 실제 색상(슬레이트 블루 `#3f5BAA`)으로 갱신했다.
- **왜 이 순서**: Supabase를 Vercel 통합으로 붙이려면 Vercel 프로젝트가 먼저 있어야 해서 GitHub
  레포 → Vercel 링크 → Supabase 순으로 진행했다.
- **어떻게**: GitHub 로그인은 `gh auth login --web`의 device code를 Claude in Chrome으로 직접
  입력·승인까지 진행(아이디·비밀번호는 사용자가 미리 로그인된 세션이라 따로 입력 없었음).
  Vercel은 `vercel whoami`가 컴퓨터 이름(COMPUTERNAME)에 한글이 섞여 있어 깨지는 버그가 있어
  로그인 대신 vercel.com/account/tokens에서 발급한 Full Account 토큰을 `VERCEL_TOKEN` 환경변수로
  넘겨 모든 명령에 사용했다. Supabase는 `supabase login`을 쓰지 않고 supabase.com/dashboard/account/tokens
  에서 발급한 액세스 토큰을 `SUPABASE_ACCESS_TOKEN`으로 넘겨 우회했다.
- **막힌 점 / 바꾼 점**: ① `vercel whoami`가 `COMPUTERNAME=신애GRAM`(한글)을 User-Agent 헤더에
  넣으려다 "is not a legal HTTP header value" 오류로 깨졌다 — Node의 `os.hostname()`이 실제
  시스템 호출이라 환경변수 오버라이드로는 못 고치고, 결국 로그인 대신 토큰 발급으로 우회했다.
  ② `gh`/`vercel` OAuth 승인 페이지의 "Authorize" 버튼이 계속 비활성 상태로 안 눌렸다 — 원인은
  Claude in Chrome이 제어하는 탭이 백그라운드 창에 있어 `document.hidden=true`였고, 그 상태에서는
  GitHub/Vercel이 버튼 활성화 타이머(클릭재킹 방지용)를 돌리지 않았다. 크롬 창을 화면 앞으로
  가져온 뒤(컴퓨터 사용 권한으로 `open_application`) 버튼이 곧바로 활성화됐다. ③ `vercel link`가
  `--scope`(팀) 없이는 "non-interactive 모드에선 기본 팀을 못 정한다"며 실패해 `--scope
  lilac1052-9265s-projects`를 명시했다. ④ Vercel 계정에 GitHub 로그인 연결이 없어
  `vercel git connect`가 "Login Connection을 먼저 추가하라"고 실패 — vercel.com/account/authentication
  에서 GitHub Connect를 한 번 해주고 나서야 됐다. ⑤ `vercel integration add supabase`가
  처음엔 "Cannot install more than one integration"으로 실패했는데, 원인은 `--environment`
  플래그에 공백으로 여러 값(`production preview development`)을 한 번에 넘긴 것 — 이 플래그는
  `-e`를 반복해서 써야 했다(`-e production -e preview -e development`). ⑥ Supabase 마켓플레이스
  설치 시 "약관에 동의하라"는 액션이 필요해 `vercel.com/.../accept-terms/supabase` 페이지에서
  Accept & Install을 한 번 눌러줘야 CLI가 이어졌다.
- **배운 것**: 한글 컴퓨터 이름(Windows COMPUTERNAME)이 일부 CLI(Vercel)의 HTTP 헤더를 깨뜨릴 수
  있다 — 로그인 대신 access token 발급으로 우회하는 게 더 안정적이다. OAuth 승인 버튼이 안
  눌릴 땐 탭이 백그라운드인지(`document.hidden`) 먼저 확인하면 디버깅이 빨라진다.

### 2026-06-20 구현 (LLM 자동 채우기 추가)
- **정한 것 / 한 것**: 화면을 새 프로젝트 등록 → 프로젝트 상세 → 대시보드 → 마감 모아보기 →
  캘린더 보기 순서로 만들었다(등록 화면을 먼저 만들어야 나머지 화면을 실제 데이터로 확인할 수
  있어서). 기획 때는 LLM API를 "불필요"로 정했었는데, 구현 중 사용자가 "문서 파일을 올리면
  프로젝트 입력란이 자동으로 채워지면 좋겠다"고 요청해 — 한 번은 미루기로 했다가 바로 다음에
  Gemini API 키를 직접 들고 와서 지금 추가하기로 다시 정했다. `gemini-3.5-flash` 모델(텍스트·
  이미지·PDF 입력 지원)을 멀티모달로 호출해 업로드한 문서에서 이름·유형·파트너·기간·요구사항·
  단계까지 한 번에 추출하도록 했다.
- **왜**: 비공개 데이터라 RLS는 항상 켜야 했으므로(로그인 없음+개인용 패턴), 모든 읽기·쓰기를
  `service_role` 키를 쓰는 서버 라우트(`app/api/.../route.ts`)로 몰았다. 같은 이유로 LLM 키도
  서버 라우트에서만 쓰게 했다(`GEMINI_API_KEY`는 `NEXT_PUBLIC_` 접두사 없이 `.env.local`과
  Vercel 세 환경에 등록). 파일을 Supabase Storage에 영구 저장하지 않고 요청 한 번에 분석만
  하고 버리는 방식을 택한 건 MVP에서 파일 보관 기능 자체가 스코프 밖이라 단순하게 가려는
  목적이었다.
- **어떻게**: `/api/extract-project`가 업로드된 파일을 base64로 인코딩해 Gemini
  `generateContent` REST 엔드포인트에 `inline_data`로 보내고, `generationConfig.responseMimeType:
  "application/json"`으로 JSON만 받도록 강제한 뒤 그대로 폼 상태에 채워 넣었다(사용자가 등록
  전에 검토·수정 가능). 대시보드·마감 모아보기·캘린더 보기는 모두 "다음 마감"을 계산해야 해서
  그 로직(`lib/deadlines.ts`)을 한 곳에 모아 세 화면이 공유하게 만들었다 — 단계·할일 중 완료/체크
  안 된 항목의 마감일을 합쳐 가장 가까운 순으로 정렬하고, 지난 날짜는 "지연"으로 표시한다.
- **막힌 점 / 바꾼 점**: ① curl로 한글 데이터를 테스트 POST했더니 DB에 깨진 바이트로 저장됐다
  (Git Bash/Windows 콘솔의 기본 인코딩 문제) — PowerShell의 `Invoke-RestMethod`도 콘솔 출력은
  깨졌지만 실제 저장값은 정상이었다. 결국 한글 데이터 테스트는 브라우저로 직접 입력하는 게
  가장 안전하다는 결론. 테스트로 생성된 깨진/중복 데이터는 `supabase db query --linked`로 SQL
  delete를 직접 돌려 정리했다(아직 DELETE API가 없어서). ② shadcn `Table` 컴포넌트는 `asChild`를
  지원하지 않아 행 전체를 `Link`로 감싸는 대신 `TableRow`에 `onClick`으로 `window.location.href`
  이동을 넣었다.
- **배운 것 / 다음**: LLM API 도입 여부는 기획 때 한 번 정해도 구현 중에 사용자 요구가 바뀌면
  다시 열어볼 수 있다 — 다만 그때마다 PLAN.md의 `## 설정`·`## MVP 범위`를 함께 갱신해 기준
  문서가 실제 구현과 어긋나지 않게 했다. 다음 단계: 모든 화면이 끝나면 폴리시 패스 + `npm run
  build` 통과 확인 + README 작성 + 배포 URL 재확인.
