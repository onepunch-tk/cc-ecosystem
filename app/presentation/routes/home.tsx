import type { Route } from "./+types/home";
import { ContactService } from "~/application/contact/contact.service";
import { ConsoleContactRepository } from "~/infrastructure/persistence/contact/console-contact.repository";
import Footer from "~/presentation/components/layout/Footer";
import Header from "~/presentation/components/layout/Header";
import AboutSection from "~/presentation/components/sections/AboutSection";
import ContactSection from "~/presentation/components/sections/ContactSection";
import HeroSection from "~/presentation/components/sections/HeroSection";
import ServicesSection from "~/presentation/components/sections/ServicesSection";

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const input = Object.fromEntries(formData);
	const repository = new ConsoleContactRepository();
	const service = new ContactService(repository);
	return service.submitContact(input);
}

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
