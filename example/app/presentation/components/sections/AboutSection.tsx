const coreValues = [
	{
		title: "혁신",
		description: "최신 기술 트렌드를 선도하며 끊임없이 새로운 솔루션을 제시합니다.",
		icon: "💡",
	},
	{
		title: "신뢰",
		description:
			"투명한 커뮤니케이션과 검증된 방법론으로 파트너의 신뢰를 쌓습니다.",
		icon: "🤝",
	},
	{
		title: "성장",
		description:
			"고객의 비즈니스 성장을 최우선으로 생각하며 함께 발전합니다.",
		icon: "📈",
	},
];

export default function AboutSection() {
	return (
		<section id="about" className="bg-white px-4 py-20">
			<div className="mx-auto max-w-6xl">
				<h2 className="mb-6 text-center text-3xl font-bold text-slate-900 md:text-4xl">
					About Us
				</h2>
				<p className="mx-auto mb-12 max-w-3xl text-center text-lg text-slate-600">
					TechFlow의 비전은 기술을 통해 모든 기업이 디지털 시대에서 성공할 수
					있도록 돕는 것입니다. 우리의 미션은 혁신적인 IT 컨설팅 서비스를 통해
					고객의 비즈니스 가치를 극대화하는 것입니다.
				</p>
				<div className="grid grid-cols-1 gap-8 md:grid-cols-3">
					{coreValues.map((value) => (
						<div
							key={value.title}
							className="rounded-xl bg-slate-50 p-6 text-center shadow-sm"
						>
							<span className="mb-4 block text-4xl">{value.icon}</span>
							<h3 className="mb-2 text-xl font-semibold text-slate-900">
								{value.title}
							</h3>
							<p className="text-slate-600">{value.description}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
