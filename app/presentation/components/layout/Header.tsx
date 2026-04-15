import { useState } from "react";
import { getNavItems } from "~/infrastructure/dummy-data";
import { scrollToSection } from "~/presentation/hooks/scroll-to-section";
import MobileMenu from "./MobileMenu";

const navItems = getNavItems();

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	return (
		<header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-card transition-shadow duration-200">
			<div className="flex items-center justify-between px-6 md:px-12 py-4 max-w-7xl mx-auto">
				<div className="text-2xl font-black tracking-tighter text-primary select-none">
					TechFlow
				</div>
				<nav aria-label="Main navigation" className="hidden md:flex items-center gap-8">
					{navItems.map((item) => (
						<button
							key={item.targetId}
							type="button"
							onClick={() => scrollToSection(item.targetId)}
							className="text-on-surface-muted text-sm font-medium hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-sm transition-colors duration-200"
						>
							{item.label}
						</button>
					))}
				</nav>
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => scrollToSection("contact")}
						className="hidden md:inline-flex bg-navy-950 text-white px-5 py-2 rounded-lg font-semibold hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-opacity duration-200"
					>
						상담 신청
					</button>
					<button
						type="button"
						aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
						aria-expanded={isMenuOpen}
						onClick={() => setIsMenuOpen(!isMenuOpen)}
						className="md:hidden p-2 text-on-surface hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-md transition-colors duration-200"
					>
						<span className="material-symbols-outlined" aria-hidden="true">
							{isMenuOpen ? "close" : "menu"}
						</span>
					</button>
				</div>
			</div>
			<MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
		</header>
	);
}
