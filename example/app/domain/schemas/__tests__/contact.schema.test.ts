import { contactFormSchema } from "../contact.schema";

describe("contactFormSchema", () => {
	const validInput = {
		name: "홍길동",
		email: "hong@example.com",
		company: "TechFlow",
		message: "서비스에 대해 문의드립니다.",
	};

	it("should pass with valid required fields", () => {
		const result = contactFormSchema.safeParse(validInput);
		expect(result.success).toBe(true);
	});

	it("should pass with optional phone field", () => {
		const result = contactFormSchema.safeParse({
			...validInput,
			phone: "010-1234-5678",
		});
		expect(result.success).toBe(true);
	});

	it("should fail when name is empty", () => {
		const result = contactFormSchema.safeParse({
			...validInput,
			name: "",
		});
		expect(result.success).toBe(false);
	});

	it("should fail with invalid email format", () => {
		const result = contactFormSchema.safeParse({
			...validInput,
			email: "not-an-email",
		});
		expect(result.success).toBe(false);
	});

	it("should fail when company is empty", () => {
		const result = contactFormSchema.safeParse({
			...validInput,
			company: "",
		});
		expect(result.success).toBe(false);
	});

	it("should fail when message is less than 10 characters", () => {
		const result = contactFormSchema.safeParse({
			...validInput,
			message: "짧은글",
		});
		expect(result.success).toBe(false);
	});

	it("should fail with invalid phone format", () => {
		const result = contactFormSchema.safeParse({
			...validInput,
			phone: "abc-invalid",
		});
		expect(result.success).toBe(false);
	});

	it("should fail when required fields are missing", () => {
		const result = contactFormSchema.safeParse({});
		expect(result.success).toBe(false);
	});
});
