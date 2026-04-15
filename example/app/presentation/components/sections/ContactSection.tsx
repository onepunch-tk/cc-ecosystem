import { Button, Input, SectionWrapper, Textarea } from "~/presentation/components/common";

export default function ContactSection() {
	return (
		<SectionWrapper id="contact" ariaLabel="Contact" title="Contact">
			<form className="mx-auto max-w-xl space-y-4">
				<Input label="이름" name="name" placeholder="이름" />
				<Input label="이메일" name="email" type="email" placeholder="이메일" />
				<Input label="회사명" name="company" placeholder="회사명" />
				<Textarea label="메시지" name="message" placeholder="메시지" rows={5} />
				<Button type="submit" size="lg" className="w-full">
					문의하기
				</Button>
			</form>
		</SectionWrapper>
	);
}
