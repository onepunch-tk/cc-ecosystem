# CC-Ecosystem

어떤 프로젝트에서든 `.claude/` 디렉토리와 설정 파일들을 복사하여 즉시 사용할 수 있는 **Claude Code 에코시스템 설정 저장소**입니다. 에이전트, 스킬, 훅, MCP 서버 설정, 그리고 CLAUDE.md 템플릿을 포함합니다.

**TDD-First** 개발 방식을 기본으로 하며, **DDD(Domain-Driven Design) 아키텍처**를 완전 지원합니다. 도메인 모델링부터 전략/전술 설계, 구현, 리뷰까지 전 과정을 에이전트가 자동으로 수행합니다.

---

## 프로젝트 구조

```
cc-ecosystem/
├── CLAUDE.md                          # 프로젝트 가이드 템플릿
├── .mcp.json                          # MCP 서버 설정
├── .gitignore
└── .claude/
    ├── settings.json                  # 훅, 환경변수, 플러그인 설정
    ├── agents/
    │   ├── docs/                      # 문서 에이전트 (9개)
    │   │   ├── prd-generator.md
    │   │   ├── prd-generator-backend.md
    │   │   ├── prd-generator-mobile.md
    │   │   ├── prd-validator.md
    │   │   ├── development-planner.md
    │   │   ├── roadmap-validator.md
    │   │   ├── project-structure-analyzer.md
    │   │   ├── domain-modeler.md      # DDD 전술 설계 (Aggregate, VO, Event)
    │   │   └── context-mapper.md      # DDD 전략 설계 (Bounded Context, Context Map)
    │   └── dev/                       # 개발 에이전트 (6개)
    │       ├── task-executor.md
    │       ├── unit-test-writer.md
    │       ├── e2e-tester.md
    │       ├── code-reviewer.md
    │       ├── quality-gate.md
    │       └── starter-cleaner.md
    ├── skills/                        # 스킬 (6개)
    │   ├── git/
    │   ├── tdd/
    │   ├── project-structure/
    │   ├── review-report/
    │   ├── harness-pipeline/
    │   └── domain-modeling/           # DDD 도메인 모델링 워크플로우
    └── hooks/                         # 훅 스크립트 (5개)
        ├── .env.hooks
        ├── biome-format.sh
        ├── block-dangerous-commands.sh
        ├── protect-files.sh
        ├── typecheck.sh
        └── slack-notify.sh
```

---

## 구성 요소 상세

### CLAUDE.md - 프로젝트 가이드 템플릿

프로젝트의 코어 원칙, 코드 컨벤션, 워크플로우를 정의하는 Claude Code용 설정 파일입니다. 새 프로젝트에 복사 후 `Project Overview` 섹션만 수정하면 바로 사용할 수 있습니다.

주요 내용:
- **코어 원칙**: TDD-First, DDD-Ready, Side Effect Awareness
- **코드 컨벤션**: 파일 네이밍 규칙, React 19 최적화, 타입 안전성
- **DDD 파일 규칙**: `*.entity.ts`, `*.vo.ts`, `*.event.ts`, `*.factory.ts`
- **필수 문서 연동**: PRD, ROADMAP, PROJECT-STRUCTURE, Domain Models (`docs/domain/`)
- **커맨드**: `bun run test`, `bun run typecheck` 등

### Agents - 에이전트

#### 문서 에이전트 (9개)

| 에이전트 | 설명 |
|----------|------|
| `prd-generator` | 소규모/중규모 웹 프로젝트의 PRD(제품 요구사항 문서) 생성 (DDD: Domain Model Overview 섹션 포함) |
| `prd-generator-backend` | REST API, GraphQL, 마이크로서비스 등 백엔드/API 프로젝트의 PRD 생성 (DDD: BC, Aggregate, Domain Event 정의) |
| `prd-generator-mobile` | React Native(Expo) 모바일 앱 프로젝트의 PRD 생성 (DDD: 오프라인 전략, 동기화 패턴) |
| `prd-validator` | 작성된 PRD를 기술적 관점에서 검증 (DDD: BC 일관성, UL 검증, Aggregate-Feature 매핑) |
| `development-planner` | ROADMAP.md 생성/유지보수 (DDD: Dev Phase 0-5 단계 지원, Context 기반 태스크 분해) |
| `roadmap-validator` | ROADMAP.md와 작업 파일들의 완성도 및 일관성 검증 (DDD: Phase 순서, Domain-First 검증) |
| `project-structure-analyzer` | 프로젝트 구조를 분석하여 PROJECT-STRUCTURE.md 작성/업데이트 (DDD: 도메인 레이어 감지) |
| `domain-modeler` | **DDD 전술 설계** — Event Storming 결과를 기반으로 Aggregate Root, Value Object, Domain Event 모델 생성 및 코드 스캐폴딩 |
| `context-mapper` | **DDD 전략 설계** — Bounded Context 식별, Context Map 생성, ACL 설계, 8가지 관계 패턴 지원 |

#### 개발 에이전트 (6개)

| 에이전트 | 설명 |
|----------|------|
| `task-executor` | TDD 사이클(Red-Green 단계) 자동 실행 (DDD: Domain-First TDD 순서 — VO→Aggregate→Service→App→Infra→Presentation) |
| `unit-test-writer` | TDD 원칙에 따라 단위 테스트 작성 (DDD: Aggregate/VO/Event 전용 테스트 패턴 및 레퍼런스) |
| `e2e-tester` | 웹 애플리케이션의 전체 사용자 흐름을 검증하는 E2E 테스팅 |
| `code-reviewer` | 코드 품질, 보안(OWASP Top 10), 성능 종합 검토 (DDD: 레이어 의존성, Aggregate 규칙, UL 일관성 검증) |
| `quality-gate` | TDD 사이클 완료 후 코드 리뷰와 E2E 테스트를 자동 실행하고 결과 요약 |
| `starter-cleaner` | 스타터 킷에서 데모 코드와 보일러플레이트를 제거하여 프로덕션 준비 |

### Skills - 스킬 (6개)

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| `git` | `/git` | 커밋, 푸시, 동기화, 병합 작업을 UI로 선택 및 실행 |
| `tdd` | `/tdd` | TDD 규칙과 패턴 정의 (DDD: Aggregate/VO/Event 테스트 레퍼런스 3종, Domain-First TDD 순서 정의) |
| `project-structure` | `/project-structure` | 클린 아키텍처 템플릿으로 PROJECT-STRUCTURE.md 자동 생성 (DDD: 도메인 레이어 구조 지원) |
| `review-report` | `/review-report` | 코드 리뷰 보고서 생성 (DDD: DDD Architecture Compliance 섹션 포함) |
| `harness-pipeline` | `/harness-pipeline` | 통합 개발 파이프라인 — DDD 자동감지, BC 기반 모드 감지, 멀티사이클 TDD, Shared Kernel 관리 |
| `domain-modeling` | `/domain-modeling` | **DDD 도메인 모델링** — Event Storming→전략 설계→전술 설계→검증의 4단계 워크플로우 오케스트레이션 |

### Hooks - 훅 (5개)

| 훅 | 트리거 | 설명 |
|----|--------|------|
| `biome-format.sh` | PostToolUse (Edit/Write) | 파일 저장 시 Biome 포매팅 자동 실행 |
| `block-dangerous-commands.sh` | PreToolUse (Bash) | `rm -rf`, `sudo` 등 위험한 명령어 실행 차단 |
| `protect-files.sh` | PreToolUse (Edit/Write) | `package-lock.json`, `bun.lock` 등 보호 대상 파일 수정 차단 |
| `typecheck.sh` | PostToolUse (Edit/Write) | TypeScript 파일 저장 시 타입 체크 자동 실행 |
| `slack-notify.sh` | Notification/Stop | 권한 요청, 입력 대기, 작업 완료 시 Slack 웹훅 알림 전송 |

### MCP Servers (3개)

| 서버 | 타입 | 설명 |
|------|------|------|
| `context7` | HTTP | 라이브러리의 최신 문서와 코드 예제를 실시간으로 조회 |
| `sequential-thinking` | stdio | 복잡한 문제를 단계적으로 분석하는 사고 도구 |
| `shadcn` | stdio | shadcn/ui 컴포넌트 검색, 설치, 예제 조회 |

### Settings - 설정

`.claude/settings.json`에서 관리되는 주요 설정:

| 설정 | 값 | 설명 |
|------|---|------|
| `enabledPlugins` | `typescript-lsp` | TypeScript LSP 플러그인 활성화 |
| `ENABLE_TOOL_SEARCH` | `true` | 도구 검색 기능 활성화 |
| `MAX_MCP_OUTPUT_TOKENS` | `50000` | MCP 출력 토큰 제한 |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1` | 에이전트 팀 기능 활성화 |

---

## 워크플로우 개요

CC-Ecosystem은 아이디어에서 머지까지의 전체 개발 사이클을 에이전트가 지원합니다.
DDD 프로젝트에서는 도메인 모델링이 자동으로 선행됩니다.

```
아이디어
  │
  ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  PRD 생성    │────▶│  PRD 검증         │────▶│  로드맵 생성      │
│ prd-generator│     │  prd-validator   │     │ development-     │
│ (DDD: Domain │     │ (DDD: BC 일관성,  │     │ planner          │
│  Model 섹션) │     │  UL, Aggregate   │     │ (DDD: Dev Phase  │
│              │     │  매핑 검증)       │     │  0-5 단계)       │
└─────────────┘     └──────────────────┘     └──────────────────┘
                                                      │
                                                      ▼
                                            ┌──────────────────┐
                                            │  로드맵 검증      │
                                            │ roadmap-validator│
                                            └──────────────────┘
                                                      │
                                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  /harness-pipeline                                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pipeline Phase 0: 도메인 모델링 (DDD 자동감지 시)          │  │
│  │ /domain-modeling                                          │  │
│  │                                                           │  │
│  │ Event Storming → context-mapper → domain-modeler(순차)    │  │
│  │ → Cross-Context 이벤트 검증 → /clear                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pipeline Phase 1: Plan (모드 자동감지)                     │  │
│  │                                                           │  │
│  │ Standard: 파일 수 기반 → Sequential/Delegated/Team        │  │
│  │ DDD: Bounded Context 수 기반 모드 감지                    │  │
│  │ Team Mode: Shared Kernel 사전 생성 후 teammate 배정       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pipeline Phase 2: TDD (Red → Green)                       │  │
│  │                                                           │  │
│  │ Standard: unit-test-writer → 구현 → 테스트 통과            │  │
│  │ DDD 멀티사이클: VO → Aggregate → Domain Service →         │  │
│  │   Application → Infrastructure → Presentation             │  │
│  │   (각 레이어마다 Red-Green 반복)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pipeline Phase 3: Review                                  │  │
│  │ code-reviewer (DDD: 레이어 의존성, Aggregate 규칙, UL)    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              │                                  │
│                              ▼                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Pipeline Phase 4: Validate & Finalize                     │  │
│  │ e2e-tester → development-planner → /git merge             │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## DDD 아키텍처 지원

CC-Ecosystem은 DDD 프로젝트에서 다음을 자동으로 수행합니다:

### 전략 설계 (Strategic Design)
- **Event Storming**: PRD에서 Domain Event, Command, Actor, Aggregate를 자동 추출
- **Bounded Context 식별**: 언어 경계 기반으로 컨텍스트를 자동 그룹핑
- **Context Map**: 8가지 관계 패턴 지원 (Shared Kernel, Customer-Supplier, ACL, OHS 등)
- **Ubiquitous Language**: 컨텍스트별 용어 사전 자동 생성

### 전술 설계 (Tactical Design)
- **Aggregate Root**: 불변식(Invariants) 보호, Domain Event 발행
- **Value Object**: 불변성, 값 동등성, 유효성 검증
- **Domain Event**: 상태 변경 추적, Cross-Context 통신
- **Domain Service**: 다중 Aggregate 간 비즈니스 로직

### Domain-First TDD (Inside-Out)
DDD 프로젝트에서는 레이어별 멀티사이클 TDD를 수행합니다:
1. **Value Objects** — 순수 로직, 의존성 없음
2. **Aggregate Root** — 불변식, 도메인 이벤트
3. **Domain Services** — Cross-Aggregate 로직
4. **Application Services** — Use Case, Port
5. **Infrastructure** — Repository, Adapter
6. **Presentation** — Controller, Route

### DDD 자동감지
다음 중 하나라도 해당되면 DDD 모드가 활성화됩니다:
- `CLAUDE.md`에 "DDD" 또는 "Domain-Driven Design" 명시
- `docs/domain/` 디렉토리 존재
- `docs/PRD.md`에 Bounded Context, Aggregate, Domain Event 언급
- 사용자가 명시적으로 DDD 요청

### DDD 관련 생성 문서
```
docs/domain/
├── event-storming.md              # Event Storming 결과
├── context-map.md                 # Context Map (관계 정의)
├── glossary.md                    # Ubiquitous Language (전체 컨텍스트)
├── aggregates/
│   ├── [context-a].md             # 컨텍스트별 Aggregate 정의
│   └── [context-b].md
├── events/
│   ├── [context-a]-events.md      # 컨텍스트별 Domain Event 카탈로그
│   └── [context-b]-events.md
└── integration/
    └── [context-a]-[context-b].md # Cross-Context 통합 스펙
```

---

## 사용 방법

### 1. 저장소 클론

```bash
git clone <repository-url> cc-ecosystem
```

### 2. 프로젝트에 복사

대상 프로젝트의 루트 디렉토리에 필요한 파일들을 복사합니다.

```bash
# 전체 복사 (권장)
cp -r cc-ecosystem/.claude /your/project/
cp cc-ecosystem/.mcp.json /your/project/
cp cc-ecosystem/CLAUDE.md /your/project/

# 또는 선택적 복사
cp -r cc-ecosystem/.claude/agents /your/project/.claude/
cp -r cc-ecosystem/.claude/skills /your/project/.claude/
cp -r cc-ecosystem/.claude/hooks /your/project/.claude/
```

### 3. CLAUDE.md 수정

`CLAUDE.md`의 `Project Overview` 섹션을 프로젝트에 맞게 수정합니다.

```markdown
## Project Overview
- **Service Name**: My Awesome App
- **Goal**: 사용자에게 최고의 경험을 제공하는 앱
- **Target Users**: 일반 사용자
```

### 4. 환경 설정

```bash
# 훅 스크립트 실행 권한 부여
chmod +x /your/project/.claude/hooks/*.sh

# Slack 알림 설정 (선택)
vi /your/project/.claude/hooks/.env.hooks
```

### 5. 개발 시작

```bash
# Claude Code 실행 후 워크플로우 시작
claude

# 개발 파이프라인 시작 (모드 자동 감지)
> /harness-pipeline

# DDD 프로젝트: 도메인 모델링만 먼저 실행하고 싶을 때
> /domain-modeling
```

---

## 커스터마이징

### 훅 환경변수 (`.claude/hooks/.env.hooks`)

Slack 알림을 사용하려면 웹훅 URL을 설정합니다.

```bash
SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
PROJECT_NAME="your-project-name"
```

### MCP 서버 API 키 (`.mcp.json`)

Context7 서버를 사용하려면 API 키를 설정합니다.

```json
{
  "mcpServers": {
    "context7": {
      "headers": {
        "CONTEXT7_API_KEY": "your-actual-api-key"
      }
    }
  }
}
```

### CLAUDE.md 템플릿 수정

프로젝트의 기술 스택이나 컨벤션이 다른 경우 `CLAUDE.md`를 수정합니다.

- **Tech Stack**: 패키지 매니저, 언어, 린터 등을 프로젝트에 맞게 변경
- **Code Conventions**: 프로젝트 고유의 코딩 컨벤션 추가/수정
- **Commands**: 프로젝트의 실제 스크립트 명령어로 업데이트
- **Critical Documents**: 문서 경로가 다른 경우 수정

### 훅 선택적 비활성화

특정 훅이 필요하지 않은 경우 `.claude/settings.json`에서 해당 훅 항목을 제거합니다.

### 에이전트/스킬 추가

`.claude/agents/` 또는 `.claude/skills/` 디렉토리에 새 마크다운 파일을 추가하여 커스텀 에이전트나 스킬을 만들 수 있습니다.
