import { z } from "zod";

export const contactFormSchema = z.object({
	name: z.string().min(2).max(50),
	email: z.string().email(),
	company: z.string().optional(),
	phone: z.string().optional(),
	message: z.string().min(10).max(1000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
