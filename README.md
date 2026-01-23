# AG Grid Study

AG Grid 실전 케이스를 한눈에 볼 수 있도록 정리한 데모 서비스입니다.
각 케이스는 **데모 + 로그 + 코드 포인트**를 함께 제공하여 실무 적용을 빠르게 돕습니다.

## 목적

- AG Grid에 익숙하지 않은 개발자도 실무 케이스를 빠르게 이해
- 편집 시나리오별 **mutable/immutable/optimistic** 흐름 비교
- 문제 상황(예: IME 입력)과 해결 패턴 공유

## Tech Stack

- Next.js (App Router)
- AG Grid Community
- React Query
- MSW (dev mocking)

## 케이스 목록

- **Cell edit · Basic**: 기본 편집 흐름 (mutable 변경)
- **Cell edit · Immutable**: readOnlyEdit + getRowId 기반 immutable 업데이트
- **Cell edit · Custom editor**: 커스텀 셀 에디터로 편집 제어
- **Cell edit · Post + refetch**: 편집 후 POST → refetch
- **Cell edit · Post + refetch (optimistic)**: 낙관적 업데이트 + 실패 롤백
- **Cell edit · IME Enter handling**: 한글 입력(IME) Enter 종료 이슈 대응

## 로컬 실행

```bash
npm install
npm run dev
```

- 기본 포트: `http://localhost:3006`

## MSW 설정 (권장, dev 전용)

MSW는 개발 중 `/api/*` 요청을 모킹합니다.

```bash
npx msw init public
```

- `public/mockServiceWorker.js` 생성
- `package.json`에 `msw.workerDirectory` 설정됨

> MSW를 설정하지 않아도 동작은 합니다. 이 경우 Next API(`app/api/*`)가 직접 응답합니다.

## API 응답 지연 (UX 확인용)

모든 API 응답은 체감 테스트를 위해 **500ms 지연**됩니다.

- MSW 핸들러: `app/mocks/handlers.ts`
- Next API: `app/api/users/*`

## 폴더 구조 (요약)

```
app/
  cell-edit/
    basic/
    immutable/
    custom-editor/
    post-refetch/
    post-refetch-optimistic/
    ime-enter/
  component/
  api/
  mocks/
public/
  mock/
```

## 배포 (Vercel)

1) GitHub에 저장소 생성 후 push
2) Vercel에서 프로젝트 Import
3) Build Command / Output은 기본값 사용

> Next.js App Router 기본 설정으로 바로 배포 가능합니다.

## 스크립트

```bash
npm run dev     # dev server (3006)
npm run build   # production build
npm run start   # start production server
npm run lint    # lint
```

---

필요한 케이스가 있으면 언제든 요청해 주세요.
