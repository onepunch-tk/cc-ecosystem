# Project Structure Guide (NestJS + Clean Architecture)

## Overview

{OVERVIEW_CONTENT}

**Architecture Pattern**: Clean Architecture with NestJS DI
**Framework**: NestJS (Node.js framework with TypeScript)
**Key Characteristics**:
- Dependency Injection via NestJS decorators
- Module-based architecture
- Two structural approaches: Layer-first (CA purity) vs Module-first (NestJS idiomatic)

---

## Top-Level Directory Structure

```
{TOP_LEVEL_TREE}
```

**Key directories**:
- `src/` - Application source code
- `test/` - E2E and integration tests
- `dist/` - Compiled output (build artifacts)

---

## Architecture Approach Selection

Choose the structure that best fits your project:

| Approach | Structure | Recommended When |
|----------|-----------|------------------|
| **Layer-first** (CA purity) | `src/{domain,application,infrastructure,presentation}/` | CA purity, large projects, multiple bounded contexts |
| **Module-first** (NestJS idiomatic) | `src/modules/{feature}/{domain,application,infrastructure}/` | Feature cohesion, NestJS CLI usage, small-medium projects |

**Default recommendation**: Layer-first for large projects, Module-first for small-medium projects.

---

## Layer-First Structure (Default)

### src/domain/

**Role**: Pure business rules and entity definitions (NO framework dependencies)

**⚠️ CRITICAL**: NO `@nestjs/*` imports allowed. Pure TypeScript only.

**Contains**:
- **{bounded-context}/entities/**: Aggregate Roots and child entities
- **{bounded-context}/value-objects/**: Value objects (Email, Money, Address, etc.)
- **{bounded-context}/events/**: Domain Events (state change notifications)
- **{bounded-context}/services/**: Domain Services (cross-aggregate logic)
- **{bounded-context}/factories/**: Aggregate Factories (complex creation)
- **{bounded-context}/repository.interface.ts**: Repository interface (domain-defined)
- **{bounded-context}/errors/**: Domain-specific error classes

**Structure**:
```
domain/
├── user/
│   ├── entities/
│   │   └── user.entity.ts            # Aggregate Root
│   ├── value-objects/
│   │   └── email.vo.ts               # Immutable Value Object
│   ├── events/
│   │   ├── user-registered.event.ts   # Domain Event
│   │   └── index.ts
│   ├── repository.interface.ts
│   └── errors/
│       └── user-not-found.error.ts
├── order/
│   ├── entities/
│   │   ├── order.entity.ts           # Aggregate Root
│   │   └── order-item.entity.ts      # Child Entity (owned by Order)
│   ├── value-objects/
│   │   ├── money.vo.ts
│   │   └── quantity.vo.ts
│   ├── events/
│   │   ├── order-placed.event.ts
│   │   ├── order-cancelled.event.ts
│   │   └── index.ts
│   ├── services/
│   │   └── order-pricing.service.ts  # Domain Service (pure logic)
│   ├── factories/
│   │   └── order.factory.ts          # Complex Aggregate creation
│   ├── repository.interface.ts
│   └── errors/
│       ├── empty-order.error.ts
│       └── order-already-cancelled.error.ts
└── shared/
    ├── base-entity.ts                 # Base Aggregate Root with event support
    ├── domain-event.ts                # Base Domain Event interface
    └── value-objects/
        └── money.vo.ts                # Shared Value Objects
```

**When to use**:
- Adding new business concepts (e.g., orders, products, payments)
- Defining domain rules and invariants
- Creating value objects
- Adding domain events for state change tracking
- Creating domain services for cross-aggregate logic

**Example — Aggregate Root with Domain Events**:
```typescript
// domain/shared/domain-event.ts
export interface DomainEvent {
  readonly eventName: string;
  readonly occurredAt: Date;
  readonly payload: Record<string, unknown>;
}

// domain/shared/base-entity.ts
export abstract class BaseAggregateRoot {
  private readonly domainEvents: DomainEvent[] = [];

  protected addDomainEvent(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }
}

// domain/order/entities/order.entity.ts
import { BaseAggregateRoot } from '~/domain/shared/base-entity';
import { OrderPlaced } from '../events/order-placed.event';
import { OrderCancelled } from '../events/order-cancelled.event';
import { Money } from '~/domain/shared/value-objects/money.vo';
import { EmptyOrderError } from '../errors/empty-order.error';
import { OrderAlreadyCancelledError } from '../errors/order-already-cancelled.error';
import type { OrderItem } from './order-item.entity';

type OrderStatus = 'placed' | 'confirmed' | 'shipped' | 'cancelled';

export class Order extends BaseAggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly customerId: string,
    private readonly _items: OrderItem[],
    private _status: OrderStatus,
    public readonly createdAt: Date,
  ) {
    super();
  }

  // Factory method — raises events, validates invariants
  static create(props: { customerId: string; items: OrderItem[] }): Order {
    if (props.items.length === 0) {
      throw new EmptyOrderError();
    }
    const order = new Order(
      crypto.randomUUID(),
      props.customerId,
      props.items,
      'placed',
      new Date(),
    );
    order.addDomainEvent(new OrderPlaced({
      orderId: order.id,
      customerId: order.customerId,
      totalAmount: order.totalAmount.amount,
      itemCount: order.items.length,
    }));
    return order;
  }

  // Reconstitute from persistence — NO events raised
  static reconstitute(props: {
    id: string; customerId: string; items: OrderItem[];
    status: OrderStatus; createdAt: Date;
  }): Order {
    return new Order(props.id, props.customerId, props.items, props.status, props.createdAt);
  }

  // Domain behavior — enforces invariant
  cancel(reason: string): void {
    if (this._status === 'cancelled') {
      throw new OrderAlreadyCancelledError(this.id);
    }
    this._status = 'cancelled';
    this.addDomainEvent(new OrderCancelled({ orderId: this.id, reason }));
  }

  get status(): OrderStatus { return this._status; }
  get items(): readonly OrderItem[] { return this._items; }
  get totalAmount(): Money {
    return this._items.reduce(
      (sum, item) => sum.add(item.lineTotal),
      Money.create(0, 'KRW'),
    );
  }
}

// domain/order/events/order-placed.event.ts
export class OrderPlaced {
  public readonly occurredAt = new Date();
  public readonly eventName = 'OrderPlaced';
  constructor(public readonly payload: {
    readonly orderId: string;
    readonly customerId: string;
    readonly totalAmount: number;
    readonly itemCount: number;
  }) {}
}

// domain/shared/value-objects/money.vo.ts
export class Money {
  private constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {}

  static create(amount: number, currency: string): Money {
    if (amount < 0) throw new Error('Amount cannot be negative');
    return new Money(amount, currency);
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) throw new Error('Cannot add different currencies');
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(quantity: number): Money {
    return new Money(this.amount * quantity, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  toString(): string { return `${this.amount} ${this.currency}`; }
  toValue(): { amount: number; currency: string } {
    return { amount: this.amount, currency: this.currency };
  }
}

// domain/user/repository.interface.ts
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}
```

**Rules**:
- NO external dependencies (including NestJS)
- NO database concerns (only interfaces)
- NO framework decorators
- Aggregates reference other aggregates by ID only
- All state changes through Aggregate Root methods
- Domain Events raised on every state transition

---

### src/application/

**Role**: Business logic and use case implementation (orchestration layer)

**⚠️ Pragmatic compromise**: `@Injectable()` decorator allowed for DI, but NO other NestJS features.

**Contains**:
- **commands/**: Write operations (CreateUser, UpdateOrder, etc.)
- **queries/**: Read operations (GetUser, ListOrders, etc.)
- **services/**: Application services
- **dtos/**: Data Transfer Objects
- **mappers/**: Entity ↔ DTO conversion
- **ports/**: External system interface definitions

**Structure**:
```
application/
├── commands/
│   ├── create-user.command.ts
│   └── update-user.command.ts
├── queries/
│   ├── get-user.query.ts
│   └── list-users.query.ts
├── services/
│   └── user.service.ts
├── dtos/
│   ├── user.dto.ts
│   └── create-user.dto.ts
├── mappers/
│   └── user.mapper.ts
└── ports/
    ├── email.port.ts
    └── storage.port.ts
```

**When to use**:
- Adding new use cases (sign-up, payment processing, etc.)
- When communication with external systems (email, payment gateway) is needed
- Creating application-level services

**Example**:
```typescript
// application/commands/create-user.command.ts
import { Injectable, Inject } from '@nestjs/common';
import { User } from '~/domain/user/entities/user.entity';
import { Email } from '~/domain/user/value-objects/email';
import type { UserRepository } from '~/domain/user/repository.interface';

@Injectable()
export class CreateUserCommand {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(email: string): Promise<User> {
    const emailVO = Email.create(email);
    const user = new User(crypto.randomUUID(), emailVO, new Date());
    await this.userRepository.save(user);
    return user;
  }
}

// application/queries/get-user.query.ts
import { Injectable, Inject } from '@nestjs/common';
import { UserNotFoundError } from '~/domain/user/errors/user-not-found.error';
import type { UserRepository } from '~/domain/user/repository.interface';

@Injectable()
export class GetUserQuery {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return user;
  }
}

// application/dtos/user.dto.ts
export class UserDto {
  id: string;
  email: string;
  createdAt: string;
}

// application/mappers/user.mapper.ts
export class UserMapper {
  static toDto(user: User): UserDto {
    return {
      id: user.id,
      email: user.email.toString(),
      createdAt: user.createdAt.toISOString(),
    };
  }
}
```

**Rules**:
- Only `@Injectable()` decorator allowed (for DI)
- NO `@Controller`, `@Get`, `@Post`, etc.
- NO direct database access (use repository ports)

---

### src/infrastructure/

**Role**: External system integration and implementations (full NestJS features allowed)

**Contains**:
- **persistence/**: Database implementations (TypeORM, Prisma, Drizzle)
- **external/**: External API integrations (payment, email, etc.)
- **config/**: Configuration (env variables, validation)
- **auth/**: Authentication (Passport, JWT strategies)
- **messaging/**: Message queues (RabbitMQ, Kafka, etc.)

**Structure**:
```
infrastructure/
├── persistence/
│   ├── repositories/
│   │   └── user.repository.ts
│   └── entities/           # TypeORM entities
│       └── user.entity.ts
├── external/
│   ├── email/
│   │   └── email.service.ts
│   └── payment/
│       └── stripe.service.ts
├── config/
│   ├── database.config.ts
│   └── env.validation.ts
├── auth/
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   └── auth.service.ts
└── messaging/
    └── rabbitmq/
        └── rabbitmq.service.ts
```

**When to use**:
- Adding database repositories → `persistence/repositories/`
- Creating database schemas → `persistence/entities/` (TypeORM) or `persistence/schema/` (Drizzle)
- Adding external API integrations → `external/`
- Adding auth strategies → `auth/strategies/`

**Example**:
```typescript
// infrastructure/persistence/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '~/infrastructure/persistence/entities/user.entity';
import { User } from '~/domain/user/entities/user.entity';
import type { UserRepository as IUserRepository } from '~/domain/user/repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly ormRepository: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async save(user: User): Promise<void> {
    const entity = this.toEntity(user);
    await this.ormRepository.save(entity);
  }

  private toDomain(entity: UserEntity): User {
    return new User(entity.id, Email.create(entity.email), entity.createdAt);
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.email = user.email.toString();
    entity.createdAt = user.createdAt;
    return entity;
  }
}

// infrastructure/persistence/entities/user.entity.ts (TypeORM)
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}

// infrastructure/external/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend = new Resend(process.env.RESEND_API_KEY);

  async sendWelcomeEmail(to: string): Promise<void> {
    await this.resend.emails.send({
      from: 'noreply@example.com',
      to,
      subject: 'Welcome!',
      html: '<p>Welcome to our platform</p>',
    });
  }
}
```

**Rules**:
- Full NestJS features allowed
- Implement domain repository interfaces
- Handle all external I/O

---

### src/presentation/

**Role**: API layer (controllers, resolvers, gateways, middleware)

**Contains**:
- **controllers/**: REST API controllers
- **resolvers/**: GraphQL resolvers
- **gateways/**: WebSocket gateways
- **guards/**: Route guards (authentication, authorization)
- **interceptors/**: Request/response transformation
- **pipes/**: Validation pipes
- **filters/**: Exception filters
- **decorators/**: Custom decorators
- **middleware/**: Express middleware

**Structure**:
```
presentation/
├── controllers/
│   ├── user.controller.ts
│   └── order.controller.ts
├── resolvers/            # GraphQL (optional)
│   └── user.resolver.ts
├── gateways/             # WebSocket (optional)
│   └── chat.gateway.ts
├── guards/
│   ├── auth.guard.ts
│   └── roles.guard.ts
├── interceptors/
│   └── logging.interceptor.ts
├── pipes/
│   └── validation.pipe.ts
├── filters/
│   └── http-exception.filter.ts
├── decorators/
│   └── current-user.decorator.ts
└── middleware/
    └── logger.middleware.ts
```

**When to use**:
- Adding new REST endpoints → `controllers/`
- Adding GraphQL queries/mutations → `resolvers/`
- Adding WebSocket events → `gateways/`
- Adding route protection → `guards/`

**Example**:
```typescript
// presentation/controllers/user.controller.ts
import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { CreateUserCommand } from '~/application/commands/create-user.command';
import { GetUserQuery } from '~/application/queries/get-user.query';
import { UserMapper } from '~/application/mappers/user.mapper';
import { AuthGuard } from '~/presentation/guards/auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUserCommand: CreateUserCommand,
    private readonly getUserQuery: GetUserQuery,
  ) {}

  @Post()
  async create(@Body() body: { email: string }) {
    const user = await this.createUserCommand.execute(body.email);
    return UserMapper.toDto(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    const user = await this.getUserQuery.execute(id);
    return UserMapper.toDto(user);
  }
}

// presentation/guards/auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return !!request.headers.authorization;
  }
}

// presentation/filters/http-exception.filter.ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}
```

**Rules**:
- Full NestJS features allowed
- Depend on application layer (services, commands, queries)
- Handle HTTP/WS concerns only

---

### src/modules/

**Role**: NestJS Module registration hub (connects all layers)

**Contains**:
- Feature modules (`user.module.ts`, `order.module.ts`, etc.)
- Each module imports and provides services from all layers

**Structure**:
```
modules/
├── app.module.ts         # Root module
├── user.module.ts        # User feature module
├── order.module.ts       # Order feature module
└── shared.module.ts      # Shared utilities module
```

**When to use**:
- Registering new services/controllers → Add to relevant feature module
- Creating new feature → Create new module file

**Example Module**:
```typescript
// modules/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Presentation
import { UserController } from '~/presentation/controllers/user.controller';

// Application
import { CreateUserCommand } from '~/application/commands/create-user.command';
import { GetUserQuery } from '~/application/queries/get-user.query';

// Infrastructure
import { UserEntity } from '~/infrastructure/persistence/entities/user.entity';
import { UserRepository } from '~/infrastructure/persistence/repositories/user.repository';
import { EmailService } from '~/infrastructure/external/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UserController],
  providers: [
    // Application layer
    CreateUserCommand,
    GetUserQuery,
    // Infrastructure layer
    EmailService,
    {
      provide: 'UserRepository',
      useClass: UserRepository,
    },
  ],
  exports: ['UserRepository', EmailService],
})
export class UserModule {}
```

---

### main.ts

**Role**: Bootstrap entry point

**When to modify**:
- Adding global middleware
- Configuring Swagger
- Setting global pipes/filters

**Example**:
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '~/presentation/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
```

---

## NestJS Module Registration Pattern

```typescript
// src/modules/user.module.ts
import { Module } from '@nestjs/common';
import { UserController } from '~/presentation/controllers/user.controller';
import { CreateUserCommand } from '~/application/commands/create-user.command';
import { UserRepository } from '~/infrastructure/persistence/repositories/user.repository';

@Module({
  controllers: [UserController],         // Presentation layer
  providers: [
    CreateUserCommand,                    // Application layer
    {
      provide: 'UserRepository',          // Domain interface
      useClass: UserRepository,           // Infrastructure implementation
    },
  ],
  exports: ['UserRepository'],            // Share with other modules
})
export class UserModule {}
```

**Key points**:
- Controllers from presentation layer
- Commands/Services from application layer
- Repository implementations from infrastructure layer
- Domain interfaces provided via DI tokens

---

## Decorator Usage Rules per Layer

| Layer | `@nestjs/*` | `@Injectable()` | Reason |
|-------|-------------|-----------------|--------|
| **domain/** | ❌ | ❌ | Pure TS, framework independent |
| **application/** | ⚠️ `@Injectable()` only | ✅ | Required for DI (pragmatic compromise) |
| **infrastructure/** | ✅ Free | ✅ | Full NestJS features |
| **presentation/** | ✅ Free | ✅ | Controllers, Guards need decorators |

**Example violations to avoid**:

```typescript
// ❌ BAD: @nestjs/* in domain layer
import { Injectable } from '@nestjs/common';
export class User {} // domain/user/entities/user.ts

// ❌ BAD: @Controller in application layer
import { Controller } from '@nestjs/common';
@Controller()
export class CreateUserCommand {} // application/commands/create-user.command.ts

// ✅ GOOD: Pure TS in domain
export class User {
  constructor(
    public readonly id: string,
    public readonly email: Email, // value object
  ) {}
}

// ✅ GOOD: @Injectable() in application
import { Injectable } from '@nestjs/common';
@Injectable()
export class CreateUserCommand {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}
}
```

---

## Path Aliases

```typescript
// Defined in tsconfig.json
"~/*"        → "./src/*"
"@domain/*"  → "./src/domain/*"
"@app/*"     → "./src/application/*"
"@infra/*"   → "./src/infrastructure/*"
```

**Usage example**:
```typescript
import { User } from '~/domain/user/entities/user.entity';
import { CreateUserCommand } from '~/application/commands/create-user.command';
import { UserRepository } from '~/infrastructure/persistence/repositories/user.repository';
```

---

## File Location Summary by Task

| Task | Location |
|------|----------|
| Add new REST endpoint | `src/presentation/controllers/` |
| Add new GraphQL query/mutation | `src/presentation/resolvers/` |
| Add business logic | `src/application/commands/` or `src/application/queries/` |
| Add DB repository | `src/infrastructure/persistence/repositories/` |
| Add DB schema (TypeORM) | `src/infrastructure/persistence/entities/` |
| Add DB schema (Drizzle) | `src/infrastructure/persistence/schema/` |
| Add external API integration | `src/infrastructure/external/` |
| Define domain entity | `src/domain/{context}/entities/` |
| Define repository interface | `src/domain/{context}/repository.interface.ts` |
| Add guard/interceptor/pipe | `src/presentation/{guards,interceptors,pipes}/` |
| Write test files | `test/` (E2E) or `*.spec.ts` co-located (unit) |

---

## Module-First Structure (Alternative)

**When to use**: Small-medium projects, heavy use of NestJS CLI, feature cohesion priority

```
src/
├── modules/
│   ├── user/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── repository.interface.ts
│   │   ├── application/
│   │   │   ├── commands/
│   │   │   └── queries/
│   │   ├── infrastructure/
│   │   │   └── repositories/
│   │   ├── presentation/
│   │   │   └── user.controller.ts
│   │   └── user.module.ts
│   └── order/
│       └── ... (same structure)
├── shared/
│   ├── domain/
│   ├── infrastructure/
│   └── presentation/
└── main.ts
```

**Advantages**:
- Feature cohesion (all user-related code together)
- NestJS CLI friendly (`nest g module user`)
- Easier for small teams

**Trade-offs**:
- Less CA purity (layers not top-level)
- Harder to enforce layer boundaries

---

## References

- [NestJS Official Documentation](https://docs.nestjs.com/)
- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [NestJS + Clean Architecture Example](https://github.com/jbpionnier/nest-clean-architecture)
