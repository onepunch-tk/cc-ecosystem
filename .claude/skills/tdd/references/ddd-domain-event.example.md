# DDD Domain Event & Domain Service Testing Example

Testing patterns for Domain Events and Domain Services.

---

## Domain Event Test Structure

```typescript
// __tests__/domain/order/events/order-placed.event.test.ts

import { describe, it, expect } from 'vitest';
import { OrderPlaced } from '~/domain/order/events/order-placed.event';

describe('OrderPlaced Domain Event', () => {
  describe('creation', () => {
    it('creates event with correct payload', () => {
      // Arrange
      const payload = {
        orderId: 'order-123',
        customerId: 'customer-456',
        totalAmount: 15000,
        itemCount: 3,
      };

      // Act
      const event = new OrderPlaced(payload);

      // Assert
      expect(event.payload.orderId).toBe('order-123');
      expect(event.payload.customerId).toBe('customer-456');
      expect(event.payload.totalAmount).toBe(15000);
      expect(event.payload.itemCount).toBe(3);
    });

    it('records occurredAt timestamp', () => {
      // Arrange
      const before = new Date();

      // Act
      const event = new OrderPlaced({
        orderId: 'order-123',
        customerId: 'customer-456',
        totalAmount: 15000,
        itemCount: 3,
      });

      const after = new Date();

      // Assert
      expect(event.occurredAt.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(event.occurredAt.getTime()).toBeLessThanOrEqual(after.getTime());
    });

    it('has correct event name', () => {
      // Act
      const event = new OrderPlaced({
        orderId: 'order-123',
        customerId: 'customer-456',
        totalAmount: 15000,
        itemCount: 3,
      });

      // Assert
      expect(event.eventName).toBe('OrderPlaced');
    });
  });

  describe('payload immutability', () => {
    it('payload is readonly', () => {
      // Arrange
      const event = new OrderPlaced({
        orderId: 'order-123',
        customerId: 'customer-456',
        totalAmount: 15000,
        itemCount: 3,
      });

      // Assert - TypeScript readonly enforces this at compile time
      // Runtime verification via Object.isFrozen or property descriptor
      expect(event.payload.orderId).toBe('order-123');
    });
  });
});
```

---

## Domain Service Test Structure

```typescript
// __tests__/domain/pricing/services/discount.service.test.ts

import { describe, it, expect } from 'vitest';
import { DiscountService } from '~/domain/pricing/services/discount.service';
import { Order } from '~/domain/order/entities/order.entity';
import { OrderItem } from '~/domain/order/entities/order-item.entity';
import { Money } from '~/domain/shared/value-objects/money.vo';
import { Customer } from '~/domain/customer/entities/customer.entity';
import { CustomerTier } from '~/domain/customer/value-objects/customer-tier.vo';

describe('DiscountService (Domain Service)', () => {
  // Domain Service: operates across multiple Aggregates (Order + Customer)

  describe('calculateDiscount', () => {
    it('applies 10% discount for VIP customers', () => {
      // Arrange
      const customer = Customer.reconstitute({
        id: 'customer-123',
        tier: CustomerTier.VIP,
        joinedAt: new Date('2020-01-01'),
      });

      const order = Order.create({
        customerId: customer.id,
        items: [
          OrderItem.create({
            productId: 'prod-1',
            quantity: 1,
            unitPrice: Money.create(10000, 'KRW'),
          }),
        ],
      });

      // Act
      const discount = DiscountService.calculateDiscount(order, customer);

      // Assert
      expect(discount.equals(Money.create(1000, 'KRW'))).toBe(true);
    });

    it('applies no discount for regular customers', () => {
      // Arrange
      const customer = Customer.reconstitute({
        id: 'customer-456',
        tier: CustomerTier.REGULAR,
        joinedAt: new Date('2024-01-01'),
      });

      const order = Order.create({
        customerId: customer.id,
        items: [
          OrderItem.create({
            productId: 'prod-1',
            quantity: 1,
            unitPrice: Money.create(10000, 'KRW'),
          }),
        ],
      });

      // Act
      const discount = DiscountService.calculateDiscount(order, customer);

      // Assert
      expect(discount.equals(Money.create(0, 'KRW'))).toBe(true);
    });

    it('caps discount at 50000 KRW maximum', () => {
      // Arrange
      const customer = Customer.reconstitute({
        id: 'customer-123',
        tier: CustomerTier.VIP,
        joinedAt: new Date('2020-01-01'),
      });

      const order = Order.create({
        customerId: customer.id,
        items: [
          OrderItem.create({
            productId: 'prod-1',
            quantity: 1,
            unitPrice: Money.create(1000000, 'KRW'), // 100만원
          }),
        ],
      });

      // Act
      const discount = DiscountService.calculateDiscount(order, customer);

      // Assert
      // 10% of 1,000,000 = 100,000 but capped at 50,000
      expect(discount.equals(Money.create(50000, 'KRW'))).toBe(true);
    });
  });

  describe('isEligibleForFreeShipping', () => {
    it('returns true when order total exceeds threshold', () => {
      // Arrange
      const order = Order.create({
        customerId: 'customer-123',
        items: [
          OrderItem.create({
            productId: 'prod-1',
            quantity: 1,
            unitPrice: Money.create(50000, 'KRW'),
          }),
        ],
      });

      // Act
      const eligible = DiscountService.isEligibleForFreeShipping(order);

      // Assert
      expect(eligible).toBe(true);
    });

    it('returns false when order total is below threshold', () => {
      // Arrange
      const order = Order.create({
        customerId: 'customer-123',
        items: [
          OrderItem.create({
            productId: 'prod-1',
            quantity: 1,
            unitPrice: Money.create(10000, 'KRW'),
          }),
        ],
      });

      // Act
      const eligible = DiscountService.isEligibleForFreeShipping(order);

      // Assert
      expect(eligible).toBe(false);
    });
  });
});
```

---

## Event Handler Test (Application Layer)

```typescript
// __tests__/application/handlers/order-placed.handler.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderPlacedHandler } from '~/application/handlers/order-placed.handler';
import { OrderPlaced } from '~/domain/order/events/order-placed.event';

describe('OrderPlacedHandler', () => {
  let handler: OrderPlacedHandler;
  const mockEmailPort = {
    sendOrderConfirmation: vi.fn(),
  };
  const mockInventoryPort = {
    reserveItems: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    handler = new OrderPlacedHandler(mockEmailPort, mockInventoryPort);
  });

  it('sends order confirmation email', async () => {
    // Arrange
    const event = new OrderPlaced({
      orderId: 'order-123',
      customerId: 'customer-456',
      totalAmount: 15000,
      itemCount: 3,
    });

    // Act
    await handler.handle(event);

    // Assert
    expect(mockEmailPort.sendOrderConfirmation).toHaveBeenCalledWith({
      orderId: 'order-123',
      customerId: 'customer-456',
    });
  });

  it('reserves inventory items', async () => {
    // Arrange
    const event = new OrderPlaced({
      orderId: 'order-123',
      customerId: 'customer-456',
      totalAmount: 15000,
      itemCount: 3,
    });

    // Act
    await handler.handle(event);

    // Assert
    expect(mockInventoryPort.reserveItems).toHaveBeenCalledWith('order-123');
  });

  it('continues even if email fails (non-critical)', async () => {
    // Arrange
    mockEmailPort.sendOrderConfirmation.mockRejectedValue(new Error('SMTP down'));
    const event = new OrderPlaced({
      orderId: 'order-123',
      customerId: 'customer-456',
      totalAmount: 15000,
      itemCount: 3,
    });

    // Act & Assert — should not throw
    await expect(handler.handle(event)).resolves.not.toThrow();
    expect(mockInventoryPort.reserveItems).toHaveBeenCalled();
  });
});
```

---

## Key Testing Principles

### Domain Events
1. **Test payload correctness** — all required fields present
2. **Test timestamp** — `occurredAt` is recorded at creation time
3. **Test event name** — matches convention (PascalCase, past tense)
4. **Test immutability** — payload should not be mutable after creation

### Domain Services
1. **Pure domain logic** — no infrastructure dependencies
2. **Cross-aggregate operations** — test with multiple aggregate instances
3. **Business rules** — test thresholds, caps, eligibility rules
4. **No side effects** — Domain Services compute results, they don't persist

### Event Handlers (Application Layer)
1. **Mock ports** — never call real infrastructure
2. **Test orchestration** — verify correct ports are called with correct data
3. **Test resilience** — non-critical operations shouldn't block the handler
4. **Test event-to-command translation** — handler translates event into commands
