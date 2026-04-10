import { describe, it, expect } from "vitest";
import { clamp, roundTo, isInRange } from "../number";

// 도메인 레이어 유틸리티 — 순수 함수, 목(mock) 없음

describe("clamp", () => {
  describe("정상 케이스", () => {
    it("범위 내 값을 그대로 반환한다", () => {
      // Arrange
      const value = 5;
      const min = 1;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(5);
    });

    it("최솟값보다 작은 값에 대해 최솟값을 반환한다", () => {
      // Arrange
      const value = -5;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(0);
    });

    it("최댓값보다 큰 값에 대해 최댓값을 반환한다", () => {
      // Arrange
      const value = 15;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(10);
    });
  });

  describe("경계 케이스", () => {
    it("값이 최솟값과 같을 때 최솟값을 반환한다", () => {
      // Arrange
      const value = 0;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(0);
    });

    it("값이 최댓값과 같을 때 최댓값을 반환한다", () => {
      // Arrange
      const value = 10;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(10);
    });
  });

  describe("엣지 케이스", () => {
    it("최솟값과 최댓값이 같을 때 해당 값을 반환한다", () => {
      // Arrange
      const value = 5;
      const min = 3;
      const max = 3;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(3);
    });

    it("null 입력에 대해 0을 반환한다", () => {
      // Arrange
      const value = null as unknown as number;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(0);
    });

    it("undefined 입력에 대해 0을 반환한다", () => {
      // Arrange
      const value = undefined as unknown as number;
      const min = 0;
      const max = 10;

      // Act
      const result = clamp(value, min, max);

      // Assert
      expect(result).toBe(0);
    });
  });
});

describe("roundTo", () => {
  describe("정상 케이스", () => {
    it("소수점 2자리로 반올림한다", () => {
      // Arrange
      const value = 3.14159;
      const decimals = 2;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(3.14);
    });

    it("소수점 0자리로 반올림하여 정수를 반환한다", () => {
      // Arrange
      const value = 3.6;
      const decimals = 0;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(4);
    });

    it("소수점 1자리로 반올림한다", () => {
      // Arrange
      const value = 2.75;
      const decimals = 1;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(2.8);
    });
  });

  describe("경계 케이스", () => {
    it("decimals가 0일 때 정수를 반환한다", () => {
      // Arrange
      const value = 9.5;
      const decimals = 0;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(10);
    });

    it("음수 값을 소수점 2자리로 반올림한다", () => {
      // Arrange
      const value = -1.235;
      const decimals = 2;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(-1.24);
    });

    it("이미 정확한 소수점 자릿수를 가진 값을 그대로 반환한다", () => {
      // Arrange
      const value = 1.25;
      const decimals = 2;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(1.25);
    });
  });

  describe("엣지 케이스", () => {
    it("null 입력에 대해 0을 반환한다", () => {
      // Arrange
      const value = null as unknown as number;
      const decimals = 2;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(0);
    });

    it("undefined 입력에 대해 0을 반환한다", () => {
      // Arrange
      const value = undefined as unknown as number;
      const decimals = 2;

      // Act
      const result = roundTo(value, decimals);

      // Assert
      expect(result).toBe(0);
    });
  });
});

describe("isInRange", () => {
  describe("정상 케이스", () => {
    it("범위 내 값에 대해 true를 반환한다", () => {
      // Arrange
      const value = 5;
      const min = 1;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(true);
    });

    it("최솟값보다 작은 값에 대해 false를 반환한다", () => {
      // Arrange
      const value = 0;
      const min = 1;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(false);
    });

    it("최댓값보다 큰 값에 대해 false를 반환한다", () => {
      // Arrange
      const value = 11;
      const min = 1;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("경계 케이스", () => {
    it("값이 최솟값과 같을 때 true를 반환한다", () => {
      // Arrange
      const value = 1;
      const min = 1;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(true);
    });

    it("값이 최댓값과 같을 때 true를 반환한다", () => {
      // Arrange
      const value = 10;
      const min = 1;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe("엣지 케이스", () => {
    it("최솟값과 최댓값이 같고 값도 같을 때 true를 반환한다", () => {
      // Arrange
      const value = 5;
      const min = 5;
      const max = 5;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(true);
    });

    it("음수 범위에서 값이 범위 내에 있을 때 true를 반환한다", () => {
      // Arrange
      const value = -3;
      const min = -5;
      const max = -1;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(true);
    });

    it("null 입력에 대해 false를 반환한다", () => {
      // Arrange
      const value = null as unknown as number;
      const min = 0;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(false);
    });

    it("undefined 입력에 대해 false를 반환한다", () => {
      // Arrange
      const value = undefined as unknown as number;
      const min = 0;
      const max = 10;

      // Act
      const result = isInRange(value, min, max);

      // Assert
      expect(result).toBe(false);
    });
  });
});
