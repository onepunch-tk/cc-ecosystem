import type { ContactSubmission } from "~/domain/contact/contact-submission.entity";

export interface ContactRepositoryPort {
	save(submission: ContactSubmission): Promise<void>;
}
