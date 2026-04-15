import type { Route } from "./+types/home";
import Header from "~/presentation/components/layout/Header";
import Footer from "~/presentation/components/layout/Footer";
import HeroSection from "~/presentation/components/sections/HeroSection";
import AboutSection from "~/presentation/components/sections/AboutSection";
import ServicesSection from "~/presentation/components/sections/ServicesSection";
import ContactSection from "~/presentation/components/sections/ContactSection";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "TechFlow - IT Consulting" },
		{
			name: "description",
			content: "TechFlow IT 컨설팅 서비스",
		},
	];
}

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<HeroSection />
				<AboutSection />
				<ServicesSection />
				<ContactSection />
			</main>
			<Footer />
		</>
	);
}
