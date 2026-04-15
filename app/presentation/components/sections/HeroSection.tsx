import { Button } from "~/presentation/components/common";
import { getHeroData } from "~/infrastructure/dummy-data";
import { scrollToSection } from "~/presentation/hooks/use-scroll-to-section";

export default function HeroSection() {
	const { headline, subHeadline, ctaText, ctaTargetId } = getHeroData();

	return (
		<section
			id="hero"
			className="relative min-h-screen flex items-center bg-primary text-on-primary overflow-hidden"
		>
			<div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-16 md:py-24">
				<div className="max-w-2xl space-y-6">
					<h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
						{headline}
					</h1>
					<p className="text-lg md:text-xl text-on-primary-muted leading-relaxed max-w-xl">
						{subHeadline}
					</p>
					<Button
						size="lg"
						onClick={() => scrollToSection(ctaTargetId)}
						className="bg-accent text-on-primary hover:bg-accent-hover"
					>
						{ctaText}
					</Button>
				</div>
			</div>
		</section>
	);
}
