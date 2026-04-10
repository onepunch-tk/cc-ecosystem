# CC-Ecosystem

어떤 프로젝트에서든 `.claude/` 디렉토리와 설정 파일들을 복사하여 즉시 사용할 수 있는 **Claude Code 에코시스템 설정 저장소**입니다. 에이전트, 스킬, 훅, MCP 서버 설정, 그리고 CLAUDE.md 템플릿을 포함합니다.

---

## 프로젝트 구조

```
cc-ecosystem/
├── CLAUDE.md                          # 프로젝트 가이드 템플릿 (경량화 — 컨벤션은 rules/에)
├── .mcp.json                          # MCP 서버 설정
├── .gitignore
└── .claude/
    ├── settings.json                  # 훅, 환경변수, 플러그인 설정
    ├── pipeline-state.json            # 파이프라인 Phase 상태 (ABAC + plan_approved)
    ├── hook-state.json                # Pipeline guardian 중복 방지/쿨다운 상태
    ├── ownership.json                 # 팀 파일 소유권 (ReBAC)
    ├── rules/                         # 조건부 지침 (파일 편집 시에만 로드)
    │   ├── file-conventions.md        # 파일 네이밍 + CA 레이어 규칙 (*.ts, *.tsx)
    │   ├── react-rules.md             # React 19 최적화 (*.tsx)
    │   └── code-style.md              # 함수 정의 + 타입 안전성 (*.ts, *.tsx)
    ├── agents/
    │   ├── docs/                      # 문서 에이전트 (5개)
    │   │   ├── prd-generator.md
    │   │   ├── prd-validator.md
    │   │   ├── development-planner.md
    │   │   ├── roadmap-validator.md
    │   │   └── project-structure-analyzer.md
    │   └── dev/                       # 개발 에이전트 (4개)
    │       ├── unit-test-writer.md
    │       ├── e2e-tester.md
    │       ├── code-reviewer.md
    │       └── starter-cleaner.md
    ├── skills/                        # 스킬 (6개)
    │   ├── prd/
    │   ├── git/
    │   ├── tdd/
    │   ├── project-structure/
    │   ├── review-report/
    │   └── harness-pipeline/
    │       ├── SKILL.md               # 메인 파이프라인 (경량화 — Phase는 references/에)
    │       └── references/            # Phase별 상세 지침 (필요 시에만 로드)
    │           ├── phase-1-plan.md
    │           ├── phase-2-tdd.md
    │           ├── phase-3-review.md
    │           ├── phase-4-validate.md
    │           └── team-protocol.md
    └── hooks/                         # 훅 스크립트 (10개)
        ├── .env.hooks
        ├── biome-format.sh
        ├── block-dangerous-commands.sh
        ├── protect-files.sh
        ├── typecheck.sh
        ├── slack-notify.sh
        ├── pipeline-guardian.sh
        ├── rbac-agent-role.sh
        ├── abac-phase-policy.sh
        ├── rebac-ownership.sh
        └── rebac-teammate-idle.sh
```

---

## 구성 요소 상세

### CLAUDE.md - 프로젝트 가이드 템플릿

경량화된 Claude Code 설정 파일 (32줄)로, 코어 원칙, 기술 스택, 워크플로우 진입점을 정의합니다. 상세한 코드 컨벤션은 `.claude/rules/`에서 해당 파일 편집 시에만 조건부로 로드됩니다.

주요 내용:
- **코어 원칙**: Clean Architecture (4-layer), TDD-First (Inside-Out), Side Effect Awareness
- **필수 문서 연동**: PRD, ROADMAP, PROJECT-STRUCTURE
- **커맨드**: `bun run test`, `bun run typecheck` 등

### .claude/rules/ - 조건부 지침

`paths` frontmatter 패턴과 일치하는 파일을 편집할 때만 로드됩니다. 세션 시작 시 토큰 비용을 줄이기 위해 컨벤션을 관련 시점까지 지연 로드합니다.

| 규칙 | 로드 시점 | 내용 |
|------|----------|------|
| `file-conventions.md` | `*.ts`, `*.tsx` 편집 시 | 파일 네이밍 (.client.ts/.server.ts), CA 레이어별 파일 패턴 |
| `react-rules.md` | `*.tsx` 편집 시 | React 19 Compiler 최적화, useCallback/useMemo 가이드 |
| `code-style.md` | `*.ts`, `*.tsx` 편집 시 | 함수 정의 (arrow vs named), 타입 안전성 (no `any`) |

### 에이전트

#### 문서 에이전트 (5개)

| 에이전트 | 설명 |
|----------|------|
| `prd-generator` | Web/Backend/Mobile/Multi-platform PRD 통합 생성 (prd 스킬 활용) |
| `prd-validator` | 작성된 PRD를 기술적 관점에서 검증하고 실현 가능성 분석 |
| `development-planner` | ROADMAP.md 파일을 생성, 업데이트, 유지보수하는 프로젝트 매니저 |
| `roadmap-validator` | ROADMAP.md와 작업 파일들의 완성도 및 일관성 검증 |
| `project-structure-analyzer` | 프로젝트 구조를 분석하여 PROJECT-STRUCTURE.md 작성/업데이트 |

#### 개발 에이전트 (4개)

| 에이전트 | 설명 |
|----------|------|
| `unit-test-writer` | TDD 원칙에 따라 단위 테스트를 작성하는 테스트 엔지니어 (tdd 스킬 활용) |
| `e2e-tester` | 웹 애플리케이션의 전체 사용자 흐름을 검증하는 E2E 테스팅 |
| `code-reviewer` | 코드 품질, 보안(OWASP Top 10), 성능을 종합 검토 |
| `starter-cleaner` | 스타터 킷에서 데모 코드와 보일러플레이트를 제거하여 프로덕션 준비 |

### 스킬 (6개)

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| `prd` | -- | PRD 생성 규칙, 플랫폼별 템플릿, 일관성 검증 (Web/Backend/Mobile/Multi-platform) |
| `git` | `/git` | 커밋, 푸시, 동기화, 병합 작업을 UI로 선택 및 실행 |
| `tdd` | `/tdd` | TDD 규칙과 패턴 정의, Red-Green-Refactor 사이클 가이드 |
| `project-structure` | `/project-structure` | 클린 아키텍처 템플릿으로 PROJECT-STRUCTURE.md 자동 생성 |
| `review-report` | `/review-report` | 코드 리뷰 결과를 표준화된 보고서 형식으로 생성 |
| `harness-pipeline` | `/harness-pipeline` | 통합 개발 파이프라인 -- Phase별 지침을 references/에서 필요 시 로드, Sequential 또는 Team 모드 자동 감지 |

### 훅 (10개)

#### 기본 훅 (5개)

| 훅 | 트리거 | 설명 |
|----|--------|------|
| `biome-format.sh` | PostToolUse (Edit/Write) | 파일 저장 시 Biome 포매팅 자동 실행 |
| `block-dangerous-commands.sh` | PreToolUse (Bash) | 위험한 명령어 차단 (`rm -rf /`, `sudo`, `git clean -fd`, 디바이스 쓰기) |
| `protect-files.sh` | PreToolUse (Edit/Write) | 보호 대상 파일 수정 차단 (lock 파일, `.env`, credentials) |
| `typecheck.sh` | PostToolUse (Edit/Write) | TypeScript 파일 저장 시 타입 체크 자동 실행 |
| `slack-notify.sh` | Notification/Stop | 권한 요청, 입력 대기, 작업 완료 시 Slack 웹훅 알림 전송 |

#### 워크플로우 훅 (1개)

| 훅 | 트리거 | 설명 |
|----|--------|------|
| `pipeline-guardian.sh` | Stop | 워크플로우 준수를 감시하고 문서 업데이트 필요성을 자동 감지. Plan 미승인, TDD 테스트 누락, 리뷰 생략, 문서 업데이트 필요 시 Claude의 응답 중단을 차단하고 리마인드. `git ls-files`로 monorepo 지원. |

#### 접근 제어 훅 (4개)

| 훅 | 트리거 | 설명 |
|----|--------|------|
| `rbac-agent-role.sh` | PreToolUse (Edit/Write) | 역할 기반 쓰기 권한 -- 에이전트별 허용 경로 제한 |
| `abac-phase-policy.sh` | PreToolUse (Edit/Write) | Phase 기반 소스코드 차단 -- plan phase와 Plan 미승인 tdd phase에서 코드 수정 물리적 차단 (hard block) |
| `rebac-ownership.sh` | PreToolUse (Edit/Write) | subagent_type으로 생성된 에이전트의 파일 소유권 검사 (Team 모드) |
| `rebac-teammate-idle.sh` | TeammateIdle | teammate가 유휴 전환 시 소유권 위반을 사후 감지 |

### MCP 서버 (3개)

| 서버 | 타입 | 설명 |
|------|------|------|
| `context7` | HTTP | 라이브러리의 최신 문서와 코드 예제를 실시간으로 조회 |
| `sequential-thinking` | stdio | 복잡한 문제를 단계적으로 분석하는 사고 도구 |
| `shadcn` | stdio | shadcn/ui 컴포넌트 검색, 설치, 예제 조회 |

### 설정

`.claude/settings.json`에서 관리되는 주요 설정:

| 설정 | 값 | 설명 |
|------|---|------|
| `enabledPlugins` | `typescript-lsp`, `discord` | TypeScript LSP 및 Discord 플러그인 활성화 |
| `ENABLE_TOOL_SEARCH` | `true` | 도구 검색 기능 활성화 |
| `MAX_MCP_OUTPUT_TOKENS` | `50000` | MCP 출력 토큰 제한 |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` | `1` | 에이전트 팀 기능 활성화 |

---

## 워크플로우 개요

CC-Ecosystem은 아이디어에서 머지까지의 전체 개발 사이클을 에이전트가 지원합니다.
**Clean Architecture가 기본 아키텍처**이며, 모든 코드는 CA 레이어 순서(Inside-Out)로 개발됩니다.

```
아이디어
  |
  v
+---------------+     +------------------+     +------------------+
|  PRD 생성      |---->|  PRD 검증         |---->|  로드맵 생성      |
| prd-generator |     |  prd-validator   |     | development-     |
|               |     |                  |     | planner          |
+---------------+     +------------------+     +------------------+
                                                      |
                                                      v
                                            +------------------+
                                            |  로드맵 검증      |
                                            | roadmap-validator |
                                            +------------------+
                                                      |
                                                      v
+-----------------------------------------------------------------+
|              개발 (CA + TDD Inside-Out)                           |
|                                                                  |
|  /harness-pipeline                                               |
|  Phase 1: Plan -- CA 템플릿 로드, 레이어별 파일 배치 계획           |
|  Phase 2: TDD  -- Domain > App > Infra > Presentation 순서 구현   |
|  Phase 3: Review -- CA 의존성 방향 검증 포함                       |
|  Phase 4: Validate & Finalize -- E2E, ROADMAP 업데이트, 머지       |
|                                                                  |
|  모드: Sequential (1-5파일) | Team (6+파일, 병렬 작업)             |
|                                                                  |
|  +--------+    +--------+    +--------+    +----------------+    |
|  |Red:    |--->|Green:  |--->|Refactor|--->| Code Review    |    |
|  |테스트   |    |구현     |    |리팩터링 |    | + CA 의존성     |    |
|  |(Domain |    |(Inside |    |        |    |   방향 체크      |    |
|  | first) |    | -Out)  |    |        |    |                |    |
|  +--------+    +--------+    +--------+    +----------------+    |
|       ^                                            |             |
|       +--------------------------------------------+             |
+-----------------------------------------------------------------+
                              |
                              v
                    +------------------+
                    |  /git merge      |
                    |  머지             |
                    +------------------+

  pipeline-guardian (Stop 훅)이 각 Phase 전환을 감시하고
  머지 전 문서 업데이트를 리마인드합니다.
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
cp -r cc-ecosystem/.claude/rules /your/project/.claude/
```

### 3. CLAUDE.md 수정

`CLAUDE.md`의 `Project Overview`와 `Tech Stack` 섹션을 프로젝트에 맞게 수정합니다.

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
- **Code Conventions**: `.claude/rules/`에 프로젝트 고유의 코딩 컨벤션 추가/수정
- **Commands**: 프로젝트의 실제 스크립트 명령어로 업데이트
- **Critical Documents**: 문서 경로가 다른 경우 수정

### 훅 선택적 비활성화

특정 훅이 필요하지 않은 경우 `.claude/settings.json`에서 해당 훅 항목을 제거합니다.

### 에이전트/스킬 추가

`.claude/agents/` 또는 `.claude/skills/` 디렉토리에 새 마크다운 파일을 추가하여 커스텀 에이전트나 스킬을 만들 수 있습니다.
