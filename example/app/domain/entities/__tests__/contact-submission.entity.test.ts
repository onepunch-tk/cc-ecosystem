import type { ContactSubmission } from "../contact-submission.entity";

describe("ContactSubmission", () => {
	it("should define all required fields", () => {
		const submission: ContactSubmission = {
			name: "홍길동",
			email: "hong@example.com",
			company: "TechFlow",
			message: "서비스 문의드립니다.",
			submittedAt: new Date("2026-04-15T10:00:00Z"),
		};

		expect(submission.name).toBe("홍길동");
		expect(submission.email).toBe("hong@example.com");
		expect(submission.company).toBe("TechFlow");
		expect(submission.message).toBe("서비스 문의드립니다.");
		expect(submission.submittedAt).toBeInstanceOf(Date);
	});

	it("should allow optional phone field", () => {
		const withPhone: ContactSubmission = {
			name: "홍길동",
			email: "hong@example.com",
			company: "TechFlow",
			phone: "010-1234-5678",
			message: "서비스 문의드립니다.",
			submittedAt: new Date(),
		};

		const withoutPhone: ContactSubmission = {
			name: "홍길동",
			email: "hong@example.com",
			company: "TechFlow",
			message: "서비스 문의드립니다.",
			submittedAt: new Date(),
		};

		expect(withPhone.phone).toBe("010-1234-5678");
		expect(withoutPhone.phone).toBeUndefined();
	});
});
