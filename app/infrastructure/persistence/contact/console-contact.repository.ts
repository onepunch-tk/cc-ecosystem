import type { ContactRepositoryPort } from "~/application/contact/contact.port";
import type { ContactSubmission } from "~/domain/contact/contact-submission.entity";

export class ConsoleContactRepository implements ContactRepositoryPort {
	async save(submission: ContactSubmission): Promise<void> {
		console.log(submission);
	}
}
