import type { ContactRepositoryPort } from "~/application/contact/contact.port";
import type { ContactSubmission } from "~/domain/contact/contact-submission.entity";
import { contactFormSchema } from "~/domain/contact/contact-submission.schema";
import type { ActionResponse } from "~/domain/contact/types";

export class ContactService {
	constructor(private readonly repository: ContactRepositoryPort) {}

	async submitContact(
		input: Record<string, unknown>,
	): Promise<ActionResponse<void>> {
		const result = contactFormSchema.safeParse(input);

		if (!result.success) {
			const fieldErrors: Record<string, string[]> = {};
			for (const issue of result.error.issues) {
				const field = String(issue.path[0]);
				if (!fieldErrors[field]) {
					fieldErrors[field] = [];
				}
				fieldErrors[field].push(issue.message);
			}
			return {
				success: false,
				error: "입력값을 확인해주세요.",
				fieldErrors,
			};
		}

		const submission: ContactSubmission = {
			id: crypto.randomUUID(),
			...result.data,
			submittedAt: new Date(),
		};

		try {
			await this.repository.save(submission);
			return { success: true, data: undefined };
		} catch {
			return {
				success: false,
				error: "문의 접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
			};
		}
	}
}
