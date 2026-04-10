import { describe, it, expect } from "vitest";
import { capitalize, truncate, slugify } from "../string";

// 도메인 레이어 유틸리티 — 순수 함수, 목(mock) 없음

describe("capitalize", () => {
  describe("정상 케이스", () => {
    it("소문자로 시작하는 문자열의 첫 글자를 대문자로 변환한다", () => {
      // Arrange
      const input = "hello world";

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("Hello world");
    });

    it("이미 대문자로 시작하는 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "Hello";

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("Hello");
    });

    it("단일 문자 문자열을 대문자로 변환한다", () => {
      // Arrange
      const input = "a";

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("A");
    });

    it("숫자로 시작하는 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "123abc";

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("123abc");
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "";

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("");
    });

    it("null 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const input = null as unknown as string;

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("");
    });

    it("undefined 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const input = undefined as unknown as string;

      // Act
      const result = capitalize(input);

      // Assert
      expect(result).toBe("");
    });
  });
});

describe("truncate", () => {
  describe("정상 케이스", () => {
    it("maxLength보다 긴 문자열을 '...'을 포함하여 잘라낸다", () => {
      // Arrange
      const input = "Hello, World!";
      const maxLength = 8;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("Hello...");
    });

    it("정확히 maxLength인 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "Hello";
      const maxLength = 5;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("Hello");
    });

    it("'...'을 포함한 결과가 maxLength를 초과하지 않는다", () => {
      // Arrange
      const input = "Hello World";
      const maxLength = 8;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result.length).toBeLessThanOrEqual(maxLength);
      expect(result).toBe("Hello...");
    });
  });

  describe("경계 케이스", () => {
    it("maxLength보다 짧은 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "Hi";
      const maxLength = 10;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("Hi");
    });

    it("maxLength가 3 이하일 때 '...'만 반환한다", () => {
      // Arrange
      const input = "Hello World";
      const maxLength = 3;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("...");
    });

    it("maxLength가 1일 때 '...'만 반환한다", () => {
      // Arrange
      const input = "Hello";
      const maxLength = 1;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("...");
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "";
      const maxLength = 10;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("");
    });

    it("null 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const input = null as unknown as string;
      const maxLength = 10;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("");
    });

    it("undefined 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const input = undefined as unknown as string;
      const maxLength = 10;

      // Act
      const result = truncate(input, maxLength);

      // Assert
      expect(result).toBe("");
    });
  });
});

describe("slugify", () => {
  describe("정상 케이스", () => {
    it("공백을 하이픈으로 변환하고 소문자로 만든다", () => {
      // Arrange
      const input = "Hello World";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("hello-world");
    });

    it("대문자를 소문자로 변환한다", () => {
      // Arrange
      const input = "HELLO WORLD";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("hello-world");
    });

    it("특수 문자를 제거한다", () => {
      // Arrange
      const input = "Hello, World! How are you?";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("hello-world-how-are-you");
    });

    it("여러 공백을 단일 하이픈으로 변환한다", () => {
      // Arrange
      const input = "Hello   World";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("hello-world");
    });

    it("앞뒤 공백을 제거한다", () => {
      // Arrange
      const input = "  Hello World  ";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("hello-world");
    });

    it("이미 슬러그 형식인 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "hello-world";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("hello-world");
    });

    it("숫자를 포함하는 문자열을 올바르게 변환한다", () => {
      // Arrange
      const input = "Post 123 Title";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("post-123-title");
    });
  });

  describe("엣지 케이스", () => {
    it("빈 문자열을 그대로 반환한다", () => {
      // Arrange
      const input = "";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("");
    });

    it("null 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const input = null as unknown as string;

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("");
    });

    it("undefined 입력에 대해 빈 문자열을 반환한다", () => {
      // Arrange
      const input = undefined as unknown as string;

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("");
    });

    it("특수 문자만 있는 문자열은 빈 문자열을 반환한다", () => {
      // Arrange
      const input = "!@#$%^&*()";

      // Act
      const result = slugify(input);

      // Assert
      expect(result).toBe("");
    });
  });
});
