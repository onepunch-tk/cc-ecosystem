import Footer from "~/presentation/components/layout/Footer";
import Header from "~/presentation/components/layout/Header";
import AboutSection from "~/presentation/components/sections/AboutSection";
import ContactSection from "~/presentation/components/sections/ContactSection";
import HeroSection from "~/presentation/components/sections/HeroSection";
import ServicesSection from "~/presentation/components/sections/ServicesSection";

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="flex-1 pt-16">
				<HeroSection />
				<AboutSection />
				<ServicesSection />
				<ContactSection />
			</main>
			<Footer />
		</div>
	);
}
