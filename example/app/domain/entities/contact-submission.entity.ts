export type ContactSubmission = {
	name: string;
	email: string;
	company: string;
	phone?: string;
	message: string;
	submittedAt: Date;
};
