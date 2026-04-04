# DDD Aggregate Root Testing Example

Testing patterns for Aggregate Roots with invariants, domain events, and factory methods.

---

## Aggregate Root Test Structure

```typescript
// __tests__/domain/order/entities/order.entity.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { Order } from '~/domain/order/entities/order.entity';
import { OrderItem } from '~/domain/order/entities/order-item.entity';
import { Money } from '~/domain/order/value-objects/money.vo';
import { OrderPlaced } from '~/domain/order/events/order-placed.event';
import { OrderCancelled } from '~/domain/order/events/order-cancelled.event';
import { OrderAlreadyCancelledError } from '~/domain/order/errors/order-already-cancelled.error';
import { EmptyOrderError } from '~/domain/order/errors/empty-order.error';

describe('Order Aggregate', () => {
  // ── Factory / Creation ──

  describe('create', () => {
    it('creates a new order and raises OrderPlaced event', () => {
      // Arrange
      const customerId = 'customer-123';
      const items = [
        OrderItem.create({ productId: 'prod-1', quantity: 2, unitPrice: Money.create(1000, 'KRW') }),
      ];

      // Act
      const order = Order.create({ customerId, items });

      // Assert
      expect(order.id).toBeDefined();
      expect(order.customerId).toBe(customerId);
      expect(order.items).toHaveLength(1);
      expect(order.status).toBe('placed');

      const events = order.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderPlaced);
    });

    it('throws EmptyOrderError when creating with no items', () => {
      // Arrange & Act & Assert
      expect(() =>
        Order.create({ customerId: 'customer-123', items: [] }),
      ).toThrow(EmptyOrderError);
    });
  });

  // ── Reconstitution (from DB) ──

  describe('reconstitute', () => {
    it('reconstitutes without raising events', () => {
      // Arrange
      const props = {
        id: 'order-123',
        customerId: 'customer-123',
        items: [],
        status: 'placed' as const,
        totalAmount: Money.create(1000, 'KRW'),
        createdAt: new Date('2025-01-01'),
      };

      // Act
      const order = Order.reconstitute(props);

      // Assert
      expect(order.id).toBe('order-123');
      expect(order.pullDomainEvents()).toHaveLength(0); // No events on reconstitution
    });
  });

  // ── Invariant Tests ──

  describe('invariants', () => {
    let order: Order;

    beforeEach(() => {
      order = Order.create({
        customerId: 'customer-123',
        items: [
          OrderItem.create({ productId: 'prod-1', quantity: 1, unitPrice: Money.create(5000, 'KRW') }),
        ],
      });
      order.pullDomainEvents(); // Clear creation events
    });

    it('totalAmount equals sum of item prices', () => {
      // Assert
      expect(order.totalAmount.equals(Money.create(5000, 'KRW'))).toBe(true);
    });

    it('cannot add item with zero quantity', () => {
      // Arrange
      const invalidItem = () =>
        OrderItem.create({ productId: 'prod-2', quantity: 0, unitPrice: Money.create(1000, 'KRW') });

      // Act & Assert
      expect(invalidItem).toThrow('Quantity must be positive');
    });
  });

  // ── Domain Behavior ──

  describe('cancel', () => {
    let order: Order;

    beforeEach(() => {
      order = Order.create({
        customerId: 'customer-123',
        items: [
          OrderItem.create({ productId: 'prod-1', quantity: 1, unitPrice: Money.create(5000, 'KRW') }),
        ],
      });
      order.pullDomainEvents(); // Clear creation events
    });

    it('cancels order and raises OrderCancelled event', () => {
      // Act
      order.cancel('Customer request');

      // Assert
      expect(order.status).toBe('cancelled');
      const events = order.pullDomainEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(OrderCancelled);
      expect((events[0] as OrderCancelled).payload.reason).toBe('Customer request');
    });

    it('throws OrderAlreadyCancelledError when cancelling twice', () => {
      // Arrange
      order.cancel('First cancel');

      // Act & Assert
      expect(() => order.cancel('Second cancel')).toThrow(OrderAlreadyCancelledError);
    });
  });

  // ── Domain Event Pull Pattern ──

  describe('domain events', () => {
    it('pullDomainEvents clears the event list', () => {
      // Arrange
      const order = Order.create({
        customerId: 'customer-123',
        items: [
          OrderItem.create({ productId: 'prod-1', quantity: 1, unitPrice: Money.create(1000, 'KRW') }),
        ],
      });

      // Act
      const firstPull = order.pullDomainEvents();
      const secondPull = order.pullDomainEvents();

      // Assert
      expect(firstPull).toHaveLength(1);
      expect(secondPull).toHaveLength(0);
    });
  });
});
```

---

## Key Testing Principles for Aggregates

### 1. Test Invariants First
Every aggregate has business rules that must always hold. Test them explicitly:
- "Order total must equal sum of line items"
- "Cannot cancel an already cancelled order"
- "Order must have at least one item"

### 2. Test Factory vs Reconstitution
- `create()` — raises domain events, validates all invariants
- `reconstitute()` — no events, trusts persisted data

### 3. Test Domain Events
- Verify correct event type is raised
- Verify event payload contains expected data
- Verify `pullDomainEvents()` clears the list (prevent double-processing)

### 4. Test State Transitions
For each domain method, test:
- **Happy path**: state changes correctly, event raised
- **Guard clause**: throws domain error when invariant would be violated
- **Idempotency**: if applicable, calling twice has no side effect

### 5. No Infrastructure in Tests
- No database mocking
- No HTTP calls
- Pure domain logic only
- If you need to mock something, it's a sign the aggregate has infrastructure leaking in
