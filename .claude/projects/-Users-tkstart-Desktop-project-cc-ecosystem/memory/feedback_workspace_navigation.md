---
name: Workspace Navigation Priority
description: 모노레포/멀티프로젝트에서 정확한 작업 디렉토리 탐색이 플랫폼 모호성보다 중요하다는 피드백
type: feedback
---

에이전트가 turbo repo나 멀티 프로젝트 구성의 repo에서 작업할 때, "플랫폼이 모호하다"며 질문하는 것보다 작업 대상 디렉토리를 정확히 찾아가서 작업을 수행하는 것이 더 중요하다.

**Why:** 실제 프로젝트에서는 web/mobile이 공존하는 것이 일반적이며, 이를 모호성으로 취급하면 불필요한 질문이 발생한다.

**How to apply:** Discussion Protocol에서 "플랫폼 모호성" 항목을 제거. 대신 workspace detection 로직에서 실제 app/package 디렉토리를 식별하여 해당 위치 기준으로 작업.
