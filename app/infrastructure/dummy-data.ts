export interface HeroData {
	headline: string;
	subHeadline: string;
	ctaText: string;
	ctaTargetId: string;
}

export interface AboutData {
	tagline: string;
	heading: string;
	vision: string;
	mission: string;
	coreValues: Array<{
		icon: string;
		title: string;
		description: string;
	}>;
}

export interface ServiceItem {
	icon: string;
	title: string;
	description: string;
}

export interface ServicesData {
	tagline: string;
	heading: string;
	description: string;
	services: ServiceItem[];
}

export interface NavItem {
	label: string;
	targetId: string;
}

export interface FooterLink {
	label: string;
	href: string;
}

export const getHeroData = (): HeroData => ({
	headline: "비즈니스의 디지털 전환, TechFlow와 함께",
	subHeadline:
		"IT 컨설팅 전문 기업 TechFlow는 기업의 디지털 혁신을 위한 최적의 솔루션을 제공합니다.",
	ctaText: "문의하기",
	ctaTargetId: "contact",
});

export const getAboutData = (): AboutData => ({
	tagline: "About Us",
	heading: "TechFlow를 소개합니다",
	vision: "기술로 비즈니스의 미래를 설계합니다.",
	mission:
		"고객의 비즈니스 성장을 위한 맞춤형 IT 솔루션을 제공하며, 디지털 전환의 모든 과정을 함께합니다.",
	coreValues: [
		{
			icon: "💡",
			title: "혁신",
			description: "끊임없는 기술 혁신으로 최적의 솔루션을 제공합니다.",
		},
		{
			icon: "🤝",
			title: "신뢰",
			description:
				"투명한 커뮤니케이션과 책임감 있는 서비스로 신뢰를 구축합니다.",
		},
		{
			icon: "🎯",
			title: "전문성",
			description: "각 분야 최고의 전문가들이 프로젝트를 이끕니다.",
		},
	],
});

export const getServicesData = (): ServicesData => ({
	tagline: "Services",
	heading: "전문 서비스",
	description:
		"TechFlow는 기업의 다양한 IT 니즈에 맞는 전문 서비스를 제공합니다.",
	services: [
		{
			icon: "🔧",
			title: "IT 컨설팅",
			description:
				"기업 환경에 최적화된 IT 전략 수립 및 실행 계획을 제공합니다.",
		},
		{
			icon: "☁️",
			title: "클라우드 솔루션",
			description:
				"AWS, Azure, GCP 기반 클라우드 마이그레이션 및 운영을 지원합니다.",
		},
		{
			icon: "🛡️",
			title: "보안 솔루션",
			description:
				"기업 데이터와 시스템을 보호하는 통합 보안 솔루션을 구축합니다.",
		},
		{
			icon: "📊",
			title: "데이터 분석",
			description:
				"빅데이터 분석과 AI 기반 인사이트로 비즈니스 의사결정을 지원합니다.",
		},
	],
});

export const getNavItems = (): NavItem[] => [
	{ label: "소개", targetId: "about" },
	{ label: "서비스", targetId: "services" },
	{ label: "문의", targetId: "contact" },
];

export const getFooterLinks = (): FooterLink[] => [
	{ label: "개인정보처리방침", href: "#" },
	{ label: "이용약관", href: "#" },
];
