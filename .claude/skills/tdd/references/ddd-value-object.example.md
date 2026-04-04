# DDD Value Object Testing Example

Testing patterns for Value Objects with validation, equality, and immutability.

---

## Value Object Test Structure

```typescript
// __tests__/domain/shared/value-objects/money.vo.test.ts

import { describe, it, expect } from 'vitest';
import { Money } from '~/domain/shared/value-objects/money.vo';
import { InvalidCurrencyError } from '~/domain/shared/errors/invalid-currency.error';

describe('Money Value Object', () => {
  // ── Creation & Validation ──

  describe('create', () => {
    it('creates Money with valid amount and currency', () => {
      // Arrange & Act
      const money = Money.create(1000, 'KRW');

      // Assert
      expect(money.amount).toBe(1000);
      expect(money.currency).toBe('KRW');
    });

    it('throws on negative amount', () => {
      // Act & Assert
      expect(() => Money.create(-100, 'KRW')).toThrow('Amount cannot be negative');
    });

    it('throws on unsupported currency', () => {
      // Act & Assert
      expect(() => Money.create(100, 'XYZ' as never)).toThrow(InvalidCurrencyError);
    });

    it('allows zero amount', () => {
      // Act
      const money = Money.create(0, 'KRW');

      // Assert
      expect(money.amount).toBe(0);
    });
  });

  // ── Equality (Identity by Value) ──

  describe('equals', () => {
    it('returns true for same amount and currency', () => {
      // Arrange
      const a = Money.create(1000, 'KRW');
      const b = Money.create(1000, 'KRW');

      // Act & Assert
      expect(a.equals(b)).toBe(true);
    });

    it('returns false for different amounts', () => {
      // Arrange
      const a = Money.create(1000, 'KRW');
      const b = Money.create(2000, 'KRW');

      // Act & Assert
      expect(a.equals(b)).toBe(false);
    });

    it('returns false for different currencies', () => {
      // Arrange
      const a = Money.create(1000, 'KRW');
      const b = Money.create(1000, 'USD');

      // Act & Assert
      expect(a.equals(b)).toBe(false);
    });
  });

  // ── Domain Operations ──

  describe('add', () => {
    it('adds two Money of same currency', () => {
      // Arrange
      const a = Money.create(1000, 'KRW');
      const b = Money.create(500, 'KRW');

      // Act
      const result = a.add(b);

      // Assert
      expect(result.amount).toBe(1500);
      expect(result.currency).toBe('KRW');
    });

    it('throws when adding different currencies', () => {
      // Arrange
      const krw = Money.create(1000, 'KRW');
      const usd = Money.create(10, 'USD');

      // Act & Assert
      expect(() => krw.add(usd)).toThrow('Cannot add different currencies');
    });

    it('returns new instance (immutability)', () => {
      // Arrange
      const a = Money.create(1000, 'KRW');
      const b = Money.create(500, 'KRW');

      // Act
      const result = a.add(b);

      // Assert
      expect(result).not.toBe(a);
      expect(result).not.toBe(b);
      expect(a.amount).toBe(1000); // Original unchanged
    });
  });

  describe('multiply', () => {
    it('multiplies by quantity', () => {
      // Arrange
      const price = Money.create(1000, 'KRW');

      // Act
      const result = price.multiply(3);

      // Assert
      expect(result.amount).toBe(3000);
    });

    it('returns new instance (immutability)', () => {
      // Arrange
      const price = Money.create(1000, 'KRW');

      // Act
      const result = price.multiply(3);

      // Assert
      expect(result).not.toBe(price);
      expect(price.amount).toBe(1000); // Original unchanged
    });
  });

  // ── Serialization ──

  describe('toString', () => {
    it('formats as currency string', () => {
      // Arrange
      const money = Money.create(1000, 'KRW');

      // Act & Assert
      expect(money.toString()).toBe('1000 KRW');
    });
  });

  describe('toValue', () => {
    it('returns primitive representation', () => {
      // Arrange
      const money = Money.create(1000, 'KRW');

      // Act
      const value = money.toValue();

      // Assert
      expect(value).toEqual({ amount: 1000, currency: 'KRW' });
    });
  });
});
```

---

## Email Value Object Example

```typescript
// __tests__/domain/user/value-objects/email.vo.test.ts

import { describe, it, expect } from 'vitest';
import { Email } from '~/domain/user/value-objects/email.vo';

describe('Email Value Object', () => {
  describe('create', () => {
    it('creates valid email', () => {
      const email = Email.create('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });

    it('throws on invalid format', () => {
      expect(() => Email.create('invalid')).toThrow('Invalid email format');
    });

    it('throws on empty string', () => {
      expect(() => Email.create('')).toThrow('Email cannot be empty');
    });

    it('normalizes to lowercase', () => {
      const email = Email.create('User@Example.COM');
      expect(email.toString()).toBe('user@example.com');
    });
  });

  describe('equals', () => {
    it('case-insensitive equality', () => {
      const a = Email.create('user@example.com');
      const b = Email.create('USER@example.com');
      expect(a.equals(b)).toBe(true);
    });
  });

  describe('domain', () => {
    it('extracts domain part', () => {
      const email = Email.create('user@example.com');
      expect(email.domain).toBe('example.com');
    });
  });
});
```

---

## Key Testing Principles for Value Objects

### 1. Test Validation Rules
Value Objects enforce their own validity at creation time:
- Invalid inputs must throw descriptive errors
- Edge cases: empty, null, boundary values

### 2. Test Equality by Value
- Same attributes → equal
- Different attributes → not equal
- Not referential equality (`toBe`), but value equality (`equals()`)

### 3. Test Immutability
Every operation must return a NEW instance:
- Original instance must not be mutated
- Use `not.toBe()` to verify new reference
- Verify original values unchanged after operation

### 4. Test Domain Operations
Value Objects often have domain-relevant methods:
- `Money.add()`, `Money.multiply()`
- `Email.domain`, `DateRange.overlaps()`
- Test both happy path and error cases (e.g., adding different currencies)

### 5. Test Serialization
Value Objects need to convert to/from primitives for persistence:
- `toString()` — human-readable format
- `toValue()` — primitive representation for storage
