import { describe, it, expect } from "vitest";
import { formatDate, isValidDate, daysBetween } from "../date";

// 도메인 레이어 유틸리티 — 순수 함수, 목(mock) 없음

describe("formatDate", () => {
  describe("정상 케이스", () => {
    it('"YYYY-MM-DD" 형식으로 날짜를 포맷한다', () => {
      // Arrange
      const date = new Date(2024, 0, 15); // 2024-01-15

      // Act
      const result = formatDate(date, "YYYY-MM-DD");

      // Assert
      expect(result).toBe("2024-01-15");
    });

    it('"YYYY/MM/DD" 형식으로 날짜를 포맷한다', () => {
      // Arrange
      const date = new Date(2024, 0, 15); // 2024-01-15

      // Act
      const result = formatDate(date, "YYYY/MM/DD");

      // Assert
      expect(result).toBe("2024/01/15");
    });

    it('"DD-MM-YYYY" 형식으로 날짜를 포맷한다', () => {
      // Arrange
      const date = new Date(2024, 0, 15); // 2024-01-15

      // Act
      const result = formatDate(date, "DD-MM-YYYY");

      // Assert
      expect(result).toBe("15-01-2024");
    });

    it('"MM/DD/YYYY" 형식으로 날짜를 포맷한다', () => {
      // Arrange
      const date = new Date(2024, 0, 15); // 2024-01-15

      // Act
      const result = formatDate(date, "MM/DD/YYYY");

      // Assert
      expect(result).toBe("01/15/2024");
    });
  });

  describe("경계 케이스", () => {
    it("한 자리 월과 일을 두 자리로 패딩한다", () => {
      // Arrange
      const date = new Date(2024, 2, 5); // 2024-03-05

      // Act
      const result = formatDate(date, "YYYY-MM-DD");

      // Assert
      expect(result).toBe("2024-03-05");
    });

    it('월이 한 자리일 때 "MM/DD/YYYY" 형식에서 두 자리로 패딩한다', () => {
      // Arrange
      const date = new Date(2024, 8, 7); // 2024-09-07

      // Act
      const result = formatDate(date, "MM/DD/YYYY");

      // Assert
      expect(result).toBe("09/07/2024");
    });
  });

  describe("엣지 케이스", () => {
    it("Invalid Date 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const date = new Date("invalid");

      // Act
      const result = formatDate(date, "YYYY-MM-DD");

      // Assert
      expect(result).toBe("");
    });

    it("null 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const date = null as unknown as Date;

      // Act
      const result = formatDate(date, "YYYY-MM-DD");

      // Assert
      expect(result).toBe("");
    });

    it("undefined 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const date = undefined as unknown as Date;

      // Act
      const result = formatDate(date, "YYYY-MM-DD");

      // Assert
      expect(result).toBe("");
    });
  });
});

describe("isValidDate", () => {
  describe("정상 케이스", () => {
    it("현재 날짜(new Date())에 대해 true를 반환한다", () => {
      // Arrange
      const value = new Date();

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(true);
    });

    it("유효한 날짜 문자열로 생성한 Date 객체에 대해 true를 반환한다", () => {
      // Arrange
      const value = new Date("2024-01-01");

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(true);
    });

    it("날짜 형식의 문자열에 대해 false를 반환한다 (Date 객체가 아님)", () => {
      // Arrange
      const value = "2024-01-01";

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(false);
    });

    it("숫자에 대해 false를 반환한다", () => {
      // Arrange
      const value = 12345;

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(false);
    });

    it("null에 대해 false를 반환한다", () => {
      // Arrange
      const value = null;

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(false);
    });

    it("undefined에 대해 false를 반환한다", () => {
      // Arrange
      const value = undefined;

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe("엣지 케이스", () => {
    it("Invalid Date 객체에 대해 false를 반환한다", () => {
      // Arrange
      const value = new Date("invalid");

      // Act
      const result = isValidDate(value);

      // Assert
      expect(result).toBe(false);
    });
  });
});

describe("daysBetween", () => {
  describe("정상 케이스", () => {
    it("동일한 날짜 사이의 일수는 0이다", () => {
      // Arrange
      const from = new Date(2024, 0, 15);
      const to = new Date(2024, 0, 15);

      // Act
      const result = daysBetween(from, to);

      // Assert
      expect(result).toBe(0);
    });

    it("하루 차이가 나는 두 날짜 사이의 일수는 1이다", () => {
      // Arrange
      const from = new Date(2024, 0, 15);
      const to = new Date(2024, 0, 16);

      // Act
      const result = daysBetween(from, to);

      // Assert
      expect(result).toBe(1);
    });

    it("30일 차이가 나는 두 날짜 사이의 일수는 30이다", () => {
      // Arrange
      const from = new Date(2024, 0, 1);
      const to = new Date(2024, 0, 31);

      // Act
      const result = daysBetween(from, to);

      // Assert
      expect(result).toBe(30);
    });
  });

  describe("경계 케이스", () => {
    it("from이 to보다 늦어도 절대값으로 일수를 반환한다", () => {
      // Arrange
      const from = new Date(2024, 0, 16);
      const to = new Date(2024, 0, 15);

      // Act
      const result = daysBetween(from, to);

      // Assert
      expect(result).toBe(1);
    });

    it("월 경계를 넘는 두 날짜 사이의 일수를 올바르게 계산한다", () => {
      // Arrange
      const from = new Date(2024, 0, 28); // 2024-01-28
      const to = new Date(2024, 1, 4);   // 2024-02-04

      // Act
      const result = daysBetween(from, to);

      // Assert
      expect(result).toBe(7);
    });
  });

  describe("엣지 케이스", () => {
    it("동일한 순간(같은 Date 인스턴스)의 일수는 0이다", () => {
      // Arrange
      const moment = new Date(2024, 5, 15, 12, 30, 0);
      const from = moment;
      const to = moment;

      // Act
      const result = daysBetween(from, to);

      // Assert
      expect(result).toBe(0);
    });
  });
});
