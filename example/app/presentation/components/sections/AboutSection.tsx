const coreValues = [
	{
		id: "innovation",
		title: "혁신",
		description: "최신 기술 트렌드를 선도하며 끊임없이 새로운 솔루션을 제시합니다.",
		icon: "💡",
	},
	{
		id: "trust",
		title: "신뢰",
		description:
			"투명한 커뮤니케이션과 검증된 방법론으로 파트너의 신뢰를 쌓습니다.",
		icon: "🤝",
	},
	{
		id: "growth",
		title: "성장",
		description:
			"고객의 비즈니스 성장을 최우선으로 생각하며 함께 발전합니다.",
		icon: "📈",
	},
];

export default function AboutSection() {
	return (
		<section id="about" className="bg-background px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
			<div className="mx-auto max-w-6xl">
				<h2 className="mb-4 text-center text-2xl font-bold text-on-surface md:mb-6 md:text-3xl lg:text-4xl">
					About Us
				</h2>
				<p className="mx-auto mb-10 max-w-3xl text-center text-base leading-relaxed text-on-surface-muted md:mb-12 md:text-lg">
					TechFlow의 비전은 기술을 통해 모든 기업이 디지털 시대에서 성공할 수
					있도록 돕는 것입니다. 우리의 미션은 혁신적인 IT 컨설팅 서비스를 통해
					고객의 비즈니스 가치를 극대화하는 것입니다.
				</p>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
					{coreValues.map((value) => (
						<div
							key={value.id}
							className="rounded-xl bg-surface p-6 text-center shadow-card motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-card-hover md:p-8"
						>
							<span className="mb-4 block text-4xl" role="img" aria-hidden="true">
								{value.icon}
							</span>
							<h3 className="mb-2 text-lg font-semibold text-on-surface md:text-xl">
								{value.title}
							</h3>
							<p className="text-sm leading-relaxed text-on-surface-muted md:text-base">
								{value.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
