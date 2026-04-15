import type { ContactFormInput } from "~/domain/schemas/contact.schema";

export type CoreValue = {
	title: string;
	description: string;
	icon?: string;
};

export type ServiceItem = {
	title: string;
	description: string;
	icon?: string;
};

export type HeroSectionProps = {
	companyName: string;
	slogan: string;
	ctaText: string;
	ctaHref: string;
};

export type AboutSectionProps = {
	vision: string;
	mission: string;
	coreValues: CoreValue[];
};

export type ServicesSectionProps = {
	services: ServiceItem[];
};

export type ContactSectionProps = {
	onSubmit?: (data: ContactFormInput) => void;
};
