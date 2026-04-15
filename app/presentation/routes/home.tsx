import { data } from "react-router";
import type { Route } from "./+types/home";
import { contactService } from "~/infrastructure/config/container";
import Footer from "~/presentation/components/layout/Footer";
import Header from "~/presentation/components/layout/Header";
import AboutSection from "~/presentation/components/sections/AboutSection";
import ContactSection from "~/presentation/components/sections/ContactSection";
import HeroSection from "~/presentation/components/sections/HeroSection";
import ServicesSection from "~/presentation/components/sections/ServicesSection";

export async function action({ request }: Route.ActionArgs) {
	const formData = await request.formData();
	const input: Record<string, string> = {};
	for (const [key, value] of formData.entries()) {
		if (typeof value === "string") {
			input[key] = value;
		}
	}
	const result = await contactService.submitContact(input);
	if (!result.success) {
		return data(result, { status: 400 });
	}
	return result;
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
