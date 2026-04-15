import { useState } from "react";
import { getNavItems } from "~/infrastructure/dummy-data";
import { scrollToSection } from "~/presentation/hooks/use-scroll-to-section";
import MobileMenu from "./MobileMenu";

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const navItems = getNavItems();

	return (
		<header className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border shadow-card">
			<div className="flex items-center justify-between px-4 md:px-8 lg:px-12 py-4 max-w-7xl mx-auto">
				<div className="text-xl md:text-2xl font-black tracking-tighter text-primary">
					TechFlow
				</div>
				<nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
					{navItems.map((item) => (
						<button
							key={item.targetId}
							type="button"
							onClick={() => scrollToSection(item.targetId)}
							className="text-on-surface-muted text-sm font-medium hover:text-primary transition-colors"
						>
							{item.label}
						</button>
					))}
				</nav>
				<button
					type="button"
					aria-label="메뉴 열기"
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="md:hidden p-2 text-on-surface"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				</button>
			</div>
			<MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</header>
	);
}
