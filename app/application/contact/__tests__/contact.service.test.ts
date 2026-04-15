import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ContactRepositoryPort } from "~/application/contact/contact.port";
import { ContactService } from "~/application/contact/contact.service";

// --- 테스트 픽스처 ---

const validInput: Record<string, unknown> = {
  name: "홍길동",
  email: "hong@example.com",
  company: "테스트 회사",
  phone: "010-1234-5678",
  message: "테스트 메시지입니다. 충분한 길이의 메시지.",
};

describe("ContactService", () => {
  let mockRepository: { save: ReturnType<typeof vi.fn> };
  let service: ContactService;

  beforeEach(() => {
    // Arrange: 매 테스트마다 새 모의 저장소와 서비스 인스턴스 생성
    mockRepository = {
      save: vi.fn().mockResolvedValue(undefined),
    };
    service = new ContactService(mockRepository as unknown as ContactRepositoryPort);
  });

  describe("유효한 입력", () => {
    it("유효한 폼 데이터 제출 시 repository.save를 1회 호출하고 성공 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true, data: undefined });
    });

    it("선택 필드(company, phone)가 없어도 성공 응답을 반환한다", async () => {
      // Arrange
      const input: Record<string, unknown> = {
        name: "김철수",
        email: "kim@example.com",
        message: "선택 필드 없이 보내는 메시지입니다.",
      };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ success: true, data: undefined });
    });
  });

  describe("유효하지 않은 입력 - 필드별 검증", () => {
    it("name이 없으면 fieldErrors.name을 포함한 오류 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput, name: undefined };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("name");
        expect(result.fieldErrors?.name).toBeInstanceOf(Array);
        expect(result.fieldErrors?.name?.length).toBeGreaterThan(0);
      }
    });

    it("name이 최소 길이(2자) 미만이면 fieldErrors.name을 포함한 오류 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput, name: "홍" };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("name");
      }
    });

    it("email 형식이 잘못되면 fieldErrors.email을 포함한 오류 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput, email: "invalid-email" };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("email");
        expect(result.fieldErrors?.email).toBeInstanceOf(Array);
        expect(result.fieldErrors?.email?.length).toBeGreaterThan(0);
      }
    });

    it("email이 없으면 fieldErrors.email을 포함한 오류 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput, email: undefined };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("email");
      }
    });

    it("message가 최소 길이(10자) 미만이면 fieldErrors.message를 포함한 오류 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput, message: "짧음" };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("message");
        expect(result.fieldErrors?.message).toBeInstanceOf(Array);
        expect(result.fieldErrors?.message?.length).toBeGreaterThan(0);
      }
    });

    it("message가 없으면 fieldErrors.message를 포함한 오류 응답을 반환한다", async () => {
      // Arrange
      const input = { ...validInput, message: undefined };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("message");
      }
    });

    it("여러 필드가 동시에 유효하지 않으면 각 필드별 오류를 포함한 응답을 반환한다", async () => {
      // Arrange
      const input: Record<string, unknown> = {
        name: "홍", // 너무 짧음
        email: "not-email", // 잘못된 형식
        message: "짧음", // 너무 짧음
      };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).not.toHaveBeenCalled();
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toHaveProperty("name");
        expect(result.fieldErrors).toHaveProperty("email");
        expect(result.fieldErrors).toHaveProperty("message");
      }
    });
  });

  describe("저장소 오류 처리", () => {
    it("repository.save()가 예외를 던지면 성공 false 응답을 반환한다", async () => {
      // Arrange
      mockRepository.save.mockRejectedValue(new Error("Database connection failed"));
      const input = { ...validInput };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(typeof result.error).toBe("string");
        expect(result.error.length).toBeGreaterThan(0);
      }
    });

    it("repository.save()가 예외를 던지면 fieldErrors 없이 error 메시지만 포함한다", async () => {
      // Arrange
      mockRepository.save.mockRejectedValue(new Error("Unexpected error"));
      const input = { ...validInput };

      // Act
      const result = await service.submitContact(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.fieldErrors).toBeUndefined();
      }
    });
  });

  describe("저장된 엔티티 구조 검증", () => {
    it("repository.save에 올바른 ContactSubmission 구조가 전달된다", async () => {
      // Arrange
      const input = { ...validInput };

      // Act
      await service.submitContact(input);

      // Assert
      const savedEntity = mockRepository.save.mock.calls[0][0];
      expect(typeof savedEntity.id).toBe("string");
      expect(savedEntity.id.length).toBeGreaterThan(0);
      expect(savedEntity.name).toBe(validInput.name);
      expect(savedEntity.email).toBe(validInput.email);
      expect(savedEntity.message).toBe(validInput.message);
      expect(savedEntity.submittedAt).toBeInstanceOf(Date);
    });
  });
});
