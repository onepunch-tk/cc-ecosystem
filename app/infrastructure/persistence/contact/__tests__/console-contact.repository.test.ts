import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ContactSubmission } from "~/domain/contact/contact-submission.entity";
import { ConsoleContactRepository } from "../console-contact.repository";

describe("ConsoleContactRepository", () => {
	let repository: ConsoleContactRepository;

	beforeEach(() => {
		vi.clearAllMocks();
		repository = new ConsoleContactRepository();
	});

	describe("save()", () => {
		it("제출 데이터의 ID를 console.log로 출력해야 한다", async () => {
			// Arrange
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			const submission: ContactSubmission = {
				id: "test-id-001",
				name: "홍길동",
				email: "hong@example.com",
				message: "문의 내용입니다.",
				submittedAt: new Date("2026-04-15T00:00:00.000Z"),
			};

			// Act
			await repository.save(submission);

			// Assert
			expect(consoleSpy).toHaveBeenCalledOnce();
			expect(consoleSpy).toHaveBeenCalledWith("[ContactRepository] Saved:", "test-id-001");
		});

		it("선택 필드(company, phone)가 포함된 제출 데이터의 ID를 console.log로 출력해야 한다", async () => {
			// Arrange
			const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
			const submission: ContactSubmission = {
				id: "test-id-002",
				name: "이순신",
				email: "lee@example.com",
				company: "ACME Corp",
				phone: "010-1234-5678",
				message: "선택 필드 포함 문의 내용입니다.",
				submittedAt: new Date("2026-04-15T00:00:00.000Z"),
			};

			// Act
			await repository.save(submission);

			// Assert
			expect(consoleSpy).toHaveBeenCalledOnce();
			expect(consoleSpy).toHaveBeenCalledWith("[ContactRepository] Saved:", "test-id-002");
		});

		it("Promise<void>를 반환해야 한다", async () => {
			// Arrange
			vi.spyOn(console, "log").mockImplementation(() => {});
			const submission: ContactSubmission = {
				id: "test-id-003",
				name: "홍길동",
				email: "hong@example.com",
				message: "문의 내용입니다.",
				submittedAt: new Date("2026-04-15T00:00:00.000Z"),
			};

			// Act
			const result = repository.save(submission);

			// Assert
			expect(result).toBeInstanceOf(Promise);
			const resolved = await result;
			expect(resolved).toBeUndefined();
		});
	});
});
