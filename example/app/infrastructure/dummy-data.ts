interface HeroData {
	title: string;
	subtitle: string;
	ctaText: string;
	ctaLink: string;
}

interface CoreValue {
	id: string;
	title: string;
	description: string;
	icon: string;
}

interface AboutData {
	title: string;
	description: string;
	coreValues: CoreValue[];
}

interface ServiceItem {
	id: string;
	title: string;
	description: string;
	icon: string;
}

interface ServicesData {
	title: string;
	subtitle: string;
	services: ServiceItem[];
}

export const heroData: HeroData = {
	title: "디지털 혁신을 이끄는 파트너",
	subtitle:
		"TechFlow는 IT 컨설팅 전문 기업입니다. 최신 기술과 풍부한 경험으로 비즈니스의 디지털 전환을 함께합니다.",
	ctaText: "문의하기",
	ctaLink: "#contact",
};

export const aboutData: AboutData = {
	title: "About Us",
	description:
		"TechFlow의 비전은 기술을 통해 모든 기업이 디지털 시대에서 성공할 수 있도록 돕는 것입니다. 우리의 미션은 혁신적인 IT 컨설팅 서비스를 통해 고객의 비즈니스 가치를 극대화하는 것입니다.",
	coreValues: [
		{
			id: "innovation",
			title: "혁신",
			description:
				"최신 기술 트렌드를 선도하며 끊임없이 새로운 솔루션을 제시합니다.",
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
	],
};

export const servicesData: ServicesData = {
	title: "Our Services",
	subtitle:
		"TechFlow는 다양한 IT 컨설팅 서비스를 통해 비즈니스의 성공을 지원합니다.",
	services: [
		{
			id: "digital-transformation",
			title: "디지털 트랜스포메이션",
			description:
				"기존 비즈니스 프로세스를 디지털화하고 혁신적인 기술로 비즈니스 모델을 재설계합니다.",
			icon: "🚀",
		},
		{
			id: "cloud-solutions",
			title: "클라우드 솔루션",
			description:
				"클라우드 인프라 설계, 마이그레이션, 최적화를 통해 비용 절감과 확장성을 실현합니다.",
			icon: "☁️",
		},
		{
			id: "data-analytics",
			title: "데이터 분석",
			description:
				"빅데이터와 AI 기반 분석으로 데이터 주도 의사결정을 지원합니다.",
			icon: "📊",
		},
		{
			id: "security",
			title: "보안 컨설팅",
			description:
				"사이버 보안 위협으로부터 비즈니스를 보호하고 컴플라이언스를 확보합니다.",
			icon: "🔒",
		},
	],
};
