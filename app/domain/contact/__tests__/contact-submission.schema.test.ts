import { contactFormSchema } from "~/domain/contact/contact-submission.schema";

describe("contactFormSchema", () => {
	describe("유효한 입력", () => {
		it("모든 필드가 포함된 유효한 입력은 파싱에 성공해야 한다", () => {
			// Arrange
			const validInput = {
				name: "홍길동",
				email: "hong@example.com",
				company: "ACME Corp",
				phone: "010-1234-5678",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(validInput);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data).toEqual(validInput);
			}
		});

		it("선택 필드(company, phone) 없이 필수 필드만으로 파싱에 성공해야 한다", () => {
			// Arrange
			const requiredOnly = {
				name: "홍길동",
				email: "hong@example.com",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(requiredOnly);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.name).toBe(requiredOnly.name);
				expect(result.data.email).toBe(requiredOnly.email);
				expect(result.data.message).toBe(requiredOnly.message);
			}
		});
	});

	describe("name 필드 유효성 검사", () => {
		it("name이 없으면 파싱에 실패해야 한다", () => {
			// Arrange
			const missingName = {
				email: "hong@example.com",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(missingName);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const paths = result.error.issues.map((issue) => issue.path[0]);
				expect(paths).toContain("name");
			}
		});

		it("name이 1자(최소 길이 미만)이면 파싱에 실패해야 한다", () => {
			// Arrange
			const shortName = {
				name: "홍",
				email: "hong@example.com",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(shortName);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const nameIssue = result.error.issues.find(
					(issue) => issue.path[0] === "name",
				);
				expect(nameIssue).toBeDefined();
			}
		});

		it("name이 51자(최대 길이 초과)이면 파싱에 실패해야 한다", () => {
			// Arrange
			const longName = {
				name: "a".repeat(51),
				email: "hong@example.com",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(longName);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const nameIssue = result.error.issues.find(
					(issue) => issue.path[0] === "name",
				);
				expect(nameIssue).toBeDefined();
			}
		});
	});

	describe("email 필드 유효성 검사", () => {
		it("유효하지 않은 이메일 형식이면 파싱에 실패해야 한다", () => {
			// Arrange
			const invalidEmail = {
				name: "홍길동",
				email: "not-an-email",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(invalidEmail);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const emailIssue = result.error.issues.find(
					(issue) => issue.path[0] === "email",
				);
				expect(emailIssue).toBeDefined();
			}
		});

		it("email이 없으면 파싱에 실패해야 한다", () => {
			// Arrange
			const missingEmail = {
				name: "홍길동",
				message: "문의 내용입니다. 자세한 답변 부탁드립니다.",
			};

			// Act
			const result = contactFormSchema.safeParse(missingEmail);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const paths = result.error.issues.map((issue) => issue.path[0]);
				expect(paths).toContain("email");
			}
		});
	});

	describe("message 필드 유효성 검사", () => {
		it("message가 없으면 파싱에 실패해야 한다", () => {
			// Arrange
			const missingMessage = {
				name: "홍길동",
				email: "hong@example.com",
			};

			// Act
			const result = contactFormSchema.safeParse(missingMessage);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const paths = result.error.issues.map((issue) => issue.path[0]);
				expect(paths).toContain("message");
			}
		});

		it("message가 9자(최소 길이 미만)이면 파싱에 실패해야 한다", () => {
			// Arrange
			const shortMessage = {
				name: "홍길동",
				email: "hong@example.com",
				message: "123456789", // 9자
			};

			// Act
			const result = contactFormSchema.safeParse(shortMessage);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const messageIssue = result.error.issues.find(
					(issue) => issue.path[0] === "message",
				);
				expect(messageIssue).toBeDefined();
			}
		});

		it("message가 1001자(최대 길이 초과)이면 파싱에 실패해야 한다", () => {
			// Arrange
			const longMessage = {
				name: "홍길동",
				email: "hong@example.com",
				message: "a".repeat(1001),
			};

			// Act
			const result = contactFormSchema.safeParse(longMessage);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const messageIssue = result.error.issues.find(
					(issue) => issue.path[0] === "message",
				);
				expect(messageIssue).toBeDefined();
			}
		});
	});
});
