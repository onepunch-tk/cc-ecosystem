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
			className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary to-primary-light px-4 text-center text-on-primary md:px-6 lg:px-8"
		>
			<h1 className="mb-4 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl xl:text-6xl">
				{heroData.title}
			</h1>
			<p className="mb-8 max-w-2xl text-base leading-relaxed text-on-primary-muted md:mb-10 md:text-lg lg:text-xl">
				{heroData.subtitle}
			</p>
			<Button size="lg" onClick={handleCtaClick}>
				{heroData.ctaText}
			</Button>
		</section>
	);
}
