import { aboutData } from "~/infrastructure/dummy-data";
import { Card, SectionWrapper } from "~/presentation/components/common";

export default function AboutSection() {
	return (
		<SectionWrapper id="about" ariaLabel="About Us" title={aboutData.title}>
			<p className="mx-auto mb-12 max-w-3xl text-center text-base leading-relaxed text-on-surface-muted md:mb-16 md:text-lg">
				{aboutData.description}
			</p>
			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3">
				{aboutData.coreValues.map((value) => (
					<Card key={value.id} className="text-center">
						<span className="mb-4 inline-block text-4xl" role="img" aria-hidden="true">
							{value.icon}
						</span>
						<h3 className="mb-3 text-lg font-semibold text-on-surface md:text-xl">
							{value.title}
						</h3>
						<p className="text-sm leading-relaxed text-on-surface-muted md:text-base">
							{value.description}
						</p>
					</Card>
				))}
			</div>
		</SectionWrapper>
	);
}
