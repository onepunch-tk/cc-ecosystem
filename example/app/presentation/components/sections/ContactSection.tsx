import { Button, Input, SectionWrapper, Textarea } from "~/presentation/components/common";

export default function ContactSection() {
	return (
		<SectionWrapper id="contact" ariaLabel="Contact" title="Contact">
			<p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-on-surface-muted md:mb-12">
				프로젝트에 대해 상담받고 싶으시다면 아래 양식을 작성해 주세요.
			</p>
			<form className="mx-auto max-w-xl space-y-5">
				<Input label="이름" name="name" placeholder="이름" />
				<Input label="이메일" name="email" type="email" placeholder="이메일" />
				<Input label="회사명" name="company" placeholder="회사명" />
				<Textarea label="메시지" name="message" placeholder="메시지" rows={5} />
				<div className="pt-2">
					<Button type="submit" size="lg" className="w-full">
						문의하기
					</Button>
				</div>
			</form>
		</SectionWrapper>
	);
}
