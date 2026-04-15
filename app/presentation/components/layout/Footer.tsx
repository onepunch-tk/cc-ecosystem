import { getFooterLinks } from "~/infrastructure/dummy-data";

export default function Footer() {
	const links = getFooterLinks();

	return (
		<footer className="w-full bg-primary text-on-primary">
			<div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-10 md:py-12 max-w-7xl mx-auto">
				<div className="text-lg font-bold select-none">
					&copy; 2026 TechFlow. All rights reserved.
				</div>
				<nav aria-label="Footer navigation" className="flex gap-6">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-on-primary-muted text-sm hover:text-on-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-primary rounded-sm transition-colors duration-200"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}
