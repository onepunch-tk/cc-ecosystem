import { useEffect, useState } from "react";

const navLinks = [
	{ label: "About", href: "#about" },
	{ label: "Services", href: "#services" },
	{ label: "Contact", href: "#contact" },
];

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		if (!isMenuOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") setIsMenuOpen(false);
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isMenuOpen]);

	const handleNavClick = (href: string) => {
		setIsMenuOpen(false);
		const id = href.replace("#", "");
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<header className="sticky top-0 z-50 border-b border-on-surface-muted/10 bg-background/95 shadow-nav backdrop-blur-sm">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
				<span className="text-xl font-bold tracking-tight text-primary">TechFlow</span>

				<nav className="hidden gap-8 md:flex">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={(e) => {
								e.preventDefault();
								handleNavClick(link.href);
							}}
							className="text-sm font-medium text-on-surface-muted transition-colors duration-200 hover:text-primary"
						>
							{link.label}
						</a>
					))}
				</nav>

				<button
					type="button"
					aria-label="Menu"
					aria-expanded={isMenuOpen}
					aria-controls="mobile-nav"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="inline-flex items-center justify-center rounded-lg p-2 text-on-surface-muted transition-colors duration-200 hover:bg-surface-container hover:text-primary md:hidden"
				>
					<svg
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						strokeWidth={2}
					>
						{isMenuOpen ? (
							<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
						) : (
							<path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
						)}
					</svg>
				</button>
			</div>

			{isMenuOpen && (
				<nav id="mobile-nav" className="border-t border-on-surface-muted/10 bg-background px-4 py-3 md:hidden">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							onClick={(e) => {
								e.preventDefault();
								handleNavClick(link.href);
							}}
							className="block rounded-md px-2 py-2.5 text-sm font-medium text-on-surface-muted transition-colors duration-200 hover:bg-surface-dim hover:text-primary"
						>
							{link.label}
						</a>
					))}
				</nav>
			)}
		</header>
	);
}
