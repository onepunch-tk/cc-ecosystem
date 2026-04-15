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

export const SECTION_IDS = {
	hero: "hero",
	about: "about",
	services: "services",
	contact: "contact",
} as const;
