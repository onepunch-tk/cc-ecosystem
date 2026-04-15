import { Form, useActionData, useNavigation } from "react-router";
import type { ActionResponse } from "~/domain/contact/types";
import { Button, Input, Textarea } from "~/presentation/components/common";

const contactInfo = [
	{ icon: "call", label: "Phone", value: "02-1234-5678" },
	{ icon: "mail", label: "Email", value: "contact@techflow.co.kr" },
	{ icon: "location_on", label: "Address", value: "서울특별시 강남구 테헤란로 123" },
	{ icon: "schedule", label: "Business hours", value: "월-금 09:00 - 18:00" },
];

export default function ContactSection() {
	const actionData = useActionData<ActionResponse>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";

	return (
		<section id="contact" className="bg-background py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-8 lg:px-12">
			<div className="max-w-7xl mx-auto">
				{/* Section header */}
				<div className="text-center mb-12 md:mb-20">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-on-surface mb-6 tracking-tight">
						Contact Us
					</h2>
					<p className="text-on-surface-muted text-lg max-w-2xl mx-auto leading-relaxed">
						프로젝트에 대해 상담받으세요. 전문 컨설턴트가 답변드립니다.
					</p>
				</div>

				{/* Two-column layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
					{/* Left column: Contact info */}
					<div className="space-y-8 lg:space-y-12">
						<div className="relative overflow-hidden rounded-xl bg-surface p-8 border border-border/20">
							<h3 className="text-2xl font-bold mb-8 text-on-surface">연락처 정보</h3>
							<div className="space-y-8">
								{contactInfo.map((info) => (
									<div key={info.label} className="flex items-start gap-4">
										<div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
											<span className="material-symbols-outlined" aria-hidden="true">{info.icon}</span>
										</div>
										<div>
											<p className="text-sm font-semibold text-on-surface-muted uppercase tracking-wider mb-1">
												{info.label}
											</p>
											<p className="text-lg font-medium text-on-surface">
												{info.value}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Map placeholder */}
						<div className="rounded-xl overflow-hidden h-64 bg-surface border border-border/20 shadow-card hover:shadow-card-hover transition-all duration-500 flex items-center justify-center" aria-hidden="true">
							<div className="text-center space-y-2">
								<span className="material-symbols-outlined text-on-surface-muted text-[32px]">location_on</span>
								<p className="text-on-surface-muted text-sm">Seoul, South Korea</p>
							</div>
						</div>
					</div>

					{/* Right column: Contact form */}
					<div className="bg-background p-2 md:p-8">
						{actionData?.success ? (
							<div className="text-center py-16 space-y-6 animate-in">
								{/* Success icon with subtle background circle */}
								<div className="mx-auto w-20 h-20 rounded-full bg-success/10 flex items-center justify-center">
									<span className="material-symbols-outlined text-success text-[40px]" aria-hidden="true">check_circle</span>
								</div>
								<h3 className="text-2xl font-bold text-on-surface">문의가 접수되었습니다</h3>
								<p className="text-on-surface-muted leading-relaxed max-w-sm mx-auto">
									영업일 기준 24시간 이내 답변드립니다.
								</p>
							</div>
						) : (
							<Form method="post" className="space-y-6">
								{/* General error banner */}
								{actionData && !actionData.success && !actionData.fieldErrors && (
									<div
										className="flex items-start gap-3 p-4 rounded-lg bg-error/5 border border-error/20"
										role="alert"
									>
										<span className="material-symbols-outlined text-error text-xl flex-shrink-0 mt-0.5" aria-hidden="true">
											error
										</span>
										<p className="text-error text-sm leading-relaxed">{actionData.error}</p>
									</div>
								)}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<Input
										label="이름"
										name="name"
										placeholder="성함을 입력해주세요"
										required
										disabled={isSubmitting}
										error={actionData && !actionData.success ? actionData.fieldErrors?.name?.[0] : undefined}
									/>
									<Input
										label="이메일"
										name="email"
										type="email"
										placeholder="example@techflow.co.kr"
										required
										disabled={isSubmitting}
										error={actionData && !actionData.success ? actionData.fieldErrors?.email?.[0] : undefined}
									/>
								</div>
								<Textarea
									label="문의 내용"
									name="message"
									placeholder="프로젝트에 대한 상세한 내용을 남겨주세요."
									rows={6}
									required
									disabled={isSubmitting}
									error={actionData && !actionData.success ? actionData.fieldErrors?.message?.[0] : undefined}
								/>
								<div className="space-y-4">
									<Button
										type="submit"
										variant="solid"
										size="lg"
										className="w-full shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all"
										disabled={isSubmitting}
									>
										{isSubmitting ? "제출 중..." : "문의하기"}
									</Button>
									<p className="text-center text-sm text-on-surface-muted flex items-center justify-center gap-2">
										<span className="material-symbols-outlined text-sm" aria-hidden="true">verified_user</span>
										영업일 기준 24시간 이내 답변드립니다
									</p>
								</div>
							</Form>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}
