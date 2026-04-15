import { Card, SectionWrapper } from "~/presentation/components/common";
import { getAboutData } from "~/infrastructure/dummy-data";

export default function AboutSection() {
	const { tagline, heading, vision, mission, coreValues } = getAboutData();

	return (
		<SectionWrapper id="about" ariaLabel="회사 소개">
			{/* Section header */}
			<div className="mb-20">
				<div className="flex items-center gap-4 mb-4">
					<div className="h-[2px] w-12 bg-primary" aria-hidden="true" />
					<span className="text-xs font-bold tracking-[0.05em] uppercase text-primary">
						{tagline}
					</span>
				</div>
				<h2 className="text-4xl md:text-5xl font-black tracking-tighter text-on-surface">
					{heading}
				</h2>
			</div>

			{/* Two-column vision/mission content */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24 md:mb-32">
				<div className="space-y-12">
					{/* Vision block with left border accent */}
					<div className="relative pl-6">
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" aria-hidden="true" />
						<h4 className="text-xs font-bold tracking-[0.1em] text-primary mb-3 uppercase">
							Our Vision
						</h4>
						<p className="text-2xl md:text-3xl font-bold text-on-surface leading-tight">
							{vision}
						</p>
					</div>
					{/* Mission block with left border accent */}
					<div className="relative pl-6">
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20" aria-hidden="true" />
						<h4 className="text-xs font-bold tracking-[0.1em] text-primary mb-3 uppercase">
							Our Mission
						</h4>
						<p className="text-lg md:text-xl text-on-surface-muted leading-relaxed">
							{mission}
						</p>
					</div>
				</div>

				{/* Right side decorative visual */}
				<div className="relative hidden md:block" aria-hidden="true">
					<div className="absolute -inset-4 bg-primary/5 rounded-xl blur-2xl" />
					<div className="relative rounded-xl overflow-hidden shadow-card-lg bg-surface h-[450px] flex items-center justify-center">
						<div className="text-center space-y-4 p-8">
							<div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
								<span className="material-symbols-outlined text-primary text-[40px]">groups</span>
							</div>
							<p className="text-on-surface font-bold text-xl">TechFlow Consulting</p>
							<p className="text-on-surface-muted text-sm max-w-xs mx-auto">10+ years of IT consulting expertise with proven methodologies</p>
						</div>
					</div>
				</div>
			</div>

			{/* Three value cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
				{coreValues.map((value) => (
					<Card key={value.title}>
						<div className="w-14 h-14 bg-primary/5 rounded-lg flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-300">
							<span className="material-symbols-outlined text-3xl text-primary group-hover:text-white transition-colors duration-300" aria-hidden="true">
								{value.icon}
							</span>
						</div>
						<h3 className="text-xl font-bold text-on-surface mb-4">
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
