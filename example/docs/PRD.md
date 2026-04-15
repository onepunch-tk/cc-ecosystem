# TechFlow Landing Page PRD

## Core Information

**Purpose**: IT 컨설팅 회사의 전문성과 서비스를 소개하여 잠재 고객의 문의를 유도하는 랜딩 페이지
**Users**: IT 솔루션을 탐색 중인 잠재 고객 및 파트너사 담당자

## User Journey

1. Landing Page (Hero Section)
   ↓ 스크롤 또는 네비게이션 클릭

2. About Section (회사 비전/미션 확인)
   ↓ 스크롤 또는 네비게이션 클릭

3. Services Section (제공 서비스 탐색)
   ↓ 스크롤 또는 CTA 버튼 클릭

4. Contact Section (문의 폼 작성 및 제출)
   ↓ 제출 완료

5. 제출 성공 메시지 표시 → Hero Section으로 돌아가기 옵션

## Feature Specifications

### 1. Core Features

| ID | Feature Name | Description | Priority | Related Pages |
|----|------------|-------------|----------|---------------|
| **F001** | Hero 섹션 | 회사 핵심 메시지, 슬로건, CTA 버튼을 통한 첫인상 전달 | Core | Landing Page |
| **F002** | About 섹션 | 회사 비전, 미션, 핵심 가치를 시각적으로 전달 | Core | Landing Page |
| **F003** | Services 섹션 | 제공 서비스를 카드 형태로 나열하여 전문 분야 소개 | Core | Landing Page |
| **F004** | Contact 폼 | 이름, 이메일, 문의 내용을 입력받는 연락처 폼. React Router action을 통해 서버사이드 처리 (MVP: 콘솔 로깅, 성공 응답 반환) | Core | Landing Page |
| **F005** | 반응형 네비게이션 | 섹션 간 이동을 위한 고정 헤더 네비게이션 (모바일: 햄버거 메뉴) | Core | Landing Page |

### 2. Required Support Features

| ID | Feature Name | Description | Priority | Related Pages |
|----|------------|-------------|----------|---------------|
| **F006** | 폼 유효성 검증 | Contact 폼 입력값 클라이언트 검증 (필수 항목, 이메일 형식) | Support | Landing Page |
| **F007** | 스크롤 내비게이션 | 네비게이션 클릭 시 해당 섹션으로 부드러운 스크롤 이동 | Support | Landing Page |
| **F008** | 폼 제출 피드백 | 폼 제출 성공/실패 시 사용자에게 상태 메시지 표시 | Support | Landing Page |

### 3. Deferred Features

- 다국어 지원 (i18n)
- 블로그/뉴스 섹션
- 챗봇 위젯
- 고객 후기/포트폴리오 섹션
- 이메일 발송 연동 (백엔드 통합)

## Menu Structure

TechFlow Navigation (고정 헤더)
├── Home (Hero) - F001, F005
├── About - F002, F007
├── Services - F003, F007
└── Contact - F004, F006, F007, F008

모바일 네비게이션 (햄버거 메뉴)
├── Home - F001, F005
├── About - F002, F007
├── Services - F003, F007
└── Contact - F004, F006, F007, F008

## Page-by-Page Detailed Features

### Landing Page

> **Implemented Features:** `F001`, `F002`, `F003`, `F004`, `F005`, `F006`, `F007`, `F008` | **Menu Location:** 전체 단일 페이지

| Item | Content |
|------|---------|
| **Role** | IT 컨설팅 회사의 전문성과 서비스를 소개하고 잠재 고객의 문의를 유도하는 단일 랜딩 페이지 |
| **Entry Path** | 직접 URL 접속, 검색 엔진, 외부 링크 |
| **User Actions** | 섹션 간 스크롤 탐색, 네비게이션 메뉴 클릭, CTA 버튼 클릭으로 Contact 섹션 이동, 문의 폼 작성 및 제출 |
| **Key Features** | **[Hero]** 회사 슬로건 + "문의하기" CTA 버튼<br>**[About]** 비전/미션 텍스트 + 핵심 가치 아이콘 카드 (3개)<br>**[Services]** 서비스 소개 카드 (4개) - 제목, 설명, 아이콘<br>**[Contact]** 이름/이메일/메시지 입력 폼 + 제출 버튼 + 유효성 검증 + 성공/실패 피드백<br>**[Navigation]** 고정 헤더 (데스크탑: 인라인 메뉴, 모바일: 햄버거 메뉴) + 스무스 스크롤 |
| **Next Navigation** | CTA 버튼 -> Contact 섹션, 폼 제출 성공 -> 성공 메시지 표시 |

## Data Model

### ContactSubmission (문의 폼 제출 데이터)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Yes | 고유 식별자 |
| name | string | Yes | 문의자 이름 |
| email | string | Yes | 문의자 이메일 (형식 검증) |
| message | string | Yes | 문의 내용 |
| submittedAt | Date | Yes | 제출 시각 |

### Contact Form Submission Flow

```
User submits form → Client validation (F006) → React Router action function (server-side)
→ Server validates + logs to console → Returns success/error response → Client displays feedback (F008)
```

- **MVP 범위**: React Router의 `action` export를 사용하여 서버사이드에서 폼 데이터를 수신하고 콘솔에 로깅 후 성공 응답 반환
- **향후 확장**: 실제 이메일 발송, 데이터베이스 저장 등은 Deferred Features로 처리

## Tech Stack

### Frontend Framework

- **React Router Framework 7.14.0** - React 풀스택 프레임워크
- **React ^19.2.4** - UI 라이브러리
- **TypeScript ^5.9.3** - 타입 안전성

### Styling

- **TailwindCSS ^4.2.2** - 유틸리티 CSS 프레임워크 (모바일 퍼스트 반응형)

### Build & Dev

- **Vite ^8.0.3** - 빌드 도구
- **Biome ^2.4.12** - 린터 및 포매터

### Testing

- **Vitest ^4.1.4** - 테스트 프레임워크
- **Testing Library React ^16.3.2** - 컴포넌트 테스트 유틸리티

### Package Management

- **bun** - 패키지 매니저 및 런타임
