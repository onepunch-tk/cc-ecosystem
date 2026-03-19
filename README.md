# CC-Ecosystem

어떤 프로젝트에서든 `.claude/` 디렉토리와 설정 파일들을 복사하여 즉시 사용할 수 있는 **Claude Code 에코시스템 설정 저장소**입니다. 에이전트, 스킬, 훅, MCP 서버 설정, 그리고 CLAUDE.md 템플릿을 포함합니다.

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
    │   ├── docs/                      # 문서 에이전트 (7개)
    │   │   ├── prd-generator.md
    │   │   ├── prd-generator-backend.md
    │   │   ├── prd-generator-mobile.md
    │   │   ├── prd-validator.md
    │   │   ├── development-planner.md
    │   │   ├── roadmap-validator.md
    │   │   └── project-structure-analyzer.md
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
    │   ├── workflow-interactive/
    │   └── workflow-team/
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
- **코어 원칙**: TDD-First, Side Effect Awareness
- **코드 컨벤션**: 파일 네이밍 규칙, React 19 최적화, 타입 안전성
- **필수 문서 연동**: PRD, ROADMAP, PROJECT-STRUCTURE
- **커맨드**: `bun run test`, `bun run typecheck` 등

### Agents - 에이전트

#### 문서 에이전트 (7개)

| 에이전트 | 설명 |
|----------|------|
| `prd-generator` | 소규모/중규모 웹 프로젝트의 PRD(제품 요구사항 문서) 생성 |
| `prd-generator-backend` | REST API, GraphQL, 마이크로서비스 등 백엔드/API 프로젝트의 PRD 생성 |
| `prd-generator-mobile` | React Native(Expo) 모바일 앱 프로젝트의 PRD 생성 |
| `prd-validator` | 작성된 PRD를 기술적 관점에서 검증하고 실현 가능성 분석 |
| `development-planner` | ROADMAP.md 파일을 생성, 업데이트, 유지보수하는 프로젝트 매니저 |
| `roadmap-validator` | ROADMAP.md와 작업 파일들의 완성도 및 일관성 검증 |
| `project-structure-analyzer` | 프로젝트 구조를 분석하여 PROJECT-STRUCTURE.md 작성/업데이트 |

#### 개발 에이전트 (6개)

| 에이전트 | 설명 |
|----------|------|
| `task-executor` | TDD 사이클(Red-Green 단계)을 자동으로 실행하는 워커 에이전트 |
| `unit-test-writer` | TDD 원칙에 따라 단위 테스트를 작성하는 테스트 엔지니어 |
| `e2e-tester` | 웹 애플리케이션의 전체 사용자 흐름을 검증하는 E2E 테스팅 |
| `code-reviewer` | 코드 품질, 보안(OWASP Top 10), 성능을 종합 검토 |
| `quality-gate` | TDD 사이클 완료 후 코드 리뷰와 E2E 테스트를 자동 실행하고 결과 요약 |
| `starter-cleaner` | 스타터 킷에서 데모 코드와 보일러플레이트를 제거하여 프로덕션 준비 |

### Skills - 스킬 (6개)

| 스킬 | 명령어 | 설명 |
|------|--------|------|
| `git` | `/git` | 커밋, 푸시, 동기화, 병합 작업을 UI로 선택 및 실행 |
| `tdd` | `/tdd` | TDD 규칙과 패턴 정의, Red-Green-Refactor 사이클 가이드 |
| `project-structure` | `/project-structure` | 클린 아키텍처 템플릿으로 PROJECT-STRUCTURE.md 자동 생성 |
| `review-report` | `/review-report` | 코드 리뷰 결과를 표준화된 보고서 형식으로 생성 |
| `workflow-interactive` | `/workflow-interactive` | 기능 구현용 표준 개발 워크플로우 (Plan → TDD → Review → Validate) |
| `workflow-team` | `/workflow-team` | 에이전트 팀의 병렬 자율 개발을 위한 오케스트레이션 프로토콜 |

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

```
아이디어
  │
  ▼
┌─────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  PRD 생성    │────▶│  PRD 검증         │────▶│  로드맵 생성      │
│ prd-generator│     │  prd-validator   │     │ development-     │
│              │     │                  │     │ planner          │
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
│                    개발 (TDD 사이클)                              │
│                                                                 │
│  /workflow-interactive 또는 /workflow-team                       │
│                                                                 │
│  ┌────────┐    ┌────────┐    ┌────────┐    ┌────────────────┐  │
│  │Red:    │───▶│Green:  │───▶│Refactor│───▶│ Code Review    │  │
│  │테스트   │    │구현     │    │리팩터링 │    │ code-reviewer  │  │
│  │작성     │    │        │    │        │    │                │  │
│  └────────┘    └────────┘    └────────┘    └────────────────┘  │
│       ▲                                            │           │
│       └────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Quality Gate    │
                    │  품질 검증        │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  /git merge      │
                    │  머지             │
                    └──────────────────┘
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

# 대화형 워크플로우
> /workflow-interactive

# 팀 병렬 개발
> /workflow-team lead
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
