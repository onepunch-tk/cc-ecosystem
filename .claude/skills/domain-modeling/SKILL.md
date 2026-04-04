---
name: domain-modeling
description: |
  DDD domain modeling workflow. Mandatory Phase 0 of the harness pipeline.
  Covers: Event Storming, Strategic Design (Context Map), Tactical Design (Aggregates, VOs, Events), Validation.
  Use when: (1) Starting a new project, (2) Adding a new bounded context, (3) Refining domain models.
---

# Domain Modeling Skill

Executes the DDD domain modeling workflow. Follow these phases **sequentially**.
This skill is **Phase 0** of the harness pipeline — it runs before planning.

---

## When to Use

| Scenario | Action |
|----------|--------|
| New project | Full workflow (Phase 1-4) |
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

## Phase 2: Strategic Design (Context Mapping)

> Previously delegated to a separate `context-mapper` agent. Now executed directly by this skill.

### 2-1. Language Analysis

Identify contexts by detecting where the same word means different things:

| Term | Context A Meaning | Context B Meaning |
|------|-------------------|-------------------|
| "Product" | In Catalog: browsable item | In Inventory: stockable unit |

**Rule**: Same term with different meanings = separate Bounded Contexts.

### 2-2. Context Classification

| Type | Description |
|------|-------------|
| **Core Domain** | Competitive advantage, highest investment |
| **Supporting Domain** | Necessary but not differentiating |
| **Generic Domain** | Commodity, consider off-the-shelf |

### 2-3. Relationship Patterns

| Pattern | When to Use |
|---------|-------------|
| **Shared Kernel** | Tightly coupled teams, shared core types |
| **Customer-Supplier** | One context depends on another's data |
| **Conformist** | No control over upstream, low divergence |
| **Anti-Corruption Layer (ACL)** | Protecting domain from external/legacy models |
| **Open Host Service (OHS)** | Public API for multiple consumers |
| **Published Language** | Event-driven communication, API contracts |
| **Separate Ways** | Unrelated domains, different lifecycle |
| **Partnership** | Co-developing teams, mutual dependency |

### 2-4. Output

Generate:
- `docs/domain/context-map.md` — Context Map with relationships and visual diagram
- `docs/domain/glossary.md` — Ubiquitous Language per context
- `docs/domain/integration/[a]-[b].md` — Integration spec per relationship

**Context Map Visual Notation**:
```
──OHS/PL──▶   Open Host Service with Published Language
──ACL──▶       Anti-Corruption Layer
──SK──         Shared Kernel (bidirectional)
──CS──▶        Customer-Supplier
```

### 2-5. Anti-Pattern Detection

Flag these issues:

| Anti-Pattern | Fix |
|--------------|-----|
| **God Context** | Split by subdomain |
| **Shared Database** | Separate data ownership, use events |
| **Distributed Monolith** | Use async events, ACL |
| **Leaky Abstraction** | Add ACL translator |

---

## Phase 3: Tactical Design (Domain Modeling)

> Previously delegated to a separate `domain-modeler` agent. Now executed directly by this skill.
> **Execute SEQUENTIALLY** — one Bounded Context at a time (Core → Supporting → Generic).

### 3-1. Design Rules

| Rule | Description |
|------|-------------|
| **One Transaction = One Aggregate** | Never modify multiple aggregates in one transaction |
| **Reference by ID** | Aggregates reference others by ID only |
| **Small Aggregates** | Max 5 entities per aggregate; split if larger |
| **Eventual Consistency** | Use Domain Events for cross-aggregate communication |
| **Factory for Complex Creation** | Use Factory pattern when >3 creation parameters |

### 3-2. Per-Context Output

For each Bounded Context, generate:

**`docs/domain/aggregates/[context].md`**:
```markdown
# [Bounded Context] Domain Model

## [Aggregate Name]
**Root**: [Entity Name]
**Invariants**: [List]
**Structure**:
- Root: [RootEntity]
  - [ChildEntity] (1:N)
  - [ValueObject]
**Domain Events**: [EventName]: Raised when [condition]
**Commands**: [CommandName]: [Description]
```

**`docs/domain/events/[context]-events.md`**:
```markdown
# [Bounded Context] Domain Events

| Event | Aggregate | Payload | Subscribers |
|-------|-----------|---------|-------------|
| [EventName] | [Source] | { field1, field2 } | [Target Context] |
```

### 3-3. Code Scaffolding

Based on detected framework, generate skeleton code:

**Backend (NestJS)**:
```
src/domain/[context]/
├── entities/[aggregate-root].entity.ts
├── value-objects/[name].vo.ts
├── events/[name].event.ts
├── services/[name].service.ts
├── factories/[name].factory.ts
└── repository.interface.ts          # Port only
```

**Frontend (React Router)**:
```
app/domain/[context]/
├── models/[aggregate].model.ts
├── events/[name].event.ts
├── schemas/[name].schema.ts
└── types.ts
```

### 3-4. Code Templates

**Aggregate Root**:
```typescript
export class [AggregateName] {
  private readonly domainEvents: [Event][] = [];
  private constructor(public readonly id: string, /* fields */) {}

  static create(props: Create[Name]Props): [AggregateName] {
    const instance = new [AggregateName](crypto.randomUUID(), /* ... */);
    instance.addDomainEvent(new [CreatedEvent]({ id: instance.id }));
    return instance;
  }

  static reconstitute(props: [Name]Props): [AggregateName] {
    return new [AggregateName](props.id, /* ... */);
  }

  pullDomainEvents(): [Event][] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  private addDomainEvent(event: [Event]): void {
    this.domainEvents.push(event);
  }
}
```

**Value Object**:
```typescript
export class [VOName] {
  private constructor(private readonly value: [Type]) {}
  static create(value: [Type]): [VOName] {
    if (/* invalid */) throw new [ValidationError]('...');
    return new [VOName](value);
  }
  equals(other: [VOName]): boolean { return this.value === other.value; }
  toValue(): [Type] { return this.value; }
}
```

**Domain Event**:
```typescript
export class [EventName] {
  public readonly occurredAt = new Date();
  constructor(public readonly payload: { readonly [field]: [type] }) {}
  get eventName(): string { return '[EventName]'; }
}
```

**ACL Translator** (for cross-context integration):
```typescript
export const [External]Translator = {
  toDomain(external: [ExternalDto]): [DomainModel] {
    return [DomainModel].reconstitute({ /* map fields */ });
  },
  toExternal(domain: [DomainModel]): [ExternalDto] {
    return { /* map fields */ };
  },
} as const;
```

---

## Phase 4: Validation

### 4-1. Model Consistency Check

| Check | Criteria |
|-------|----------|
| **Aggregate Boundaries** | Each aggregate has <=5 entities |
| **Reference by ID** | No direct object references between aggregates |
| **Event Coverage** | Every state change produces a domain event |
| **Invariant Protection** | All invariants enforced in aggregate root |
| **Language Consistency** | All names match glossary terms |
| **Layer Purity** | Domain layer has zero external dependencies |

### 4-2. PRD Coverage Check

| PRD Feature ID | Mapped to Context | Mapped to Aggregate | Covered |
|----------------|-------------------|---------------------|---------|
| [F001] | [Context] | [Aggregate] | Yes/No |

### 4-3. Integration Completeness Check

| Context A | Context B | Pattern Defined | ACL Exists | Events Defined |
|-----------|-----------|-----------------|------------|----------------|
| [A] | [B] | Yes/No | Yes/No/N/A | Yes/No |

### 4-4. Cross-Context Event Flow Verification

For each cross-context relationship:
1. Verify target context has an event handler for each consumed event
2. Verify ACL translator maps source event → target domain language
3. Verify no domain model leakage (target uses its own types)
4. Flag orphaned events (published but never consumed) as warnings

---

## Directory Structure Convention

```
docs/domain/
├── event-storming.md              # Phase 1 output
├── context-map.md                 # Phase 2 output
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

This skill is **Phase 0** of the harness pipeline:

```
Phase 0: Domain Modeling → Event Storming → Context Map → Domain Models → Validation
Phase 1: Plan (informed by domain models)
Phase 2: TDD (inside-out: VO → Aggregate → Domain Service → App → Infra → Presentation)
Phase 3: Review
Phase 4: Validate & Finalize
```

> After Phase 0, **recommend `/clear`** — domain modeling context is no longer needed.

---

## Quality Gate

Domain modeling is complete when ALL pass:

- [ ] Event Storming results documented
- [ ] Context Map with all relationships defined
- [ ] Ubiquitous Language glossary complete
- [ ] Every Bounded Context has aggregate definitions
- [ ] Domain Event catalog per context
- [ ] Integration specs for all context relationships
- [ ] Cross-context event flows verified
- [ ] PRD feature coverage >= 100%
- [ ] Code scaffolding generated
