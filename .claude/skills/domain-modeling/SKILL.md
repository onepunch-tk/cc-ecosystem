---
name: domain-modeling
description: |
  DDD domain modeling workflow orchestration.
  Use when: (1) Starting a new DDD project, (2) Adding a new bounded context,
  (3) Refining domain models. Orchestrates domain-modeler and context-mapper agents.
---

# Domain Modeling Skill

Orchestrates the DDD domain modeling workflow. Follow these phases **sequentially**.

---

## When to Use

| Scenario | Action |
|----------|--------|
| New project with complex domain | Full workflow (Phase 1-4) |
| Adding a new bounded context | Phase 2-4 only |
| Refining existing domain model | Phase 3-4 only |
| Reviewing domain model quality | Phase 4 only |

---

## Phase 1: Domain Discovery

### Step 1: Gather Inputs

| Input | Source | Required |
|-------|--------|----------|
| PRD | `docs/PRD.md` | Yes |
| Existing domain models | `docs/domain/` | If exists |
| Project structure | `docs/PROJECT-STRUCTURE.md` | If exists |

### Step 2: Event Storming (Lightweight)

Perform a lightweight Event Storming analysis on the PRD:

1. **Identify Domain Events** — Extract all state changes (past tense verbs)
   - "Order is placed" → `OrderPlaced`
   - "Payment is confirmed" → `PaymentConfirmed`

2. **Identify Commands** — What triggers each event (imperative verbs)
   - "Place order" → `PlaceOrder` → `OrderPlaced`

3. **Identify Actors** — Who initiates each command
   - Customer, Admin, System (automated)

4. **Identify Aggregates** — Group related events/commands by consistency boundary

5. **Identify Bounded Contexts** — Group aggregates by language boundary

### Step 3: Output Event Storming Results

Create `docs/domain/event-storming.md`:

```markdown
# Event Storming Results

## Domain Events

| # | Event | Aggregate | Bounded Context | Triggered By |
|---|-------|-----------|-----------------|--------------|
| 1 | [EventName] | [Aggregate] | [Context] | [Command] |

## Commands

| # | Command | Actor | Target Aggregate | Produces Event |
|---|---------|-------|------------------|----------------|
| 1 | [CommandName] | [Actor] | [Aggregate] | [EventName] |

## Aggregates

| Aggregate | Bounded Context | Key Invariants |
|-----------|-----------------|----------------|
| [Name] | [Context] | [Invariant list] |

## Bounded Contexts (Candidate)

| Context | Type | Aggregates | Key Responsibility |
|---------|------|------------|-------------------|
| [Name] | Core/Supporting/Generic | [List] | [Description] |
```

---

## Phase 2: Strategic Design

Spawn the `context-mapper` agent:

```
Agent(subagent_type="context-mapper")
```

**Input to agent**:
- Event Storming results from Phase 1
- PRD for reference

**Expected output**:
- `docs/domain/context-map.md` — Context Map with relationships
- `docs/domain/glossary.md` — Ubiquitous Language per context
- Integration specs in `docs/domain/integration/`

---

## Phase 3: Tactical Design

Spawn the `domain-modeler` agent for **each** Bounded Context:

```
Agent(subagent_type="domain-modeler")
```

**Input to agent**:
- Bounded Context definition from Phase 2
- Ubiquitous Language glossary
- PRD features related to this context

**Expected output per context**:
- `docs/domain/aggregates/[context].md` — Aggregate definitions
- `docs/domain/events/[context]-events.md` — Domain Event catalog
- Skeleton code in `src/domain/[context]/` or `app/domain/[context]/`

---

## Phase 4: Validation

### 4-1. Model Consistency Check

| Check | Criteria | Pass/Fail |
|-------|----------|-----------|
| **Aggregate Boundaries** | Each aggregate has <=5 entities | |
| **Reference by ID** | No direct object references between aggregates | |
| **Event Coverage** | Every state change produces a domain event | |
| **Invariant Protection** | All invariants enforced in aggregate root | |
| **Language Consistency** | All names match glossary terms | |
| **Layer Purity** | Domain layer has zero external dependencies | |

### 4-2. PRD Coverage Check

| PRD Feature ID | Mapped to Context | Mapped to Aggregate | Covered |
|----------------|-------------------|---------------------|---------|
| [F001] | [Context] | [Aggregate] | Yes/No |

### 4-3. Integration Completeness Check

| Context A | Context B | Pattern Defined | ACL Exists | Events Defined |
|-----------|-----------|-----------------|------------|----------------|
| [A] | [B] | Yes/No | Yes/No/N/A | Yes/No |

---

## Directory Structure Convention

After domain modeling is complete:

```
docs/domain/
├── event-storming.md              # Phase 1 output
├── context-map.md                 # Phase 2 output (Context Map)
├── glossary.md                    # Ubiquitous Language (all contexts)
├── aggregates/
│   ├── [context-a].md             # Phase 3 output per context
│   └── [context-b].md
├── events/
│   ├── [context-a]-events.md      # Domain Event catalog per context
│   └── [context-b]-events.md
└── integration/
    └── [context-a]-[context-b].md # Integration specs
```

---

## Harness Pipeline Integration

This skill integrates with `harness-pipeline` as **Phase 0** (before Phase 1: Plan):

```
Phase 0: Domain Modeling (DDD projects only)
  → Event Storming → Context Map → Domain Models → Validation
Phase 1: Plan (informed by domain models)
Phase 2: TDD (domain-first: test aggregates → test services → test API)
Phase 3: Review
Phase 4: Validate & Finalize
```

**Domain-First TDD Order**:
1. Value Objects (pure logic, no dependencies)
2. Aggregate Root (invariants, domain events)
3. Domain Services (cross-aggregate logic)
4. Application Services (use cases, ports)
5. Infrastructure (repositories, adapters)
6. Presentation (controllers, routes)

---

## Quality Gate

Domain modeling is complete when ALL pass:

- [ ] Event Storming results documented
- [ ] Context Map with all relationships defined
- [ ] Ubiquitous Language glossary complete
- [ ] Every Bounded Context has aggregate definitions
- [ ] Domain Event catalog per context
- [ ] Integration specs for all context relationships
- [ ] PRD feature coverage >= 100%
- [ ] Code scaffolding generated
