import { heroData } from "~/infrastructure/dummy-data";
import { Button } from "~/presentation/components/common";

export default function HeroSection() {
	const handleCtaClick = () => {
		const id = heroData.ctaLink.replace("#", "");
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section
			id="hero"
			className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-primary-light to-secondary/80 px-4 text-center text-on-primary md:px-6 lg:px-8"
		>
			{/* Subtle overlay for depth */}
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.15),transparent_70%)]" />

			<div className="relative z-10">
				<h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl xl:text-7xl">
					{heroData.title}
				</h1>
				<p className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-on-primary-muted md:mb-12 md:text-lg lg:text-xl">
					{heroData.subtitle}
				</p>
				<Button size="lg" onClick={handleCtaClick}>
					{heroData.ctaText}
				</Button>
			</div>
		</section>
	);
}
