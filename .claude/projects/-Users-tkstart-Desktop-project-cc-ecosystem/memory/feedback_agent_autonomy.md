---
name: Agent Autonomy on Missing Docs
description: 에이전트가 PRD/ROADMAP 미존재 시에도 멈추지 않고 자율 진행해야 한다는 피드백
type: feedback
---

에이전트(서브에이전트 포함)는 참조 문서(PRD.md, ROADMAP.md 등)가 없더라도 작업을 멈추지 않고, 가용한 컨텍스트(package.json, 기존 코드 패턴, 프로젝트 구조)를 기반으로 자율적으로 진행해야 한다.

**Why:** 사용자가 에이전트를 호출한 시점에 모든 문서가 준비되어 있지 않을 수 있으며, 문서 부재를 이유로 작업이 중단되면 워크플로우가 끊긴다.

**How to apply:** Discussion Protocol에서 "문서 미존재"를 MUST ask가 아닌 Safe to decide로 분류. 존재하면 반드시 참조하되, 없으면 합리적 기본값으로 진행.
