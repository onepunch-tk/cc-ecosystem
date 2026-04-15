import { getFooterLinks } from "~/infrastructure/dummy-data";

export default function Footer() {
	const links = getFooterLinks();

	return (
		<footer className="w-full bg-primary text-on-primary">
			<div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-8 lg:px-12 py-8 md:py-12 max-w-7xl mx-auto">
				<div className="text-lg font-bold">
					&copy; 2026 TechFlow. All rights reserved.
				</div>
				<div className="flex gap-6">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-on-primary-muted text-sm hover:text-on-primary transition-colors"
						>
							{link.label}
						</a>
					))}
				</div>
			</div>
		</footer>
	);
}
