import { servicesData } from "~/infrastructure/dummy-data";
import { Card, SectionWrapper } from "~/presentation/components/common";

export default function ServicesSection() {
	return (
		<SectionWrapper
			id="services"
			ariaLabel="Our Services"
			title={servicesData.title}
			subtitle={servicesData.subtitle}
			variant="surface"
		>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4">
				{servicesData.services.map((service) => (
					<Card key={service.id}>
						<span className="mb-4 block text-4xl" role="img" aria-hidden="true">
							{service.icon}
						</span>
						<h3 className="mb-2 text-lg font-semibold text-on-surface">
							{service.title}
						</h3>
						<p className="text-sm leading-relaxed text-on-surface-muted">
							{service.description}
						</p>
					</Card>
				))}
			</div>
		</SectionWrapper>
	);
}
