export interface ContactSubmission {
	id: string;
	name: string;
	email: string;
	company?: string;
	phone?: string;
	message: string;
	submittedAt: Date;
}
