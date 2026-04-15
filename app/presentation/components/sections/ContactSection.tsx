import { Button, Input, Textarea } from "~/presentation/components/common";

const contactInfo = [
	{
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
		),
		label: "Phone",
		value: "02-1234-5678",
	},
	{
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
		),
		label: "Email",
		value: "contact@techflow.co.kr",
	},
	{
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
		),
		label: "Address",
		value: "서울특별시 강남구 테헤란로 123",
	},
	{
		icon: (
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
		),
		label: "Business hours",
		value: "월-금 09:00 - 18:00",
	},
];

export default function ContactSection() {
	return (
		<section id="contact" className="bg-white py-16 md:py-24 px-6">
			<div className="max-w-7xl mx-auto">
				{/* Section header */}
				<div className="text-center mb-12 md:mb-20">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-on-surface mb-6 tracking-tight">
						Contact Us
					</h2>
					<p className="text-on-surface-muted text-lg max-w-2xl mx-auto">
						프로젝트에 대해 상담받으세요. 전문 컨설턴트가 답변드립니다.
					</p>
				</div>

				{/* Two-column layout */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
					{/* Left column: Contact info */}
					<div className="space-y-8 lg:space-y-12">
						<div className="relative overflow-hidden rounded-xl bg-surface p-8 border border-border">
							<h3 className="text-2xl font-bold mb-8 text-on-surface">연락처 정보</h3>
							<div className="space-y-8">
								{contactInfo.map((info) => (
									<div key={info.label} className="flex items-start gap-4">
										<div className="bg-primary/10 text-primary p-3 rounded-lg flex-shrink-0">
											{info.icon}
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
						<div className="rounded-xl overflow-hidden h-64 bg-surface border border-border flex items-center justify-center" aria-hidden="true">
							<div className="text-center space-y-2">
								<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-on-surface-muted mx-auto"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
								<p className="text-on-surface-muted text-sm">Seoul, South Korea</p>
							</div>
						</div>
					</div>

					{/* Right column: Contact form */}
					<div className="bg-white p-2 md:p-8">
						<form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<Input
									label="이름"
									placeholder="성함을 입력해주세요"
									required
								/>
								<Input
									label="이메일"
									type="email"
									placeholder="example@techflow.co.kr"
									required
								/>
							</div>
							<Textarea
								label="문의 내용"
								placeholder="프로젝트에 대한 상세한 내용을 남겨주세요."
								rows={6}
								required
							/>
							<div className="space-y-4">
								<Button
									type="submit"
									variant="solid"
									size="lg"
									className="w-full"
								>
									문의하기
								</Button>
								<p className="text-center text-sm text-on-surface-muted flex items-center justify-center gap-2">
									<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
									영업일 기준 24시간 이내 답변드립니다
								</p>
							</div>
						</form>
					</div>
				</div>
			</div>
		</section>
	);
}
