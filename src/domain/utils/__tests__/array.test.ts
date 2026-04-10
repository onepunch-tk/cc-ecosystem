import { describe, it, expect } from "vitest";
import { unique, chunk, flatten } from "../array";

// 도메인 레이어 유틸리티 — 순수 함수, 목(mock) 없음

describe("unique", () => {
  describe("정상 케이스", () => {
    it("숫자 배열에서 중복을 제거하고 첫 등장 순서를 유지한다", () => {
      // Arrange
      const input = [1, 2, 2, 3];

      // Act
      const result = unique(input);

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });

    it("문자열 배열에서 중복을 제거하고 첫 등장 순서를 유지한다", () => {
      // Arrange
      const input = ["a", "b", "a"];

      // Act
      const result = unique(input);

      // Assert
      expect(result).toEqual(["a", "b"]);
    });

    it("삽입 순서를 보존한다", () => {
      // Arrange
      const input = [3, 1, 2, 1, 3, 2];

      // Act
      const result = unique(input);

      // Assert
      expect(result).toEqual([3, 1, 2]);
    });
  });

  describe("경계 케이스", () => {
    it("이미 중복이 없는 배열을 그대로 반환한다", () => {
      // Arrange
      const input = [1, 2, 3];

      // Act
      const result = unique(input);

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("엣지 케이스", () => {
    it("빈 배열을 그대로 반환한다", () => {
      // Arrange
      const input: number[] = [];

      // Act
      const result = unique(input);

      // Assert
      expect(result).toEqual([]);
    });

    it("단일 요소 배열을 그대로 반환한다", () => {
      // Arrange
      const input = [42];

      // Act
      const result = unique(input);

      // Assert
      expect(result).toEqual([42]);
    });
  });
});

describe("chunk", () => {
  describe("정상 케이스", () => {
    it("배열을 지정한 크기로 분할하며 마지막 청크는 남은 요소를 포함한다", () => {
      // Arrange
      const input = [1, 2, 3, 4, 5];
      const size = 2;

      // Act
      const result = chunk(input, size);

      // Assert
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("배열 길이가 size로 나누어 떨어지면 모든 청크의 크기가 동일하다", () => {
      // Arrange
      const input = [1, 2, 3, 4];
      const size = 2;

      // Act
      const result = chunk(input, size);

      // Assert
      expect(result).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe("경계 케이스", () => {
    it("size가 배열 길이보다 크면 전체 배열을 하나의 청크로 반환한다", () => {
      // Arrange
      const input = [1, 2, 3];
      const size = 10;

      // Act
      const result = chunk(input, size);

      // Assert
      expect(result).toEqual([[1, 2, 3]]);
    });

    it("size가 배열 길이와 동일하면 전체 배열을 하나의 청크로 반환한다", () => {
      // Arrange
      const input = [1, 2, 3];
      const size = 3;

      // Act
      const result = chunk(input, size);

      // Assert
      expect(result).toEqual([[1, 2, 3]]);
    });
  });

  describe("엣지 케이스", () => {
    it("빈 배열을 빈 배열로 반환한다", () => {
      // Arrange
      const input: number[] = [];
      const size = 2;

      // Act
      const result = chunk(input, size);

      // Assert
      expect(result).toEqual([]);
    });

    it("size가 1이면 각 요소를 개별 청크로 반환한다", () => {
      // Arrange
      const input = [1, 2, 3];
      const size = 1;

      // Act
      const result = chunk(input, size);

      // Assert
      expect(result).toEqual([[1], [2], [3]]);
    });
  });
});

describe("flatten", () => {
  describe("정상 케이스", () => {
    it("2차원 배열을 1차원으로 평탄화한다", () => {
      // Arrange
      const input = [[1, 2], [3, 4]];

      // Act
      const result = flatten(input);

      // Assert
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it("각 중첩 배열이 단일 요소일 때 1차원으로 평탄화한다", () => {
      // Arrange
      const input = [[1], [2], [3]];

      // Act
      const result = flatten(input);

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("경계 케이스", () => {
    it("단일 중첩 배열을 평탄화하면 내부 배열과 동일한 결과를 반환한다", () => {
      // Arrange
      const input = [[1, 2, 3]];

      // Act
      const result = flatten(input);

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe("엣지 케이스", () => {
    it("빈 외부 배열을 빈 배열로 반환한다", () => {
      // Arrange
      const input: number[][] = [];

      // Act
      const result = flatten(input);

      // Assert
      expect(result).toEqual([]);
    });

    it("중첩 배열이 모두 빈 배열이면 빈 배열을 반환한다", () => {
      // Arrange
      const input: number[][] = [[], []];

      // Act
      const result = flatten(input);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
