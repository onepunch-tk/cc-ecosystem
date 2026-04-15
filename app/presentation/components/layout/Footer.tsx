import { getFooterLinks } from "~/infrastructure/dummy-data";

export default function Footer() {
	const links = getFooterLinks();

	return (
		<footer className="w-full bg-footer-bg border-t border-white/10">
			<div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
				{/* Left column: logo + copyright */}
				<div className="flex flex-col items-center md:items-start gap-2">
					<div className="text-2xl font-black text-white tracking-tighter select-none">
						TechFlow
					</div>
					<p className="text-sm text-on-primary-muted">
						&copy; 2024 IT Consulting. All rights reserved.
					</p>
				</div>

				{/* Right column: footer links */}
				<nav aria-label="Footer navigation" className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-2">
					{links.map((link) => (
						<a
							key={link.label}
							href={link.href}
							className="text-sm text-on-primary-muted hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 focus-visible:ring-offset-footer-bg rounded-sm transition-colors duration-200"
						>
							{link.label}
						</a>
					))}
				</nav>
			</div>
		</footer>
	);
}
