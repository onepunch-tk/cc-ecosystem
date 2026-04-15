import { Card, SectionWrapper } from "~/presentation/components/common";
import { getAboutData } from "~/infrastructure/dummy-data";

export default function AboutSection() {
	const { tagline, heading, vision, mission, coreValues } = getAboutData();

	return (
		<SectionWrapper id="about">
			<div className="mb-12 md:mb-20">
				<div className="flex items-center gap-4 mb-4">
					<div className="h-0.5 w-12 bg-accent" />
					<span className="text-xs font-bold tracking-widest uppercase text-accent">
						{tagline}
					</span>
				</div>
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-on-surface">
					{heading}
				</h2>
			</div>
			<div className="space-y-4 mb-12 md:mb-16 max-w-2xl">
				<p className="text-lg text-on-surface-muted leading-relaxed">
					{vision}
				</p>
				<p className="text-lg text-on-surface-muted leading-relaxed">
					{mission}
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
				{coreValues.map((value) => (
					<Card key={value.title}>
						<div className="text-4xl mb-4">{value.icon}</div>
						<h3 className="text-xl font-semibold text-on-surface mb-2">
							{value.title}
						</h3>
						<p className="text-on-surface-muted leading-relaxed">
							{value.description}
						</p>
					</Card>
				))}
			</div>
		</SectionWrapper>
	);
}
