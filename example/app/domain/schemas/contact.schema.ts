import { z } from "zod/v4";

export const contactFormSchema = z.object({
	name: z.string().min(1, { error: "이름을 입력해주세요." }),
	email: z.email({ error: "올바른 이메일 주소를 입력해주세요." }),
	company: z.string().min(1, { error: "회사명을 입력해주세요." }),
	phone: z
		.string()
		.regex(/^[\d\-+() ]+$/, { error: "올바른 전화번호 형식을 입력해주세요." })
		.optional(),
	message: z
		.string()
		.min(10, { error: "문의 내용을 10자 이상 입력해주세요." }),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
